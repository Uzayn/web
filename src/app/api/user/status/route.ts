import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/users";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ status: "free", isVip: false });
    }

    const user = await ensureUser(userId);

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
