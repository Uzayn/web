"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackRecord } from "@/components/features/track-record";
import { ResultBadge } from "@/components/features/result-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Stats, SportStats, Pick } from "@/types";
import { TrendingUp } from "lucide-react";

export function ResultsContent() {
  const [overall, setOverall] = useState<Stats | null>(null);
  const [bySport, setBySport] = useState<SportStats[]>([]);
  const [recentSettled, setRecentSettled] = useState<Pick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [statsRes, picksRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/picks?includeVip=true"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setOverall(statsData.overall || null);
          setBySport(statsData.bySport || []);
        }

        if (picksRes.ok) {
          const picksData = await picksRes.json();
          // Filter to only settled picks and take most recent 10
          const settled = (picksData.picks || [])
            .filter((p: Pick) => p.result !== "pending")
            .slice(0, 10);
          setRecentSettled(settled);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const defaultStats: Stats = {
    totalPicks: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    pending: 0,
    winRate: 0,
    roi: 0,
    unitsProfit: 0,
  };

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
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              </Card>
            ) : (
              <TrackRecord overall={overall || defaultStats} bySport={bySport} />
            )}
          </div>

          {/* Recent Settled Picks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Settled Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : recentSettled.length > 0 ? (
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
                        <span className="text-sm text-text-muted hidden sm:block">
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
              ) : (
                <p className="text-center text-text-muted py-8">
                  No settled picks yet. Check back after some games have been decided!
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
