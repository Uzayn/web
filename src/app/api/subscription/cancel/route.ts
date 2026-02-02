import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Get user's subscription
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel on Paystack
    const response = await fetch(
      `https://api.paystack.co/subscription/disable`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: subscription.paystack_subscription_code,
          token: subscription.paystack_email_token,
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack cancel error:", data);
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    // Update subscription status in database
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subscription.id);

    // Keep user as VIP until period end, then update status
    // This would typically be handled by a webhook or cron job

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
