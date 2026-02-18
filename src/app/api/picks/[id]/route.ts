import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { data: pick, error } = await supabase
      .from("picks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !pick) {
      return NextResponse.json({ error: "Pick not found" }, { status: 404 });
    }

    return NextResponse.json({ pick });
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

    // Calculate profit/loss if settling
    const updateData: Record<string, unknown> = { ...body };

    if (body.result && body.result !== "pending") {
      const { data: existingPick } = await supabase
        .from("picks")
        .select("odds, stake")
        .eq("id", id)
        .single();

      if (existingPick) {
        const stake = existingPick.stake || 1;
        let profitLoss = 0;

        if (existingPick.odds != null) {
          if (body.result === "win") {
            profitLoss = (existingPick.odds - 1) * stake;
          } else if (body.result === "loss") {
            profitLoss = -stake;
          }
          updateData.profit_loss = profitLoss;
        }

        updateData.settled_at = new Date().toISOString();
      }
    }

    const { data: pick, error } = await supabase
      .from("picks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to update pick" }, { status: 500 });
    }

    return NextResponse.json({ pick });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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
    const supabase = createServiceClient();

    const { error } = await supabase.from("picks").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete pick" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
