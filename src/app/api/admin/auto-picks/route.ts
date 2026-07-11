import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";
import { mapBaiPicks, type BaiPick, type PickDraft } from "@/lib/bai-picks";

/**
 * Bridge between the bai prediction engine (hosted separately, e.g. Railway) and
 * the WinPicks picks table. All calls to bai happen here, server-side, so the
 * BAI_API_KEY is never exposed to the browser. This route sits under /api/admin,
 * which the middleware already restricts to ADMIN_USER_IDS; we re-check here too.
 *
 *   GET                  -> fetch today's bai picks, mapped to editable drafts
 *   GET ?version=targeted -> only picks from that bai pipeline (e.g. targeted runs)
 *   GET ?status=1        -> proxy bai pipeline run status
 *   POST {action:"run"}  -> trigger the bai daily pipeline
 *   POST {action:"run-targeted", matches:[...]} -> predict a hand-typed match list
 *   POST {action:"publish", picks:[...]} -> bulk insert reviewed picks
 */

/** A match as typed in the admin targeted form; mirrors bai's TargetedMatch. */
export interface TargetedMatchInput {
  home_team: string;
  away_team: string;
  league?: string;
  match_date: string; // ISO date or datetime
  odds?: { home?: number | null; draw?: number | null; away?: number | null };
}

async function requireAdmin(): Promise<string | NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
  if (!adminUserIds.includes(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return userId;
}

function baiConfig(): { url: string; key: string } | null {
  const url = process.env.BAI_API_URL;
  const key = process.env.BAI_API_KEY;
  if (!url) return null;
  return { url: url.replace(/\/$/, ""), key: key || "" };
}

async function baiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const cfg = baiConfig();
  if (!cfg) throw new Error("BAI_API_URL not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  return fetch(`${cfg.url}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cfg.key ? { "x-bai-key": cfg.key } : {}),
      ...(init?.headers || {}),
    },
    signal: controller.signal,
    cache: "no-store",
  }).finally(() => clearTimeout(timeout));
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  if (!baiConfig()) {
    return NextResponse.json(
      { error: "BAI_API_URL not configured", drafts: [] },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);

  // Proxy pipeline status
  if (searchParams.get("status")) {
    try {
      const res = await baiFetch("/api/run/status");
      const data = await res.json();
      return NextResponse.json({ status: data });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Status check failed" },
        { status: 502 }
      );
    }
  }

  // Fetch + map today's picks
  try {
    const version = searchParams.get("version");
    const qs = version ? `?version=${encodeURIComponent(version)}` : "";
    const res = await baiFetch(`/api/picks/today${qs}`);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `bai responded ${res.status}: ${text}`, drafts: [] },
        { status: 502 }
      );
    }
    const picks = (await res.json()) as BaiPick[];
    return NextResponse.json({ drafts: mapBaiPicks(picks) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch bai picks", drafts: [] },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  let body: {
    action?: string;
    picks?: PickDraft[];
    matches?: TargetedMatchInput[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Run predictions on a hand-typed list of matches (bai targeted pipeline)
  if (body.action === "run-targeted") {
    if (!baiConfig()) {
      return NextResponse.json({ error: "BAI_API_URL not configured" }, { status: 503 });
    }
    const matches = body.matches;
    if (!Array.isArray(matches) || matches.length === 0) {
      return NextResponse.json({ error: "No matches provided" }, { status: 400 });
    }
    const invalid = matches.find(
      (m) => !m.home_team?.trim() || !m.away_team?.trim() || !m.match_date
    );
    if (invalid) {
      return NextResponse.json(
        { error: "Each match needs home_team, away_team and match_date" },
        { status: 400 }
      );
    }
    // Strip empty odds so bai's odds-anchored path is only fed real prices.
    const payload = matches.map((m) => {
      const odds =
        m.odds && (m.odds.home || m.odds.draw || m.odds.away)
          ? { home: m.odds.home || null, draw: m.odds.draw || null, away: m.odds.away || null }
          : undefined;
      return {
        home_team: m.home_team.trim(),
        away_team: m.away_team.trim(),
        league: m.league?.trim() || "",
        match_date: m.match_date,
        ...(odds ? { odds } : {}),
      };
    });
    try {
      const res = await baiFetch("/api/run/targeted", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return NextResponse.json({ run: data });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Failed to start targeted run" },
        { status: 502 }
      );
    }
  }

  // Trigger the bai pipeline
  if (body.action === "run") {
    if (!baiConfig()) {
      return NextResponse.json({ error: "BAI_API_URL not configured" }, { status: 503 });
    }
    try {
      const res = await baiFetch("/api/run", { method: "POST" });
      const data = await res.json();
      return NextResponse.json({ run: data });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Failed to start pipeline" },
        { status: 502 }
      );
    }
  }

  // Bulk publish reviewed picks into Supabase
  if (body.action === "publish") {
    const drafts = body.picks;
    if (!Array.isArray(drafts) || drafts.length === 0) {
      return NextResponse.json({ error: "No picks to publish" }, { status: 400 });
    }

    const rows = drafts.map((d) => ({
      sport: d.sport || "soccer",
      league: d.league || null,
      matchup: d.matchup,
      selection: d.selection,
      odds: d.odds ?? null,
      stake: 1,
      confidence: d.confidence || "medium",
      analysis: d.analysis || null,
      is_vip: d.is_vip || false,
      event_date: d.event_date,
      result: "pending",
    }));

    // Guard: every pick needs the NOT NULL columns (matchup, selection, event_date).
    const invalid = rows.find((r) => !r.matchup || !r.selection || !r.event_date);
    if (invalid) {
      return NextResponse.json(
        { error: "Each pick needs matchup, selection and event_date" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase.from("picks").insert(rows).select();

    if (error) {
      console.error("Bulk publish error:", error);
      return NextResponse.json({ error: "Failed to publish picks" }, { status: 500 });
    }

    return NextResponse.json({ published: data?.length ?? 0, picks: data }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
