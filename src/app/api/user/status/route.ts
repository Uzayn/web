import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ status: "free", isVip: false });
    }

    const supabase = createServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("subscription_status")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ status: "free", isVip: false });
    }

    return NextResponse.json({
      status: user.subscription_status,
      isVip: user.subscription_status === "vip",
    });
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json({ status: "free", isVip: false });
  }
}
