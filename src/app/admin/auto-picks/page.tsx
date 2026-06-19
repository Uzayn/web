"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CONFIDENCE_LEVELS, formatDateTime } from "@/lib/utils";
import type { Confidence } from "@/types";
import type { PickDraft } from "@/lib/bai-picks";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Play,
  Upload,
  AlertCircle,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

interface DraftState extends PickDraft {
  included: boolean;
}

const POLL_MS = 3000;
const MAX_POLLS = 100; // ~5 min ceiling

export default function AutoPicksPage() {
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadPicks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auto-picks", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load picks");
      const mapped: DraftState[] = (data.drafts || []).map((d: PickDraft) => ({
        ...d,
        included: true,
      }));
      setDrafts(mapped);
      setLoaded(true);
      if (mapped.length === 0) {
        toast.info("No picks returned. Try running the pipeline first.");
      } else {
        toast.success(`Loaded ${mapped.length} candidate pick(s).`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load picks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const pollStatus = useCallback(async () => {
    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      try {
        const res = await fetch("/api/admin/auto-picks?status=1", {
          cache: "no-store",
        });
        const data = await res.json();
        const st = data.status;
        if (st && st.running === false) {
          if (st.error) throw new Error(st.error);
          return true;
        }
      } catch (e) {
        throw e instanceof Error ? e : new Error("Status check failed");
      }
    }
    throw new Error("Pipeline still running after timeout — try Load Picks shortly.");
  }, []);

  const runPipeline = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auto-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start pipeline");

      if (data.run?.status === "busy") {
        toast.info("Pipeline already running — waiting for it to finish.");
      } else {
        toast.success("Pipeline started. This can take a few minutes…");
      }
      await pollStatus();
      toast.success("Pipeline finished. Loading picks…");
      await loadPicks();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Pipeline failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  }, [pollStatus, loadPicks]);

  const update = (i: number, patch: Partial<DraftState>) => {
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const selectedCount = drafts.filter((d) => d.included).length;

  const publish = useCallback(async () => {
    const picks = drafts.filter((d) => d.included);
    if (picks.length === 0) {
      toast.error("Select at least one pick to publish.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/auto-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", picks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      toast.success(`Published ${data.published} pick(s) to the site.`);
      // Drop the published ones from the review list
      setDrafts((prev) => prev.filter((d) => !d.included));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }, [drafts]);

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-text-muted hover:text-text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
      </Link>

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text-primary">Auto Picks</h1>
        <p className="text-sm text-text-muted mt-1">
          Run the bai prediction pipeline, review the candidates, then publish the
          ones you want to the live site. Works from your phone.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Button onClick={runPipeline} isLoading={running} disabled={running || loading}>
          {!running && <Play className="w-4 h-4 mr-2" />}
          Run pipeline
        </Button>
        <Button
          variant="outline"
          onClick={loadPicks}
          isLoading={loading}
          disabled={running || loading}
        >
          {!loading && <RefreshCw className="w-4 h-4 mr-2" />}
          Load picks
        </Button>
      </div>

      {running && (
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Pipeline running — fetching fixtures, stats and odds. This can take a few
          minutes (rate-limited APIs).
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/10 text-danger text-sm mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Review list */}
      {drafts.length === 0 && loaded && !loading ? (
        <Card>
          <CardContent className="py-10 text-center text-text-muted">
            No candidate picks. Run the pipeline, then load picks.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {drafts.map((d, i) => (
            <Card
              key={`${d.bai_id}-${i}`}
              className={d.included ? "" : "opacity-50"}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={d.included}
                    onChange={(e) => update(i, { included: e.target.checked })}
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
                        onChange={(e) => update(i, { selection: e.target.value })}
                      />
                      <Input
                        label="Odds"
                        type="number"
                        step="0.01"
                        value={d.odds ?? ""}
                        onChange={(e) =>
                          update(i, {
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
                          update(i, { confidence: e.target.value as Confidence })
                        }
                      />
                      <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer py-2">
                          <input
                            type="checkbox"
                            checked={d.is_vip}
                            onChange={(e) => update(i, { is_vip: e.target.checked })}
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
                      onChange={(e) => update(i, { analysis: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sticky publish bar */}
      {drafts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 border-t border-border bg-surface/95 backdrop-blur p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <span className="text-sm text-text-muted">
              {selectedCount} of {drafts.length} selected
            </span>
            <Button onClick={publish} isLoading={publishing} disabled={publishing || selectedCount === 0}>
              {!publishing && <Upload className="w-4 h-4 mr-2" />}
              Publish {selectedCount > 0 ? selectedCount : ""}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
