"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PickCard, PickCardLocked } from "@/components/features/pick-card";
import { StatsBar } from "@/components/features/stats-bar";
import { SportFilter } from "@/components/features/sport-filter";
import { PickCardSkeleton } from "@/components/ui/skeleton";
import { Pick, Stats, Bundle } from "@/types";
import { BundleCard, BundleCardLocked } from "@/components/features/bundle-card";

export function PicksContent() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedSport, setSelectedSport] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [picksRes, statsRes, statusRes, bundlesRes] = await Promise.all([
          fetch("/api/picks?includeVip=true"),
          fetch("/api/stats"),
          fetch("/api/user/status"),
          fetch("/api/bundles"),
        ]);

        if (picksRes.ok) {
          const picksData = await picksRes.json();
          setPicks(picksData.picks || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.overall || null);
        }

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setIsVip(statusData.isVip || false);
        }

        if (bundlesRes.ok) {
          const bundlesData = await bundlesRes.json();
          setBundles(bundlesData.bundles || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setBundlesLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredPicks = picks.filter(
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

          {stats && (
            <div className="mb-6">
              <StatsBar
                totalPicks={stats.totalPicks}
                winRate={stats.winRate}
                roi={stats.roi}
                unitsProfit={stats.unitsProfit}
              />
            </div>
          )}

          <div className="mb-6">
            <SportFilter selected={selectedSport} onChange={setSelectedSport} />
          </div>

          {/* Bundles Section */}
          {!bundlesLoading && bundles.length > 0 && (
            <div className="mb-6 space-y-2">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">
                VIP Bundles
              </h2>
              {bundles.map((bundle) =>
                isVip ? (
                  <BundleCard key={bundle.id} bundle={bundle} />
                ) : (
                  <BundleCardLocked key={bundle.id} bundle={bundle} />
                )
              )}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(6)].map((_, i) => (
                <PickCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPicks.map((pick) =>
                pick.is_vip && !isVip && pick.result === "pending" ? (
                  <PickCardLocked key={pick.id} pick={pick} />
                ) : (
                  <PickCard key={pick.id} pick={pick} />
                )
              )}
            </div>
          )}

          {!isLoading && filteredPicks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted">
                No picks available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
