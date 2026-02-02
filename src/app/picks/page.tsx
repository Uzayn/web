"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PickCard, PickCardLocked } from "@/components/features/pick-card";
import { StatsBar } from "@/components/features/stats-bar";
import { SportFilter } from "@/components/features/sport-filter";
import { Pick } from "@/types";

// Mock data - would come from API
const mockPicks: Pick[] = [
  {
    id: "1",
    sport: "nba",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    selection: "Lakers +4.5",
    odds: 1.91,
    stake: 1,
    confidence: "high",
    analysis: "Lakers have covered in 7 of their last 10 games against Eastern Conference teams.",
    is_vip: false,
    result: "win",
    profit_loss: 0.91,
    event_date: new Date().toISOString(),
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
    analysis: "Both offenses have been firing lately, expect a high-scoring affair.",
    is_vip: false,
    result: "win",
    profit_loss: 0.87,
    event_date: new Date().toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    sport: "soccer",
    league: "Premier League",
    matchup: "Arsenal vs Chelsea",
    selection: "Both Teams to Score",
    odds: 1.72,
    stake: 1,
    confidence: "high",
    analysis: "Both teams have scored in their last 5 head-to-head meetings.",
    is_vip: false,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 86400000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    sport: "nba",
    league: "NBA",
    matchup: "Warriors vs Suns",
    selection: "Warriors -3.5",
    odds: 1.95,
    stake: 2,
    confidence: "high",
    analysis: "VIP exclusive analysis with detailed breakdown.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 86400000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    sport: "nfl",
    league: "NFL",
    matchup: "Eagles vs Cowboys",
    selection: "Eagles ML",
    odds: 1.65,
    stake: 2,
    confidence: "high",
    analysis: "VIP exclusive pick with in-depth analysis.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 172800000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    sport: "tennis",
    league: "ATP",
    matchup: "Djokovic vs Alcaraz",
    selection: "Over 3.5 Sets",
    odds: 2.10,
    stake: 1,
    confidence: "medium",
    analysis: "These two always go the distance in big matches.",
    is_vip: false,
    result: "loss",
    profit_loss: -1,
    event_date: new Date(Date.now() - 86400000).toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const stats = {
  totalPicks: 847,
  winRate: 58,
  roi: 12,
  unitsProfit: 124.5,
};

export default function PicksPage() {
  const [selectedSport, setSelectedSport] = useState("all");

  // In production, this would check user's subscription status
  const isVip = false;

  const filteredPicks = mockPicks.filter(
    (pick) => selectedSport === "all" || pick.sport === selectedSport
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Betting Picks
            </h1>
            <p className="text-text-muted">
              Expert analysis and predictions for today&apos;s games
            </p>
          </div>

          <div className="mb-6">
            <StatsBar {...stats} />
          </div>

          <div className="mb-6">
            <SportFilter selected={selectedSport} onChange={setSelectedSport} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPicks.map((pick) =>
              pick.is_vip && !isVip ? (
                <PickCardLocked key={pick.id} pick={pick} />
              ) : (
                <PickCard key={pick.id} pick={pick} />
              )
            )}
          </div>

          {filteredPicks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">
                No picks available for this sport yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
