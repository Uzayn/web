import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SportsEventSchema } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResultBadge } from "@/components/features/result-badge";
import { ConfidenceMeter } from "@/components/features/confidence-meter";
import { formatDateTime, SPORTS } from "@/lib/utils";
import { Calendar, TrendingUp, Lock } from "lucide-react";

// This would be fetched from API based on ID
const mockPick = {
  id: "1",
  sport: "nba",
  league: "NBA",
  matchup: "Lakers vs Celtics",
  selection: "Lakers +4.5",
  odds: 1.91,
  stake: 1,
  confidence: "high" as const,
  analysis: `The Lakers come into this matchup with momentum after winning 4 of their last 5 games. Key factors to consider:

• LeBron James has been averaging 28.5 points in his last 10 games against Boston
• The Celtics are on a back-to-back and showed fatigue in their last game
• Historical data shows the Lakers cover the spread 70% of the time as home underdogs
• AD is questionable but expected to play, which will boost their defensive efficiency

The line has moved from +5.5 to +4.5, indicating sharp money on the Lakers. We see value at +4.5 and recommend a full unit play.`,
  is_vip: false,
  result: "win" as const,
  profit_loss: 0.91,
  event_date: new Date().toISOString(),
  settled_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // In production, fetch the pick from the API/DB
  const pick = mockPick;
  const title = `${pick.matchup} Prediction & Betting Tips`;
  const description = `Expert prediction and betting analysis for ${pick.matchup}. Get our ${pick.confidence} confidence pick${pick.odds != null ? ` with odds of ${pick.odds}` : ""} and detailed breakdown.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://winpicks.online/picks/${params.id}`,
      type: "article",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `https://winpicks.online/picks/${params.id}`,
    },
  };
}

export default function PickDetailPage({ params }: { params: { id: string } }) {
  // In production, check if user has VIP access
  const isVip = false;
  const pick = mockPick;

  const sportLabel =
    SPORTS.find((s) => s.value === pick.sport)?.label || pick.sport;

  // Parse teams from matchup
  const teams = pick.matchup.split(" vs ");
  const homeTeam = teams[0] || pick.matchup;
  const awayTeam = teams[1] || "";

  // If VIP pick and user is not VIP, show gated content
  if (pick.is_vip && !isVip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <Breadcrumbs
              items={[
                { label: "Picks", href: "/picks" },
                { label: pick.matchup, href: `/picks/${params.id}` },
              ]}
            />

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-secondary" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                VIP Pick
              </h1>
              <p className="text-text-muted mb-2">{pick.matchup}</p>
              <p className="text-text-muted mb-6">
                This pick is only available to VIP members. Unlock full access to
                all premium picks and detailed analysis.
              </p>
              <Link href="/vip">
                <Button size="lg">Unlock VIP Access</Button>
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Picks", href: "/picks" },
              { label: pick.matchup, href: `/picks/${params.id}` },
            ]}
          />

          {awayTeam && (
            <SportsEventSchema
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              date={pick.event_date}
              description={`Expert prediction for ${pick.matchup}: ${pick.selection}${pick.odds != null ? ` at odds ${pick.odds}` : ""}`}
              url={`https://winpicks.online/picks/${params.id}`}
            />
          )}

          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{sportLabel}</Badge>
              {pick.league && <Badge variant="outline">{pick.league}</Badge>}
              <ResultBadge result={pick.result} />
              {pick.is_vip && <Badge variant="secondary">VIP</Badge>}
            </div>

            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {pick.matchup}
            </h1>

            <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(pick.event_date)}</span>
            </div>

            <div className="bg-background rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary text-lg">
                  {pick.selection}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {pick.odds != null && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Odds</p>
                    <p className="font-semibold text-text-primary">{pick.odds}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-muted mb-1">Confidence</p>
                  <ConfidenceMeter confidence={pick.confidence} />
                </div>
                {pick.profit_loss !== null && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">P/L</p>
                    <p
                      className={`font-semibold ${
                        pick.profit_loss > 0
                          ? "text-primary"
                          : pick.profit_loss < 0
                          ? "text-danger"
                          : "text-text-muted"
                      }`}
                    >
                      {pick.profit_loss > 0 ? "+" : ""}
                      {pick.profit_loss.toFixed(2)}u
                    </p>
                  </div>
                )}
              </div>
            </div>

            {pick.analysis && (
              <div>
                <h2 className="font-semibold text-text-primary mb-3">
                  Analysis
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-muted whitespace-pre-line leading-relaxed">
                    {pick.analysis}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
