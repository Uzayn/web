import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createServiceClient();

    switch (event.event) {
      case "subscription.create": {
        const { customer, subscription_code, email_token, plan, status } =
          event.data;

        // Find user by email
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("email", customer.email)
          .single();

        if (user) {
          // Create subscription record
          await supabase.from("subscriptions").insert({
            user_id: user.id,
            paystack_subscription_code: subscription_code,
            paystack_email_token: email_token,
            plan: plan.interval === "annually" ? "yearly" : "monthly",
            amount: plan.amount,
            status: status === "active" ? "active" : "cancelled",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() +
                (plan.interval === "annually" ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          });

          // Update user subscription status
          await supabase
            .from("users")
            .update({ subscription_status: "vip" })
            .eq("id", user.id);
        }
        break;
      }

      case "subscription.disable":
      case "subscription.not_renew": {
        const { subscription_code } = event.data;

        // Find subscription
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("paystack_subscription_code", subscription_code)
          .single();

        if (subscription) {
          // Update subscription status
          await supabase
            .from("subscriptions")
            .update({ status: "cancelled" })
            .eq("paystack_subscription_code", subscription_code);

          // Update user to churned (could also check if period_end has passed)
          await supabase
            .from("users")
            .update({ subscription_status: "churned" })
            .eq("id", subscription.user_id);
        }
        break;
      }

      case "charge.success": {
        const { customer, plan } = event.data;

        // If this is a subscription charge, update the period
        if (plan) {
          const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", customer.email)
            .single();

          if (user) {
            // Extend subscription period
            await supabase
              .from("subscriptions")
              .update({
                status: "active",
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(
                  Date.now() +
                    (plan.interval === "annually" ? 365 : 30) * 24 * 60 * 60 * 1000
                ).toISOString(),
              })
              .eq("user_id", user.id);

            // Ensure user is VIP
            await supabase
              .from("users")
              .update({ subscription_status: "vip" })
              .eq("id", user.id);
          }
        }
        break;
      }

      default:
        console.log("Unhandled Paystack event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
