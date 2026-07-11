import type { Confidence } from "@/types";

/**
 * Bridge between the bai prediction engine and WinPicks picks.
 *
 * bai's `GET /api/picks/today` returns rows shaped by api.py:_serialize_picks.
 * This module maps that shape into the draft a WinPicks pick is created from,
 * so the admin can review/edit before publishing into the Supabase `picks` table.
 */

/** A single pick row as returned by bai's /api/picks/today. */
export interface BaiPick {
  id: number;
  prediction_type: string;
  confidence_score: number; // calibrated probability, 0..1
  odds_at_prediction: number | null;
  created_at: string;
  match_date: string;
  league: string | null;
  home_team: string;
  away_team: string;
  matchday: number | null;
  pipeline_version: string | null;
  indicators: string[];
}

/** Editable draft shown in the admin review UI and sent to the publish endpoint. */
export interface PickDraft {
  sport: string;
  league: string | null;
  matchup: string;
  selection: string;
  odds: number | null;
  confidence: Confidence;
  analysis: string | null;
  is_vip: boolean;
  event_date: string;
  // carried through for de-duping / UI keys; not persisted to the picks table
  bai_id: number;
  prediction_type: string;
  confidence_score: number;
}

// Confidence-tier thresholds on bai's calibrated probability. Tunable.
export const CONFIDENCE_HIGH = 0.65;
export const CONFIDENCE_MEDIUM = 0.55;

// Picks at/above this calibrated probability default to VIP (overridable in UI).
export const VIP_DEFAULT_THRESHOLD = CONFIDENCE_HIGH;

export function confidenceTier(score: number): Confidence {
  if (score >= CONFIDENCE_HIGH) return "high";
  if (score >= CONFIDENCE_MEDIUM) return "medium";
  return "low";
}

/** Human-readable selection text for a bai prediction_type. */
export function selectionLabel(
  predictionType: string,
  homeTeam: string,
  awayTeam: string
): string {
  switch (predictionType) {
    case "HOME_WIN":
      return `${homeTeam} to Win`;
    case "AWAY_WIN":
      return `${awayTeam} to Win`;
    case "DOUBLE_CHANCE_1X":
      return `${homeTeam} or Draw (1X)`;
    case "DOUBLE_CHANCE_2X":
      return `${awayTeam} or Draw (X2)`;
    case "OVER_2_5":
      return "Over 2.5 Goals";
    case "OVER_1_5":
      return "Over 1.5 Goals";
    case "BTTS_YES":
      return "Both Teams to Score";
    case "HOME_OVER_0_5":
      return `${homeTeam} Over 0.5 Goals`;
    case "HOME_OVER_1_5":
      return `${homeTeam} Over 1.5 Goals`;
    case "AWAY_OVER_0_5":
      return `${awayTeam} Over 0.5 Goals`;
    case "AWAY_OVER_1_5":
      return `${awayTeam} Over 1.5 Goals`;
    default:
      // Fallback: humanize the raw type so nothing is silently dropped.
      return predictionType.replace(/_/g, " ");
  }
}

function buildAnalysis(p: BaiPick): string | null {
  const pct = Math.round(p.confidence_score * 100);
  const parts: string[] = [`Model confidence: ${pct}%.`];
  if (Array.isArray(p.indicators) && p.indicators.length > 0) {
    parts.push(`Indicators: ${p.indicators.join("; ")}.`);
  }
  return parts.join(" ");
}

/** Map one bai pick into an editable WinPicks draft. */
export function mapBaiPick(p: BaiPick): PickDraft {
  return {
    sport: "soccer",
    league: p.league,
    matchup: `${p.home_team} vs ${p.away_team}`,
    selection: selectionLabel(p.prediction_type, p.home_team, p.away_team),
    odds: p.odds_at_prediction,
    confidence: confidenceTier(p.confidence_score),
    analysis: buildAnalysis(p),
    is_vip: p.confidence_score >= VIP_DEFAULT_THRESHOLD,
    event_date: p.match_date,
    bai_id: p.id,
    prediction_type: p.prediction_type,
    confidence_score: p.confidence_score,
  };
}

export function mapBaiPicks(picks: BaiPick[]): PickDraft[] {
  return picks.map(mapBaiPick);
}
