import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get("all") === "true";

    // Check auth first
    const { userId } = await auth();
    const supabase = createServiceClient();

    let isVip = false;
    let isAdmin = false;

    if (userId) {
      const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
      isAdmin = adminUserIds.includes(userId);

      if (!isAdmin) {
        const { data: user } = await supabase
          .from("users")
          .select("subscription_status")
          .eq("clerk_id", userId)
          .single();
        isVip = user?.subscription_status === "vip";
      } else {
        isVip = true;
      }
    }

    // Admin fetching all bundles (not just latest day)
    if (fetchAll && isAdmin) {
      const { data: bundles, error } = await supabase
        .from("pick_bundles")
        .select("*, items:pick_bundle_items(*)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
      }

      return NextResponse.json({ bundles: bundles || [] });
    }

    // Get the most recent bundle date
    const { data: latest } = await supabase
      .from("pick_bundles")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!latest) {
      return NextResponse.json({ bundles: [] });
    }

    const latestDate = new Date(latest.created_at).toISOString().split("T")[0];
    const nextDate = new Date(latestDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    // Fetch all bundles from that same day
    const { data: bundles, error } = await supabase
      .from("pick_bundles")
      .select("*, items:pick_bundle_items(*)")
      .gte("created_at", latestDate)
      .lt("created_at", nextDate.toISOString().split("T")[0])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
    }

    // Strip items for non-VIP users
    const result = (bundles || []).map((bundle) => {
      if (!isVip) {
        const { items: _items, ...rest } = bundle;
        void _items;
        return rest;
      }
      // Sort items by order_index
      return {
        ...bundle,
        items: (bundle.items || []).sort(
          (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
        ),
      };
    });

    return NextResponse.json({ bundles: result });
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

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, items } = body;

    if (!title || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "title and items are required" }, { status: 400 });
    }

    // Calculate total odds as product of all item odds
    const total_odds = items.reduce((product: number, item: { odds: number }) => {
      return product * (parseFloat(String(item.odds)) || 1);
    }, 1);

    const supabase = createServiceClient();

    // Insert bundle
    const { data: bundle, error: bundleError } = await supabase
      .from("pick_bundles")
      .insert({
        title,
        description: description || null,
        total_odds: parseFloat(total_odds.toFixed(2)),
        result: "pending",
      })
      .select()
      .single();

    if (bundleError || !bundle) {
      console.error("Database error:", bundleError);
      return NextResponse.json({ error: "Failed to create bundle" }, { status: 500 });
    }

    // Insert items
    const itemsToInsert = items.map((item: {
      sport: string;
      league?: string;
      matchup: string;
      selection: string;
      odds: number;
      event_date: string;
    }, index: number) => ({
      bundle_id: bundle.id,
      sport: item.sport,
      league: item.league || null,
      matchup: item.matchup,
      selection: item.selection,
      odds: parseFloat(String(item.odds)),
      event_date: item.event_date,
      result: "pending",
      order_index: index,
    }));

    const { error: itemsError } = await supabase
      .from("pick_bundle_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Database error:", itemsError);
      // Rollback bundle
      await supabase.from("pick_bundles").delete().eq("id", bundle.id);
      return NextResponse.json({ error: "Failed to create bundle items" }, { status: 500 });
    }

    return NextResponse.json({ bundle }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
