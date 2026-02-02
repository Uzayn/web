import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PickCard } from "@/components/features/pick-card";
import { StatsBar } from "@/components/features/stats-bar";
import { Pick } from "@/types";
import { Crown, Lock, ArrowRight } from "lucide-react";

// Mock VIP picks - would come from API
const mockVipPicks: Pick[] = [
  {
    id: "v1",
    sport: "nba",
    league: "NBA",
    matchup: "Warriors vs Suns",
    selection: "Warriors -3.5",
    odds: 1.95,
    stake: 2,
    confidence: "high",
    analysis: "Warriors are 8-2 in their last 10 home games. Curry averaging 32 PPG.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 86400000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "v2",
    sport: "nfl",
    league: "NFL",
    matchup: "Eagles vs Cowboys",
    selection: "Eagles ML",
    odds: 1.65,
    stake: 2,
    confidence: "high",
    analysis: "Eagles dominant at home this season with 7-1 record.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 172800000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "v3",
    sport: "soccer",
    league: "Premier League",
    matchup: "Liverpool vs Man United",
    selection: "Liverpool -1.5",
    odds: 2.20,
    stake: 1,
    confidence: "medium",
    analysis: "Liverpool unbeaten at Anfield this season, United struggling away.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 259200000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
];

const vipStats = {
  totalPicks: 324,
  winRate: 62,
  roi: 18,
  unitsProfit: 78.4,
};

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // In production, check subscription status from database
  // For now, mock as free user to show upgrade prompt
  const isVip = false; // Would be: user.subscription_status === 'vip'

  if (!isVip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-secondary" />
              </div>

              <h1 className="text-2xl font-bold text-text-primary mb-2">
                VIP Access Required
              </h1>

              <p className="text-text-muted mb-6 max-w-md mx-auto">
                Hey {user?.firstName || "there"}! The VIP dashboard is only available
                to premium members. Upgrade now to unlock all VIP picks and detailed
                analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/vip">
                  <Button size="lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to VIP
                  </Button>
                </Link>
                <Link href="/picks">
                  <Button variant="outline" size="lg">
                    View Free Picks
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Teaser of what they're missing */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                What VIP Members Get Access To:
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {mockVipPicks.slice(0, 3).map((pick) => (
                  <Card key={pick.id} className="relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-sm bg-surface/90 z-10 flex flex-col items-center justify-center p-4">
                      <Lock className="w-6 h-6 text-secondary mb-2" />
                      <p className="text-sm text-text-muted text-center">
                        Unlock with VIP
                      </p>
                    </div>
                    <div className="p-4 opacity-30">
                      <Badge variant="outline" className="mb-2">
                        {pick.sport.toUpperCase()}
                      </Badge>
                      <p className="font-medium">{pick.matchup}</p>
                      <p className="text-sm text-primary mt-1">Hidden Selection</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // VIP Dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">
                  VIP Dashboard
                </h1>
                <Badge variant="secondary">
                  <Crown className="w-3 h-3 mr-1" />
                  VIP
                </Badge>
              </div>
              <p className="text-text-muted">
                Welcome back, {user?.firstName || "Champion"}!
              </p>
            </div>
            <Link href="/account">
              <Button variant="outline" size="sm">
                Account Settings
              </Button>
            </Link>
          </div>

          {/* VIP Stats */}
          <div className="mb-6">
            <StatsBar {...vipStats} />
          </div>

          {/* Sport Filter - Client component would handle state */}
          <Card className="mb-6 p-4">
            <p className="text-sm text-text-muted mb-2">Filter by sport:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" className="cursor-pointer">
                All Sports
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:border-primary/50">
                NBA
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:border-primary/50">
                NFL
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:border-primary/50">
                Soccer
              </Badge>
            </div>
          </Card>

          {/* VIP Picks */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Today&apos;s VIP Picks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockVipPicks.map((pick) => (
                <PickCard key={pick.id} pick={pick} showAnalysis />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard/history">
              <Card hover className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Pick History
                    </h3>
                    <p className="text-sm text-text-muted">
                      View all past VIP picks
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted" />
                </div>
              </Card>
            </Link>
            <Link href="/results">
              <Card hover className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Full Track Record
                    </h3>
                    <p className="text-sm text-text-muted">
                      Detailed performance stats
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
