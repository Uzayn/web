import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const vipOnly = searchParams.get("vip") === "true";

    // Get all settled picks
    let query = supabase
      .from("picks")
      .select("*")
      .neq("result", "pending");

    if (vipOnly) {
      query = query.eq("is_vip", true);
    }

    const { data: picks, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    if (!picks || picks.length === 0) {
      return NextResponse.json({
        overall: {
          totalPicks: 0,
          wins: 0,
          losses: 0,
          pushes: 0,
          pending: 0,
          winRate: 0,
          roi: 0,
          unitsProfit: 0,
        },
        bySport: [],
      });
    }

    // Calculate overall stats
    const wins = picks.filter((p) => p.result === "win").length;
    const losses = picks.filter((p) => p.result === "loss").length;
    const pushes = picks.filter((p) => p.result === "push").length;
    // Note: voids are filtered out of total decided count
    const totalDecided = wins + losses;
    const unitsProfit = picks.reduce((sum, p) => sum + (p.profit_loss || 0), 0);
    const totalStaked = picks.reduce((sum, p) => sum + (p.stake || 1), 0);

    const overall = {
      totalPicks: picks.length,
      wins,
      losses,
      pushes,
      pending: 0,
      winRate: totalDecided > 0 ? Math.round((wins / totalDecided) * 100) : 0,
      roi: totalStaked > 0 ? Math.round((unitsProfit / totalStaked) * 100) : 0,
      unitsProfit: Math.round(unitsProfit * 100) / 100,
    };

    // Calculate stats by sport
    type PickType = (typeof picks)[number];
    const sportGroups: Record<string, PickType[]> = {};

    picks.forEach((pick) => {
      if (!sportGroups[pick.sport]) {
        sportGroups[pick.sport] = [];
      }
      sportGroups[pick.sport].push(pick);
    });

    const bySport = Object.entries(sportGroups).map(([sport, sportPicks]) => {
      const sportWins = sportPicks.filter((p) => p.result === "win").length;
      const sportLosses = sportPicks.filter((p) => p.result === "loss").length;
      const sportPushes = sportPicks.filter((p) => p.result === "push").length;
      const sportDecided = sportWins + sportLosses;
      const sportProfit = sportPicks.reduce((sum, p) => sum + (p.profit_loss || 0), 0);
      const sportStaked = sportPicks.reduce((sum, p) => sum + (p.stake || 1), 0);

      return {
        sport: sport.toUpperCase(),
        totalPicks: sportPicks.length,
        wins: sportWins,
        losses: sportLosses,
        pushes: sportPushes,
        pending: 0,
        winRate: sportDecided > 0 ? Math.round((sportWins / sportDecided) * 100) : 0,
        roi: sportStaked > 0 ? Math.round((sportProfit / sportStaked) * 100) : 0,
        unitsProfit: Math.round(sportProfit * 100) / 100,
      };
    });

    return NextResponse.json({ overall, bySport });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
