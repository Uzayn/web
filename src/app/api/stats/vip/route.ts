import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Check user's subscription status
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription_status")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.subscription_status !== "vip") {
      return NextResponse.json(
        { error: "VIP subscription required" },
        { status: 403 }
      );
    }

    // Get VIP picks stats
    const { data: picks, error } = await supabase
      .from("picks")
      .select("*")
      .eq("is_vip", true)
      .neq("result", "pending");

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch VIP stats" }, { status: 500 });
    }

    if (!picks || picks.length === 0) {
      return NextResponse.json({
        totalPicks: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        winRate: 0,
        roi: 0,
        unitsProfit: 0,
      });
    }

    const wins = picks.filter((p) => p.result === "win").length;
    const losses = picks.filter((p) => p.result === "loss").length;
    const pushes = picks.filter((p) => p.result === "push").length;
    const totalDecided = wins + losses;
    const unitsProfit = picks.reduce((sum, p) => sum + (p.profit_loss || 0), 0);
    const totalStaked = picks.reduce((sum, p) => sum + (p.stake || 1), 0);

    return NextResponse.json({
      totalPicks: picks.length,
      wins,
      losses,
      pushes,
      winRate: totalDecided > 0 ? Math.round((wins / totalDecided) * 100) : 0,
      roi: totalStaked > 0 ? Math.round((unitsProfit / totalStaked) * 100) : 0,
      unitsProfit: Math.round(unitsProfit * 100) / 100,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
