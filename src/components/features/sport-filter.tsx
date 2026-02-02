"use client";

import { cn } from "@/lib/utils";
import { SPORTS } from "@/lib/utils";

interface SportFilterProps {
  selected: string;
  onChange: (sport: string) => void;
}

export function SportFilter({ selected, onChange }: SportFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          selected === "all"
            ? "bg-primary text-black"
            : "bg-surface border border-border text-text-muted hover:border-primary/50"
        )}
      >
        All Sports
      </button>
      {SPORTS.map((sport) => (
        <button
          key={sport.value}
          onClick={() => onChange(sport.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            selected === sport.value
              ? "bg-primary text-black"
              : "bg-surface border border-border text-text-muted hover:border-primary/50"
          )}
        >
          {sport.label}
        </button>
      ))}
    </div>
  );
}
