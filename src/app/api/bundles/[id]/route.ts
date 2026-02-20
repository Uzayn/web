import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const supabase = createServiceClient();

    let isVip = false;
    if (userId) {
      const { data: user } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("clerk_id", userId)
        .single();
      isVip = user?.subscription_status === "vip";
    }

    const { data: bundle, error } = await supabase
      .from("pick_bundles")
      .select("*, items:pick_bundle_items(*)")
      .eq("id", id)
      .single();

    if (error || !bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    if (!isVip) {
      const { items: _items, ...rest } = bundle;
      void _items;
      return NextResponse.json({ bundle: rest });
    }

    return NextResponse.json({
      bundle: {
        ...bundle,
        items: (bundle.items || []).sort(
          (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
        ),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const supabase = createServiceClient();

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.result !== undefined) updateData.result = body.result;

    // If new items provided, recalculate total_odds
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      const total_odds = body.items.reduce((product: number, item: { odds: number }) => {
        return product * (parseFloat(String(item.odds)) || 1);
      }, 1);
      updateData.total_odds = parseFloat(total_odds.toFixed(2));
    }

    const { data: bundle, error } = await supabase
      .from("pick_bundles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to update bundle" }, { status: 500 });
    }

    // Replace items if provided
    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      await supabase.from("pick_bundle_items").delete().eq("bundle_id", id);

      const itemsToInsert = body.items.map((item: {
        sport: string;
        league?: string;
        matchup: string;
        selection: string;
        odds: number;
        event_date: string;
      }, index: number) => ({
        bundle_id: id,
        sport: item.sport,
        league: item.league || null,
        matchup: item.matchup,
        selection: item.selection,
        odds: parseFloat(String(item.odds)),
        event_date: item.event_date,
        result: "pending",
        order_index: index,
      }));

      await supabase.from("pick_bundle_items").insert(itemsToInsert);
    }

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const supabase = createServiceClient();

    const { error } = await supabase.from("pick_bundles").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete bundle" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
