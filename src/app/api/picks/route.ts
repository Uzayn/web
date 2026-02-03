import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);

    const sport = searchParams.get("sport");
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const includeVip = searchParams.get("includeVip") === "true";

    let query = supabase
      .from("picks")
      .select("*")
      .order("event_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (date) {
      const nextDate = new Date(date + "T00:00:00Z");
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      const nextDateStr = nextDate.toISOString().split("T")[0];
      query = query.gte("event_date", date).lt("event_date", nextDateStr);
    }

    if (!includeVip) {
      query = query.eq("is_vip", false);
    }

    if (sport && sport !== "all") {
      query = query.eq("sport", sport);
    }

    const { data: picks, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch picks" }, { status: 500 });
    }

    return NextResponse.json({ picks: picks || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createServiceClient();

    const { data: pick, error } = await supabase
      .from("picks")
      .insert({
        sport: body.sport,
        league: body.league || null,
        matchup: body.matchup,
        selection: body.selection,
        odds: body.odds,
        stake: body.stake || 1,
        confidence: body.confidence || "medium",
        analysis: body.analysis || null,
        is_vip: body.is_vip || false,
        event_date: body.event_date,
        result: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to create pick" }, { status: 500 });
    }

    return NextResponse.json({ pick }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
