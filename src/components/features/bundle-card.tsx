import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Bundle, BundleItem } from "@/types";
import { Lock, Layers } from "lucide-react";

const RESULT_DOT: Record<string, string> = {
  pending: "bg-text-muted",
  win: "bg-primary",
  loss: "bg-danger",
  void: "bg-text-muted",
};

const RESULT_LABEL: Record<string, string> = {
  pending: "Pending",
  win: "Win",
  loss: "Loss",
  void: "Void",
};

interface BundleCardProps {
  bundle: Bundle;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const items: BundleItem[] = bundle.items || [];

  return (
    <Card className="!p-0 border-secondary/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-secondary" />
          <span className="text-sm font-semibold text-text-primary">{bundle.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
            {bundle.total_odds.toFixed(2)} odds
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${RESULT_DOT[bundle.result]}`}
            title={RESULT_LABEL[bundle.result]}
          />
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border/50">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 px-3 py-2"
          >
            <span className="text-xs text-text-muted uppercase tracking-wide md:w-1/3 lg:w-1/4 shrink-0">
              {item.league || item.sport}
            </span>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-sm font-semibold text-text-primary truncate flex-1">
                {item.matchup}
              </span>
              <span className="text-sm font-medium text-primary shrink-0">
                {item.selection}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-text-muted">{item.odds.toFixed(2)}</span>
                <span
                  className={`w-2 h-2 rounded-full ${RESULT_DOT[item.result]}`}
                  title={RESULT_LABEL[item.result]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {bundle.description && (
        <div className="px-3 py-2 border-t border-border/50">
          <p className="text-xs text-text-muted">{bundle.description}</p>
        </div>
      )}
    </Card>
  );
}

export function BundleCardLocked({ bundle }: BundleCardProps) {
  return (
    <Link href="/vip">
      <Card className="!p-0 overflow-hidden hover:border-secondary/30 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-1.5 text-xs text-secondary uppercase tracking-wide">
            <Lock className="w-3 h-3" />
            <span>VIP Bundle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-secondary/40 bg-secondary/10 px-2 py-0.5 rounded-full blur-sm select-none">
              {bundle.total_odds.toFixed(2)} odds
            </span>
          </div>
        </div>

        {/* Blurred placeholder rows */}
        <div className="divide-y divide-border/50">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-3 py-2"
            >
              <span className="h-2.5 bg-border rounded block w-20 shrink-0" />
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="flex-1 min-w-0">
                  <span className="h-2.5 bg-border rounded block w-36" />
                </span>
                <span className="h-2.5 bg-border rounded w-16 shrink-0" />
                <span className="w-2 h-2 rounded-full bg-border shrink-0" />
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-border/50 text-center">
          <p className="text-xs text-secondary font-medium">Unlock with VIP membership</p>
        </div>
      </Card>
    </Link>
  );
}
