import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pick } from "@/types";
import { RESULT_STYLES } from "@/lib/utils";
import { Lock } from "lucide-react";

interface PickCardProps {
  pick: Pick;
  showAnalysis?: boolean;
}

const RESULT_DOT: Record<string, string> = {
  pending: "bg-text-muted",
  win: "bg-primary",
  loss: "bg-danger",
  push: "bg-secondary",
  void: "bg-text-muted",
};

export function PickCard({ pick }: PickCardProps) {
  const resultStyle = RESULT_STYLES[pick.result];
  const isSettled = pick.result !== "pending";

  return (
    <Link href={`/picks/${pick.id}`}>
      <Card
        hover
        className={`!py-2.5 !px-3 ${pick.is_vip ? "border-secondary/50" : ""}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
          <span className="text-xs text-text-muted uppercase tracking-wide md:w-1/3 lg:w-1/4 shrink-0">
            {pick.league || pick.sport}
          </span>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate flex-1">
              {pick.matchup}
            </span>
            <span className="text-sm font-medium text-primary shrink-0">
              {pick.selection}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {isSettled && pick.score && (
                <span className="text-xs text-text-muted font-medium">
                  {pick.score}
                </span>
              )}
              <span
                className={`w-2.5 h-2.5 rounded-full ${RESULT_DOT[pick.result]}`}
                title={resultStyle.label}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface PickCardLockedProps {
  pick: Pick;
}

export function PickCardLocked({ pick: _pick }: PickCardLockedProps) {
  return (
    <Link href="/vip">
      <Card hover className="!py-2.5 !px-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
          {/* Mirrors league/sport slot */}
          <div className="flex items-center gap-1.5 text-xs text-secondary uppercase tracking-wide md:w-1/3 lg:w-1/4 shrink-0">
            <Lock className="w-3 h-3" />
            <span>VIP Pick</span>
          </div>
          {/* Mirrors matchup + selection + result dot slots */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="flex-1 min-w-0">
              <span className="h-2.5 bg-border rounded block w-32" />
            </span>
            <span className="h-2.5 bg-border rounded w-14 shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-border shrink-0" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
