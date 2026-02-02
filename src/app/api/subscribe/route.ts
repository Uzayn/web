import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body; // 'monthly' or 'yearly'

    const planCode =
      plan === "yearly"
        ? process.env.PAYSTACK_YEARLY_PLAN_CODE
        : process.env.PAYSTACK_MONTHLY_PLAN_CODE;

    if (!planCode) {
      return NextResponse.json(
        { error: "Plan not configured" },
        { status: 500 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: "No email address found" },
        { status: 400 }
      );
    }

    // Initialize Paystack transaction
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan: planCode,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
          metadata: {
            clerk_user_id: userId,
            plan,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack error:", data);
      return NextResponse.json(
        { error: "Failed to initialize subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
