"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DraftReviewList,
  PublishBar,
  type DraftState,
} from "@/components/features/draft-review";
import type { PickDraft } from "@/lib/bai-picks";
import {
  ArrowLeft,
  Loader2,
  Play,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Targeted predictions: type in a slate of specific matches (any league),
 * with 1X2 odds off the bookmaker, run bai's targeted pipeline on them and
 * review/publish the resulting picks. Matches bai skips (no edge vs the
 * market, or nothing to go on) are listed honestly as "no pick".
 */

interface MatchRow {
  home_team: string;
  away_team: string;
  league: string;
  match_date: string; // YYYY-MM-DD
  odds_home: string;
  odds_draw: string;
  odds_away: string;
}

const POLL_MS = 3000;
const MAX_POLLS = 100; // ~5 min ceiling

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyRow(): MatchRow {
  return {
    home_team: "",
    away_team: "",
    league: "",
    match_date: today(),
    odds_home: "",
    odds_draw: "",
    odds_away: "",
  };
}

function parseOdds(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 1 ? n : null;
}

export default function TargetedPage() {
  const [rows, setRows] = useState<MatchRow[]>([emptyRow()]);
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [noPick, setNoPick] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRow = (i: number, patch: Partial<MatchRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { ...emptyRow(), match_date: prev[prev.length - 1]?.match_date || today() }]);
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const pollStatus = useCallback(async () => {
    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const res = await fetch("/api/admin/auto-picks?status=1", { cache: "no-store" });
      const data = await res.json();
      const st = data.status;
      if (st && st.running === false) {
        if (st.error) throw new Error(st.error);
        return;
      }
    }
    throw new Error("Run still going after timeout — reload in a minute.");
  }, []);

  const run = useCallback(async () => {
    const filled = rows.filter((r) => r.home_team.trim() && r.away_team.trim());
    if (filled.length === 0) {
      toast.error("Add at least one match (home and away team).");
      return;
    }

    setRunning(true);
    setError(null);
    setDrafts([]);
    setNoPick([]);
    try {
      const matches = filled.map((r) => ({
        home_team: r.home_team.trim(),
        away_team: r.away_team.trim(),
        league: r.league.trim(),
        match_date: r.match_date,
        odds: {
          home: parseOdds(r.odds_home),
          draw: parseOdds(r.odds_draw),
          away: parseOdds(r.odds_away),
        },
      }));

      const res = await fetch("/api/admin/auto-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run-targeted", matches }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start targeted run");
      if (data.run?.status === "busy") {
        toast.info("bai is busy with another run — waiting for it to finish.");
      } else {
        toast.success(`Running predictions on ${filled.length} match(es)…`);
      }

      await pollStatus();

      // Fetch only targeted-pipeline picks and keep the ones from this slate.
      const picksRes = await fetch("/api/admin/auto-picks?version=targeted", {
        cache: "no-store",
      });
      const picksData = await picksRes.json();
      if (!picksRes.ok) throw new Error(picksData.error || "Failed to load picks");

      const wanted = new Set(
        filled.map((r) => `${r.home_team.trim().toLowerCase()} vs ${r.away_team.trim().toLowerCase()}`)
      );
      const mapped: DraftState[] = (picksData.drafts || [])
        .filter((d: PickDraft) => wanted.has(d.matchup.toLowerCase()))
        .map((d: PickDraft) => ({ ...d, included: true }));
      setDrafts(mapped);

      const got = new Set(mapped.map((d) => d.matchup.toLowerCase()));
      setNoPick(
        filled
          .map((r) => `${r.home_team.trim()} vs ${r.away_team.trim()}`)
          .filter((m) => !got.has(m.toLowerCase()))
      );

      toast.success(
        mapped.length > 0
          ? `${mapped.length} pick(s) from ${filled.length} match(es).`
          : "Run finished — no picks (no edge found)."
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Targeted run failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  }, [rows, pollStatus]);

  const updateDraft = (i: number, patch: Partial<DraftState>) => {
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const selectedCount = drafts.filter((d) => d.included).length;

  const publish = useCallback(async () => {
    const picks = drafts.filter((d) => d.included);
    if (picks.length === 0) {
      toast.error("Select at least one pick to publish.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/auto-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", picks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      toast.success(`Published ${data.published} pick(s) to the site.`);
      setDrafts((prev) => prev.filter((d) => !d.included));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }, [drafts]);

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-text-muted hover:text-text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text-primary">Targeted Predictions</h1>
        <p className="text-sm text-text-muted mt-1">
          Type in specific matches with their 1X2 odds and run the model on just
          those. Result markets only. Uncovered leagues are priced off the odds
          you enter — a match with no edge is skipped, not guessed.
        </p>
      </div>

      {/* Match entry */}
      <div className="space-y-3 mb-4">
        {rows.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-muted">
                  Match {i + 1}
                </span>
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(i)}
                    className="text-text-muted hover:text-danger"
                    aria-label="Remove match"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <Input
                  label="Home team"
                  value={r.home_team}
                  onChange={(e) => updateRow(i, { home_team: e.target.value })}
                  placeholder="e.g. Haugesund"
                />
                <Input
                  label="Away team"
                  value={r.away_team}
                  onChange={(e) => updateRow(i, { away_team: e.target.value })}
                  placeholder="e.g. Viking"
                />
                <Input
                  label="League (optional)"
                  value={r.league}
                  onChange={(e) => updateRow(i, { league: e.target.value })}
                  placeholder="e.g. Eliteserien, PL, World Cup"
                />
                <Input
                  label="Match date"
                  type="date"
                  value={r.match_date}
                  onChange={(e) => updateRow(i, { match_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Odds 1 (home)"
                  type="number"
                  step="0.01"
                  min="1"
                  value={r.odds_home}
                  onChange={(e) => updateRow(i, { odds_home: e.target.value })}
                  placeholder="2.10"
                />
                <Input
                  label="Odds X (draw)"
                  type="number"
                  step="0.01"
                  min="1"
                  value={r.odds_draw}
                  onChange={(e) => updateRow(i, { odds_draw: e.target.value })}
                  placeholder="3.30"
                />
                <Input
                  label="Odds 2 (away)"
                  type="number"
                  step="0.01"
                  min="1"
                  value={r.odds_away}
                  onChange={(e) => updateRow(i, { odds_away: e.target.value })}
                  placeholder="3.40"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" onClick={addRow} disabled={running}>
          <Plus className="w-4 h-4 mr-2" /> Add match
        </Button>
        <Button onClick={run} isLoading={running} disabled={running}>
          {!running && <Play className="w-4 h-4 mr-2" />}
          Run predictions
        </Button>
      </div>

      {running && (
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Running — covered leagues fetch real stats (rate-limited), so this can
          take a minute or two.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/10 text-danger text-sm mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {noPick.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4 text-sm text-text-muted">
            <p className="font-medium text-text-primary mb-1">
              No pick ({noPick.length})
            </p>
            <p className="mb-2">
              The model found no edge worth taking on these — that&apos;s by design,
              not an error:
            </p>
            <ul className="list-disc pl-5 space-y-0.5">
              {noPick.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Review + publish */}
      {drafts.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Picks to review
          </h2>
          <DraftReviewList drafts={drafts} onUpdate={updateDraft} />
          <PublishBar
            selectedCount={selectedCount}
            total={drafts.length}
            publishing={publishing}
            onPublish={publish}
          />
        </>
      )}
    </div>
  );
}
