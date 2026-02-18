"use client";

import { Pick } from "@/types";
import { PickCard, PickCardLocked } from "@/components/features/pick-card";
import { PickCardSkeleton } from "@/components/ui/skeleton";
import { Lock } from "lucide-react";

interface PicksFeedProps {
  picks: Pick[];
  isVip: boolean;
  isLoading: boolean;
}

export function PicksFeed({ picks, isVip, isLoading }: PicksFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-6 w-32 bg-surface rounded mb-3 animate-pulse" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <PickCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const freePicks = picks.filter((p) => !p.is_vip);
  const vipPicks = picks.filter((p) => p.is_vip);

  if (freePicks.length === 0 && vipPicks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-lg">No picks for this date.</p>
        <p className="text-text-muted text-sm mt-1">
          Try navigating to a different day.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {freePicks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Free Picks ({freePicks.length})
          </h2>
          <div className="space-y-2">
            {freePicks.map((pick) => (
              <PickCard key={pick.id} pick={pick} />
            ))}
          </div>
        </section>
      )}

      {vipPicks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-secondary" />
            VIP Picks ({vipPicks.length})
          </h2>
          <div className="space-y-2">
            {vipPicks.map((pick) =>
              isVip ? (
                <PickCard key={pick.id} pick={pick} />
              ) : (
                <PickCardLocked key={pick.id} pick={pick} />
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
