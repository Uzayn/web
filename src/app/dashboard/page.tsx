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
import { Pick, Stats } from "@/types";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

async function getVipPicks(): Promise<Pick[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("picks")
    .select("*")
    .eq("is_vip", true)
    .order("event_date", { ascending: false })
    .limit(6);
  return data || [];
}

async function getVipStats(): Promise<Stats> {
  const supabase = await createClient();
  const { data: picks } = await supabase
    .from("picks")
    .select("*")
    .eq("is_vip", true);

  const allPicks = picks || [];
  const settledPicks = allPicks.filter((p) => p.result !== "pending");
  const wins = settledPicks.filter((p) => p.result === "win").length;
  const losses = settledPicks.filter((p) => p.result === "loss").length;
  const pushes = settledPicks.filter((p) => p.result === "push").length;
  const totalProfit = settledPicks.reduce((sum, p) => sum + (p.profit_loss || 0), 0);

  return {
    totalPicks: allPicks.length,
    wins,
    losses,
    pushes,
    pending: allPicks.filter((p) => p.result === "pending").length,
    winRate: settledPicks.length > 0 ? Math.round((wins / (settledPicks.length - pushes)) * 100) : 0,
    roi: settledPicks.length > 0 ? Math.round((totalProfit / settledPicks.length) * 100) : 0,
    unitsProfit: totalProfit,
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check subscription status from database
  const supabase = await createClient();
  const { data: dbUser } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("clerk_id", userId)
    .single();

  const isVip = dbUser?.subscription_status === "vip";

  // Fetch VIP picks for teaser
  const vipPicks = await getVipPicks();
  const vipStats = await getVipStats();

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
            {vipPicks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                What VIP Members Get Access To:
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {vipPicks.slice(0, 3).map((pick) => (
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
            )}
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
            {vipPicks.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vipPicks.map((pick) => (
                  <PickCard key={pick.id} pick={pick} showAnalysis />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-text-muted">
                  No VIP picks available yet. Check back soon!
                </p>
              </Card>
            )}
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
