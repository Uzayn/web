"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SPORTS } from "@/lib/utils";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BundleItemForm {
  sport: string;
  league: string;
  matchup: string;
  selection: string;
  odds: string;
  event_date: string;
}

const emptyItem = (): BundleItemForm => ({
  sport: "soccer",
  league: "",
  matchup: "",
  selection: "",
  odds: "",
  event_date: "",
});

export default function NewBundlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<BundleItemForm[]>([emptyItem()]);

  const totalOdds = items.reduce((product, item) => {
    const odds = parseFloat(item.odds);
    return product * (isNaN(odds) || odds <= 0 ? 1 : odds);
  }, 1);

  const updateItem = (index: number, field: keyof BundleItemForm, value: string) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter((item) => item.matchup && item.selection && item.odds && item.event_date);
    if (validItems.length === 0) {
      toast.error("Add at least one complete pick");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          items: validItems.map((item) => ({
            sport: item.sport,
            league: item.league || null,
            matchup: item.matchup,
            selection: item.selection,
            odds: parseFloat(item.odds),
            event_date: item.event_date ? new Date(item.event_date).toISOString() : item.event_date,
          })),
        }),
      });

      if (res.ok) {
        toast.success("Bundle created successfully");
        router.push("/admin/bundles");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create bundle");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/bundles"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bundles
      </Link>

      <form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>New Bundle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Bundle Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekend 5-Odds Bundle"
              required
            />
            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the bundle..."
              rows={2}
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-text-muted">Total odds preview</span>
              <span className="text-lg font-bold text-secondary">{totalOdds.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Picks</h2>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              Add Pick
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={index} className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Pick {index + 1}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 rounded hover:bg-danger/20 text-danger"
                    title="Remove pick"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Sport"
                  value={item.sport}
                  onChange={(e) => updateItem(index, "sport", e.target.value)}
                  options={SPORTS.map((s) => ({ value: s.value, label: s.label }))}
                />
                <Input
                  label="League"
                  value={item.league}
                  onChange={(e) => updateItem(index, "league", e.target.value)}
                  placeholder="e.g., Premier League"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input
                  label="Matchup"
                  value={item.matchup}
                  onChange={(e) => updateItem(index, "matchup", e.target.value)}
                  placeholder="e.g., Arsenal vs Chelsea"
                  required
                />
                <Input
                  label="Selection"
                  value={item.selection}
                  onChange={(e) => updateItem(index, "selection", e.target.value)}
                  placeholder="e.g., Home Win"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Input
                  label="Odds"
                  type="number"
                  step="0.01"
                  min="1"
                  value={item.odds}
                  onChange={(e) => updateItem(index, "odds", e.target.value)}
                  placeholder="e.g., 1.85"
                  required
                />
                <Input
                  label="Event Date & Time"
                  type="datetime-local"
                  value={item.event_date}
                  onChange={(e) => updateItem(index, "event_date", e.target.value)}
                  required
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Link href="/admin/bundles">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
            Create Bundle
          </Button>
        </div>
      </form>
    </div>
  );
}
