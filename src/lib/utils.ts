import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const RESULT_STYLES = {
  pending: { bg: "bg-text-muted/20", text: "text-text-muted", label: "Pending" },
  win: { bg: "bg-primary/20", text: "text-primary", label: "Win" },
  loss: { bg: "bg-danger/20", text: "text-danger", label: "Loss" },
  push: { bg: "bg-secondary/20", text: "text-secondary", label: "Push" },
  void: { bg: "bg-text-muted/20", text: "text-text-muted", label: "Void" },
} as const;
