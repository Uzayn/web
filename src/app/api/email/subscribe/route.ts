import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("email_subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      // Already subscribed, just return success
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    // Add new subscriber
    const { error } = await supabase.from("email_subscribers").insert({
      email: email.toLowerCase(),
    });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
