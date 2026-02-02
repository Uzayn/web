import { TrendingUp, Target, Percent, Trophy } from "lucide-react";

interface StatsBarProps {
  totalPicks: number;
  winRate: number;
  roi: number;
  unitsProfit: number;
}

export function StatsBar({ totalPicks, winRate, roi, unitsProfit }: StatsBarProps) {
  const stats = [
    {
      label: "Total Picks",
      value: totalPicks.toString(),
      icon: Target,
      color: "text-text-primary",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: Percent,
      color: "text-primary",
    },
    {
      label: "ROI",
      value: `${roi > 0 ? "+" : ""}${roi}%`,
      icon: TrendingUp,
      color: roi > 0 ? "text-primary" : roi < 0 ? "text-danger" : "text-text-muted",
    },
    {
      label: "Units Profit",
      value: `${unitsProfit > 0 ? "+" : ""}${unitsProfit.toFixed(1)}u`,
      icon: Trophy,
      color: unitsProfit > 0 ? "text-secondary" : unitsProfit < 0 ? "text-danger" : "text-text-muted",
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-text-muted uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
