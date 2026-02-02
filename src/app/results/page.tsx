import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackRecord } from "@/components/features/track-record";
import { ResultBadge } from "@/components/features/result-badge";
import { formatDate } from "@/lib/utils";
import { Stats, SportStats, Pick } from "@/types";
import { TrendingUp, Calendar } from "lucide-react";

// Mock data - would come from API
const overallStats: Stats = {
  totalPicks: 847,
  wins: 491,
  losses: 342,
  pushes: 14,
  pending: 0,
  winRate: 58,
  roi: 12,
  unitsProfit: 124.5,
};

const sportStats: SportStats[] = [
  { sport: "NBA", totalPicks: 245, wins: 148, losses: 93, pushes: 4, pending: 0, winRate: 61, roi: 15, unitsProfit: 42.3 },
  { sport: "NFL", totalPicks: 189, wins: 112, losses: 74, pushes: 3, pending: 0, winRate: 60, roi: 14, unitsProfit: 35.8 },
  { sport: "MLB", totalPicks: 156, wins: 88, losses: 66, pushes: 2, pending: 0, winRate: 57, roi: 9, unitsProfit: 18.2 },
  { sport: "Soccer", totalPicks: 142, wins: 79, losses: 61, pushes: 2, pending: 0, winRate: 56, roi: 8, unitsProfit: 15.1 },
  { sport: "Tennis", totalPicks: 78, wins: 44, losses: 33, pushes: 1, pending: 0, winRate: 57, roi: 10, unitsProfit: 9.4 },
  { sport: "MMA", totalPicks: 37, wins: 20, losses: 15, pushes: 2, pending: 0, winRate: 54, roi: 7, unitsProfit: 3.7 },
];

const monthlyPerformance = [
  { month: "Jan 2025", picks: 72, wins: 43, roi: 14, profit: 12.5 },
  { month: "Dec 2024", picks: 85, wins: 48, roi: 11, profit: 10.2 },
  { month: "Nov 2024", picks: 78, wins: 46, roi: 13, profit: 11.8 },
  { month: "Oct 2024", picks: 82, wins: 45, roi: 9, profit: 8.4 },
  { month: "Sep 2024", picks: 68, wins: 41, roi: 15, profit: 14.2 },
  { month: "Aug 2024", picks: 75, wins: 42, roi: 10, profit: 9.1 },
];

const recentSettled: Pick[] = [
  {
    id: "1",
    sport: "nba",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    selection: "Lakers +4.5",
    odds: 1.91,
    stake: 1,
    confidence: "high",
    analysis: null,
    is_vip: false,
    result: "win",
    profit_loss: 0.91,
    event_date: new Date(Date.now() - 86400000).toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    sport: "nfl",
    league: "NFL",
    matchup: "Chiefs vs Bills",
    selection: "Over 48.5",
    odds: 1.87,
    stake: 1,
    confidence: "medium",
    analysis: null,
    is_vip: false,
    result: "win",
    profit_loss: 0.87,
    event_date: new Date(Date.now() - 172800000).toISOString(),
    settled_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    sport: "tennis",
    league: "ATP",
    matchup: "Djokovic vs Alcaraz",
    selection: "Over 3.5 Sets",
    odds: 2.10,
    stake: 1,
    confidence: "medium",
    analysis: null,
    is_vip: false,
    result: "loss",
    profit_loss: -1,
    event_date: new Date(Date.now() - 259200000).toISOString(),
    settled_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    sport: "soccer",
    league: "Premier League",
    matchup: "Man City vs Arsenal",
    selection: "Under 2.5",
    odds: 2.05,
    stake: 1,
    confidence: "high",
    analysis: null,
    is_vip: true,
    result: "win",
    profit_loss: 1.05,
    event_date: new Date(Date.now() - 345600000).toISOString(),
    settled_at: new Date(Date.now() - 259200000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    sport: "nba",
    league: "NBA",
    matchup: "Bucks vs Heat",
    selection: "Bucks -5.5",
    odds: 1.90,
    stake: 1,
    confidence: "medium",
    analysis: null,
    is_vip: false,
    result: "push",
    profit_loss: 0,
    event_date: new Date(Date.now() - 432000000).toISOString(),
    settled_at: new Date(Date.now() - 345600000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Track Record
            </h1>
            <p className="text-text-muted">
              Full transparency with our verified results
            </p>
          </div>

          {/* Overall Stats */}
          <div className="mb-8">
            <TrackRecord overall={overallStats} bySport={sportStats} />
          </div>

          {/* Monthly Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">
                        Month
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                        Picks
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                        Wins
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                        Win %
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                        ROI
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyPerformance.map((month) => (
                      <tr
                        key={month.month}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 px-2 font-medium text-text-primary">
                          {month.month}
                        </td>
                        <td className="py-3 px-2 text-center text-text-muted">
                          {month.picks}
                        </td>
                        <td className="py-3 px-2 text-center text-text-muted">
                          {month.wins}
                        </td>
                        <td className="py-3 px-2 text-center text-primary">
                          {Math.round((month.wins / month.picks) * 100)}%
                        </td>
                        <td className="py-3 px-2 text-center text-primary">
                          +{month.roi}%
                        </td>
                        <td
                          className={`py-3 px-2 text-right font-medium ${
                            month.profit > 0 ? "text-primary" : "text-danger"
                          }`}
                        >
                          {month.profit > 0 ? "+" : ""}
                          {month.profit.toFixed(1)}u
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Settled Picks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Settled Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSettled.map((pick) => (
                  <div
                    key={pick.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="uppercase">
                        {pick.sport}
                      </Badge>
                      <div>
                        <p className="font-medium text-text-primary">
                          {pick.matchup}
                        </p>
                        <p className="text-sm text-primary">{pick.selection}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-text-muted">
                        {formatDate(pick.event_date)}
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
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
