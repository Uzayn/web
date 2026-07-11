"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CONFIDENCE_LEVELS, formatDateTime } from "@/lib/utils";
import type { Confidence } from "@/types";
import type { PickDraft } from "@/lib/bai-picks";
import { Upload, Crown } from "lucide-react";

/**
 * Shared review UI for bai pick drafts — used by both the Auto Picks (daily
 * pipeline) and Targeted admin pages so the two review flows can't drift.
 */

export interface DraftState extends PickDraft {
  included: boolean;
}

export function DraftReviewList({
  drafts,
  onUpdate,
}: {
  drafts: DraftState[];
  onUpdate: (index: number, patch: Partial<DraftState>) => void;
}) {
  return (
    <div className="space-y-3">
      {drafts.map((d, i) => (
        <Card key={`${d.bai_id}-${i}`} className={d.included ? "" : "opacity-50"}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={d.included}
                onChange={(e) => onUpdate(i, { included: e.target.checked })}
                className="mt-1.5 w-4 h-4 accent-primary cursor-pointer"
                aria-label="Include this pick"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-text-primary truncate">
                    {d.matchup}
                  </p>
                  {d.is_vip && (
                    <Badge className="bg-primary/20 text-primary shrink-0">
                      <Crown className="w-3 h-3 mr-1" /> VIP
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted mb-3">
                  {d.league || "—"} · {formatDateTime(d.event_date)} ·{" "}
                  {Math.round(d.confidence_score * 100)}% model
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Selection"
                    value={d.selection}
                    onChange={(e) => onUpdate(i, { selection: e.target.value })}
                  />
                  <Input
                    label="Odds"
                    type="number"
                    step="0.01"
                    value={d.odds ?? ""}
                    onChange={(e) =>
                      onUpdate(i, {
                        odds: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                  <Select
                    label="Confidence"
                    value={d.confidence}
                    options={CONFIDENCE_LEVELS.map((c) => ({
                      value: c.value,
                      label: c.label,
                    }))}
                    onChange={(e) =>
                      onUpdate(i, { confidence: e.target.value as Confidence })
                    }
                  />
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer py-2">
                      <input
                        type="checkbox"
                        checked={d.is_vip}
                        onChange={(e) => onUpdate(i, { is_vip: e.target.checked })}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      VIP only
                    </label>
                  </div>
                </div>

                <Textarea
                  label="Analysis"
                  className="mt-3"
                  rows={2}
                  value={d.analysis ?? ""}
                  onChange={(e) => onUpdate(i, { analysis: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PublishBar({
  selectedCount,
  total,
  publishing,
  onPublish,
}: {
  selectedCount: number;
  total: number;
  publishing: boolean;
  onPublish: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-64 border-t border-border bg-surface/95 backdrop-blur p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <span className="text-sm text-text-muted">
          {selectedCount} of {total} selected
        </span>
        <Button
          onClick={onPublish}
          isLoading={publishing}
          disabled={publishing || selectedCount === 0}
        >
          {!publishing && <Upload className="w-4 h-4 mr-2" />}
          Publish {selectedCount > 0 ? selectedCount : ""}
        </Button>
      </div>
    </div>
  );
}
