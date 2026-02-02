import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("subscription_status", status);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get counts
    const { count: totalCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: vipCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "vip");

    const { count: freeCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "free");

    const { count: churnedCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "churned");

    return NextResponse.json({
      users: users || [],
      stats: {
        total: totalCount || 0,
        vip: vipCount || 0,
        free: freeCount || 0,
        churned: churnedCount || 0,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
