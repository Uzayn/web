import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Stats, SportStats } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrackRecordProps {
  overall: Stats;
  bySport?: SportStats[];
}

export function TrackRecord({ overall, bySport }: TrackRecordProps) {
  const TrendIcon =
    overall.roi > 0 ? TrendingUp : overall.roi < 0 ? TrendingDown : Minus;
  const trendColor =
    overall.roi > 0
      ? "text-primary"
      : overall.roi < 0
      ? "text-danger"
      : "text-text-muted";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Track Record
          <TrendIcon className={`w-5 h-5 ${trendColor}`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-text-muted mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-primary">{overall.winRate}%</p>
            <p className="text-xs text-text-muted">
              {overall.wins}W - {overall.losses}L
              {overall.pushes > 0 && ` - ${overall.pushes}P`}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">ROI</p>
            <p className={`text-2xl font-bold ${trendColor}`}>
              {overall.roi > 0 ? "+" : ""}
              {overall.roi}%
            </p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">Units Profit</p>
            <p
              className={`text-2xl font-bold ${
                overall.unitsProfit > 0
                  ? "text-primary"
                  : overall.unitsProfit < 0
                  ? "text-danger"
                  : "text-text-muted"
              }`}
            >
              {overall.unitsProfit > 0 ? "+" : ""}
              {overall.unitsProfit.toFixed(1)}u
            </p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">Total Picks</p>
            <p className="text-2xl font-bold text-text-primary">
              {overall.totalPicks}
            </p>
          </div>
        </div>

        {bySport && bySport.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-text-primary mb-3">
              By Sport
            </p>
            <div className="space-y-2">
              {bySport.map((sport) => (
                <div
                  key={sport.sport}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="font-medium text-text-primary uppercase text-sm">
                    {sport.sport}
                  </span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-muted">
                      {sport.wins}W-{sport.losses}L
                    </span>
                    <span className="text-primary font-medium">
                      {sport.winRate}%
                    </span>
                    <span
                      className={
                        sport.unitsProfit > 0
                          ? "text-primary"
                          : sport.unitsProfit < 0
                          ? "text-danger"
                          : "text-text-muted"
                      }
                    >
                      {sport.unitsProfit > 0 ? "+" : ""}
                      {sport.unitsProfit.toFixed(1)}u
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
