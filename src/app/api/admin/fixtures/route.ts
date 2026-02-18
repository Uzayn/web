import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchFixtures } from "@/lib/fixtures";

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

    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport") || "soccer";
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    try {
      const fixtures = await fetchFixtures(sport, date);
      return NextResponse.json({ fixtures });
    } catch (fetchError) {
      console.error("Fixture fetch failed:", fetchError);
      // Return 200 with empty fixtures + error message so the client
      // can fall back to manual mode gracefully instead of erroring out
      return NextResponse.json({
        fixtures: [],
        error: fetchError instanceof Error ? fetchError.message : "Fetch failed",
      });
    }
  } catch (error) {
    console.error("Fixtures API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", fixtures: [] },
      { status: 500 }
    );
  }
}
