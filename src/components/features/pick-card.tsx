import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pick } from "@/types";
import { formatDateTime, RESULT_STYLES, CONFIDENCE_LEVELS } from "@/lib/utils";
import { Clock, TrendingUp, Lock } from "lucide-react";

interface PickCardProps {
  pick: Pick;
  showAnalysis?: boolean;
}

export function PickCard({ pick, showAnalysis = false }: PickCardProps) {
  const resultStyle = RESULT_STYLES[pick.result];
  const confidenceLevel = CONFIDENCE_LEVELS.find(
    (c) => c.value === pick.confidence
  );

  return (
    <Link href={`/picks/${pick.id}`}>
      <Card hover className="h-full">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{pick.sport.toUpperCase()}</Badge>
          <Badge className={`${resultStyle.bg} ${resultStyle.text} border-0`}>
            {resultStyle.label}
          </Badge>
        </div>

        <h3 className="font-semibold text-text-primary mb-1">{pick.matchup}</h3>

        {pick.league && (
          <p className="text-sm text-text-muted mb-2">{pick.league}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-medium text-primary">{pick.selection}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-text-muted">
              Odds: <span className="text-text-primary font-medium">{pick.odds}</span>
            </span>
            {confidenceLevel && (
              <span className={`${confidenceLevel.color}`}>
                {confidenceLevel.label} Confidence
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border text-xs text-text-muted">
          <Clock className="w-3 h-3" />
          <span>{formatDateTime(pick.event_date)}</span>
        </div>

        {showAnalysis && pick.analysis && (
          <p className="mt-3 pt-3 border-t border-border text-sm text-text-muted line-clamp-2">
            {pick.analysis}
          </p>
        )}

        {pick.result !== "pending" && pick.profit_loss !== null && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-sm text-text-muted">P/L: </span>
            <span
              className={`font-medium ${
                pick.profit_loss > 0
                  ? "text-primary"
                  : pick.profit_loss < 0
                  ? "text-danger"
                  : "text-text-muted"
              }`}
            >
              {pick.profit_loss > 0 ? "+" : ""}
              {pick.profit_loss.toFixed(2)}u
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}

interface PickCardLockedProps {
  pick: Pick;
}

export function PickCardLocked({ pick }: PickCardLockedProps) {
  return (
    <Link href="/vip">
      <Card hover className="h-full relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-surface/80 z-10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-secondary" />
          </div>
          <p className="font-semibold text-text-primary mb-1">VIP Pick</p>
          <p className="text-sm text-text-muted">Unlock with VIP</p>
        </div>

        <div className="opacity-50">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline">{pick.sport.toUpperCase()}</Badge>
            <Badge variant="secondary">VIP</Badge>
          </div>

          <h3 className="font-semibold text-text-primary mb-1">{pick.matchup}</h3>

          <div className="h-4 bg-border rounded w-2/3 mb-3" />
          <div className="h-4 bg-border rounded w-1/2" />
        </div>
      </Card>
    </Link>
  );
}
