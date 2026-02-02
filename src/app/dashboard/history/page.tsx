import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultBadge } from "@/components/features/result-badge";
import { formatDate } from "@/lib/utils";
import { Pick } from "@/types";
import { ArrowLeft, History } from "lucide-react";

// Mock history data
const pickHistory: Pick[] = [
  {
    id: "h1",
    sport: "nba",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    selection: "Lakers +4.5",
    odds: 1.91,
    stake: 1,
    confidence: "high",
    analysis: null,
    is_vip: true,
    result: "win",
    profit_loss: 0.91,
    event_date: new Date(Date.now() - 86400000).toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "h2",
    sport: "nfl",
    league: "NFL",
    matchup: "Chiefs vs Bills",
    selection: "Over 48.5",
    odds: 1.87,
    stake: 2,
    confidence: "high",
    analysis: null,
    is_vip: true,
    result: "win",
    profit_loss: 1.74,
    event_date: new Date(Date.now() - 172800000).toISOString(),
    settled_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "h3",
    sport: "soccer",
    league: "Premier League",
    matchup: "Arsenal vs Chelsea",
    selection: "Arsenal ML",
    odds: 2.10,
    stake: 1,
    confidence: "medium",
    analysis: null,
    is_vip: true,
    result: "loss",
    profit_loss: -1,
    event_date: new Date(Date.now() - 259200000).toISOString(),
    settled_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "h4",
    sport: "nba",
    league: "NBA",
    matchup: "Bucks vs Heat",
    selection: "Under 215.5",
    odds: 1.90,
    stake: 1,
    confidence: "medium",
    analysis: null,
    is_vip: true,
    result: "win",
    profit_loss: 0.90,
    event_date: new Date(Date.now() - 345600000).toISOString(),
    settled_at: new Date(Date.now() - 259200000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "h5",
    sport: "tennis",
    league: "ATP",
    matchup: "Djokovic vs Sinner",
    selection: "Sinner +1.5 Sets",
    odds: 1.75,
    stake: 1,
    confidence: "high",
    analysis: null,
    is_vip: true,
    result: "win",
    profit_loss: 0.75,
    event_date: new Date(Date.now() - 432000000).toISOString(),
    settled_at: new Date(Date.now() - 345600000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Calculate summary
  const totalPicks = pickHistory.length;
  const wins = pickHistory.filter((p) => p.result === "win").length;
  const losses = pickHistory.filter((p) => p.result === "loss").length;
  const totalProfit = pickHistory.reduce(
    (sum, p) => sum + (p.profit_loss || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Pick History
              </h1>
              <p className="text-text-muted text-sm">
                Your VIP picks and results
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-1">Total Picks</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {totalPicks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-1">Record</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {wins}W - {losses}L
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round((wins / totalPicks) * 100)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-muted mb-1">Total P/L</p>
                  <p
                    className={`text-2xl font-bold ${
                      totalProfit > 0 ? "text-primary" : "text-danger"
                    }`}
                  >
                    {totalProfit > 0 ? "+" : ""}
                    {totalProfit.toFixed(2)}u
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pick History Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Picks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pickHistory.map((pick) => (
                  <div
                    key={pick.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="uppercase min-w-[60px] justify-center">
                        {pick.sport}
                      </Badge>
                      <div>
                        <p className="font-medium text-text-primary">
                          {pick.matchup}
                        </p>
                        <p className="text-sm text-primary">{pick.selection}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-text-muted hidden sm:block">
                        {formatDate(pick.event_date)}
                      </span>
                      <span className="text-text-muted">
                        {pick.odds}
                      </span>
                      <ResultBadge result={pick.result} />
                      <span
                        className={`font-medium min-w-[60px] text-right ${
                          pick.profit_loss !== null && pick.profit_loss > 0
                            ? "text-primary"
                            : pick.profit_loss !== null && pick.profit_loss < 0
                            ? "text-danger"
                            : "text-text-muted"
                        }`}
                      >
                        {pick.profit_loss !== null
                          ? `${pick.profit_loss > 0 ? "+" : ""}${pick.profit_loss.toFixed(2)}u`
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {pickHistory.length === 0 && (
                <p className="text-center text-text-muted py-8">
                  No picks in your history yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
