"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SPORTS, CONFIDENCE_LEVELS, SELECTION_PRESETS } from "@/lib/utils";
import { Pick } from "@/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditPickPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pick, setPick] = useState<Pick | null>(null);

  const [formData, setFormData] = useState({
    sport: "",
    league: "",
    matchup: "",
    selection: "",
    odds: "",
    confidence: "medium",
    analysis: "",
    is_vip: false,
    event_date: "",
    result: "pending" as string,
  });

  useEffect(() => {
    const fetchPick = async () => {
      try {
        const res = await fetch(`/api/picks/${id}`);
        if (!res.ok) {
          toast.error("Pick not found");
          router.push("/admin/picks");
          return;
        }
        const data = await res.json();
        const p: Pick = data.pick;
        setPick(p);

        const eventLocal = p.event_date
          ? new Date(
              new Date(p.event_date).getTime() -
                new Date(p.event_date).getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "";

        setFormData({
          sport: p.sport,
          league: p.league || "",
          matchup: p.matchup,
          selection: p.selection,
          odds: p.odds != null ? String(p.odds) : "",
          confidence: p.confidence,
          analysis: p.analysis || "",
          is_vip: p.is_vip,
          event_date: eventLocal,
          result: p.result,
        });
      } catch {
        toast.error("Failed to load pick");
        router.push("/admin/picks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPick();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const selectSelection = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      selection: name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/picks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: formData.sport,
          league: formData.league || null,
          matchup: formData.matchup,
          selection: formData.selection,
          odds: formData.odds ? parseFloat(formData.odds) : null,
          confidence: formData.confidence,
          analysis: formData.analysis || null,
          is_vip: formData.is_vip,
          event_date: formData.event_date
            ? new Date(formData.event_date).toISOString()
            : undefined,
          result: formData.result,
        }),
      });

      if (response.ok) {
        toast.success("Pick updated successfully");
        router.push("/admin/picks");
      } else {
        toast.error("Failed to update pick");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presets = SELECTION_PRESETS[formData.sport] ?? [];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-6 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-10" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pick) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/picks"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Picks
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Pick</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                options={SPORTS.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
              />
              <Input
                label="League"
                name="league"
                value={formData.league}
                onChange={handleChange}
                placeholder="e.g., Premier League, NBA"
              />
            </div>

            <Input
              label="Matchup"
              name="matchup"
              value={formData.matchup}
              onChange={handleChange}
              placeholder="e.g., Arsenal vs Chelsea"
              required
            />

            <Input
              label="Event Date & Time"
              name="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={handleChange}
              required
            />

            {/* Preset selection chips */}
            {presets.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Quick Selection
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectSelection(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        formData.selection === p
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background text-text-muted border-border hover:border-primary/30 hover:text-text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Selection"
                name="selection"
                value={formData.selection}
                onChange={handleChange}
                placeholder="e.g., Over 2.5, Home Win"
                required
              />
              <Input
                label="Odds"
                name="odds"
                type="number"
                step="0.01"
                value={formData.odds}
                onChange={handleChange}
                placeholder="e.g., 1.85"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Confidence"
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
                options={CONFIDENCE_LEVELS.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
              />
              <Select
                label="Result"
                name="result"
                value={formData.result}
                onChange={handleChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "win", label: "Win" },
                  { value: "loss", label: "Loss" },
                  { value: "push", label: "Push" },
                  { value: "void", label: "Void" },
                ]}
              />
            </div>

            <Textarea
              label="Analysis (optional)"
              name="analysis"
              value={formData.analysis}
              onChange={handleChange}
              placeholder="Reasoning for this pick..."
              rows={3}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_vip"
                name="is_vip"
                checked={formData.is_vip}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="is_vip" className="text-sm text-text-primary">
                VIP Pick (only visible to VIP members)
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <Link href="/admin/picks">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
