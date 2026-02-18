import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday as isTodayFn, isTomorrow as isTomorrowFn } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNavigatorDate(date: Date): string {
  if (isTodayFn(date)) {
    return `Today, ${format(date, "MMM d")}`;
  }
  if (isTomorrowFn(date)) {
    return `Tomorrow, ${format(date, "MMM d")}`;
  }
  return format(date, "EEEE, MMM d");
}

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatOdds(odds: number): string {
  return odds >= 0 ? `+${odds}` : odds.toFixed(2);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function calculateProfitLoss(
  result: string,
  odds: number,
  stake: number = 1
): number {
  switch (result) {
    case "win":
      return (odds - 1) * stake;
    case "loss":
      return -stake;
    case "push":
    case "void":
      return 0;
    default:
      return 0;
  }
}

export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

export function calculateROI(profit: number, totalStaked: number): number {
  if (totalStaked === 0) return 0;
  return Math.round((profit / totalStaked) * 100);
}

export const SPORTS = [
  { value: "nfl", label: "NFL" },
  { value: "nba", label: "NBA" },
  { value: "mlb", label: "MLB" },
  { value: "nhl", label: "NHL" },
  { value: "soccer", label: "Soccer" },
  { value: "tennis", label: "Tennis" },
  { value: "mma", label: "MMA" },
  { value: "boxing", label: "Boxing" },
  { value: "golf", label: "Golf" },
  { value: "esports", label: "Esports" },
] as const;

export const CONFIDENCE_LEVELS = [
  { value: "low", label: "Low", color: "text-text-muted" },
  { value: "medium", label: "Medium", color: "text-secondary" },
  { value: "high", label: "High", color: "text-primary" },
] as const;

export const SELECTION_PRESETS: Record<string, string[]> = {
  soccer: [
    "Home Win", "Draw", "Away Win",
    "Over 0.5", "Over 1.5", "Over 2.5", "Over 3.5",
    "Under 0.5", "Under 1.5", "Under 2.5", "Under 3.5",
    "BTTS Yes", "BTTS No",
    "Home or Draw", "Away or Draw", "Home or Away",
  ],
  nba: [
    "Home Win", "Away Win",
    "Home Spread", "Away Spread",
    "Over", "Under",
  ],
  nfl: [
    "Home Win", "Away Win",
    "Home Spread", "Away Spread",
    "Over", "Under",
  ],
  mlb: [
    "Home Win", "Away Win",
    "Home Spread", "Away Spread",
    "Over", "Under",
  ],
  nhl: [
    "Home Win", "Away Win",
    "Over", "Under",
  ],
  mma: [
    "Fighter 1", "Fighter 2",
    "Over Rounds", "Under Rounds",
    "KO/TKO", "Submission", "Decision",
  ],
  boxing: [
    "Fighter 1", "Fighter 2", "Draw",
    "Over Rounds", "Under Rounds",
    "KO/TKO", "Decision",
  ],
  tennis: [
    "Player 1", "Player 2",
    "Over Sets", "Under Sets",
    "Over Games", "Under Games",
  ],
};

export const RESULT_STYLES = {
  pending: { bg: "bg-text-muted/20", text: "text-text-muted", label: "Pending" },
  win: { bg: "bg-primary/20", text: "text-primary", label: "Win" },
  loss: { bg: "bg-danger/20", text: "text-danger", label: "Loss" },
  push: { bg: "bg-secondary/20", text: "text-secondary", label: "Push" },
  void: { bg: "bg-text-muted/20", text: "text-text-muted", label: "Void" },
} as const;
