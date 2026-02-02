import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("picks")
      .select("*")
      .eq("is_vip", true)
      .order("event_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (sport && sport !== "all") {
      query = query.eq("sport", sport);
    }

    const { data: picks, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch VIP picks" }, { status: 500 });
    }

    return NextResponse.json({ picks: picks || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
