"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DraftReviewList,
  PublishBar,
  type DraftState,
} from "@/components/features/draft-review";
import type { PickDraft } from "@/lib/bai-picks";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Play,
  AlertCircle,
  Crosshair,
} from "lucide-react";
import { toast } from "sonner";

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
      if (data.skipped > 0) {
        toast.info(`${data.skipped} already published — skipped.`);
      }
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
          ones you want to the live site. Works from your phone. For specific
          matches in any league, use{" "}
          <Link href="/admin/targeted" className="text-primary hover:underline">
            <Crosshair className="w-3.5 h-3.5 inline mr-0.5" />
            Targeted
          </Link>
          .
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
        <DraftReviewList drafts={drafts} onUpdate={update} />
      )}

      {/* Sticky publish bar */}
      {drafts.length > 0 && (
        <PublishBar
          selectedCount={selectedCount}
          total={drafts.length}
          publishing={publishing}
          onPublish={publish}
        />
      )}
    </div>
  );
}
