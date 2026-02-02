import { cn } from "@/lib/utils";
import { Confidence } from "@/types";

interface ConfidenceMeterProps {
  confidence: Confidence;
  showLabel?: boolean;
}

export function ConfidenceMeter({ confidence, showLabel = true }: ConfidenceMeterProps) {
  const levels = {
    low: { bars: 1, color: "bg-text-muted", label: "Low" },
    medium: { bars: 2, color: "bg-secondary", label: "Medium" },
    high: { bars: 3, color: "bg-primary", label: "High" },
  };

  const level = levels[confidence];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1.5 rounded-sm transition-colors",
              bar === 1 && "h-2",
              bar === 2 && "h-3",
              bar === 3 && "h-4",
              bar <= level.bars ? level.color : "bg-border"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-text-muted">{level.label}</span>
      )}
    </div>
  );
}
