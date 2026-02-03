"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { isTomorrow } from "date-fns";
import { formatNavigatorDate } from "@/lib/utils";

interface DateNavigatorProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function DateNavigator({
  currentDate,
  onPrevious,
  onNext,
}: DateNavigatorProps) {
  const isTomorrowDay = isTomorrow(currentDate);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrevious}
        className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/50 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-lg font-semibold text-text-primary min-w-[200px] text-center">
        {formatNavigatorDate(currentDate)}
      </span>

      <button
        onClick={onNext}
        disabled={isTomorrowDay}
        className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary hover:border-primary/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-text-muted"
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
