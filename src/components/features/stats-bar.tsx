import { TrendingUp, Percent } from "lucide-react";

interface StatsBarProps {
  totalPicks: number;
  winRate: number;
  roi: number;
  unitsProfit: number;
}

export function StatsBar({ winRate, roi }: StatsBarProps) {
  const stats = [
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
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="grid grid-cols-2 gap-4">
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
