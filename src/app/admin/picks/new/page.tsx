"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SPORTS, CONFIDENCE_LEVELS } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewPickPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sport: "nba",
    league: "",
    matchup: "",
    selection: "",
    odds: "",
    stake: "1",
    confidence: "medium",
    analysis: "",
    is_vip: false,
    event_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          odds: parseFloat(formData.odds),
          stake: parseFloat(formData.stake),
        }),
      });

      if (response.ok) {
        toast.success("Pick created successfully");
        router.push("/admin/picks");
      } else {
        toast.error("Failed to create pick");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle>Add New Pick</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                options={SPORTS.map((s) => ({ value: s.value, label: s.label }))}
              />
              <Input
                label="League"
                name="league"
                value={formData.league}
                onChange={handleChange}
                placeholder="e.g., NBA, Premier League"
              />
            </div>

            <Input
              label="Matchup"
              name="matchup"
              value={formData.matchup}
              onChange={handleChange}
              placeholder="e.g., Lakers vs Celtics"
              required
            />

            <Input
              label="Selection"
              name="selection"
              value={formData.selection}
              onChange={handleChange}
              placeholder="e.g., Lakers +4.5"
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Odds"
                name="odds"
                type="number"
                step="0.01"
                min="1"
                value={formData.odds}
                onChange={handleChange}
                placeholder="1.91"
                required
              />
              <Input
                label="Stake (units)"
                name="stake"
                type="number"
                step="0.5"
                min="0.5"
                value={formData.stake}
                onChange={handleChange}
                placeholder="1"
              />
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
            </div>

            <Input
              label="Event Date & Time"
              name="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Analysis"
              name="analysis"
              value={formData.analysis}
              onChange={handleChange}
              placeholder="Detailed analysis and reasoning for this pick..."
              rows={5}
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

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/admin/picks">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                Create Pick
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
