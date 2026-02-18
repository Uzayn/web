"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SPORTS, CONFIDENCE_LEVELS } from "@/lib/utils";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Fixture {
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  eventDate: string;
}

export default function NewPickPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sport, setSport] = useState("soccer");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [fixtureError, setFixtureError] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const [formData, setFormData] = useState({
    sport: "soccer",
    league: "",
    matchup: "",
    selection: "",
    confidence: "medium",
    analysis: "",
    is_vip: false,
    event_date: "",
  });

  const fetchFixtures = useCallback(async () => {
    setLoadingFixtures(true);
    setFixtureError(false);
    try {
      const res = await fetch(
        `/api/admin/fixtures?sport=${sport}&date=${date}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFixtures(data.fixtures || []);
      if ((data.fixtures || []).length === 0) {
        setManualMode(true);
      } else {
        setManualMode(false);
      }
    } catch {
      setFixtureError(true);
      setManualMode(true);
      setFixtures([]);
    } finally {
      setLoadingFixtures(false);
    }
  }, [sport, date]);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  const selectFixture = (fixture: Fixture) => {
    const eventLocal = new Date(fixture.eventDate);
    const dtLocal = new Date(
      eventLocal.getTime() - eventLocal.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      sport,
      league: fixture.league,
      matchup: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
      event_date: dtLocal,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          odds: null,
          stake: 1,
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

  // Group fixtures by country + league for unique grouping
  const grouped = fixtures.reduce<Record<string, { country: string; league: string; fixtures: Fixture[] }>>((acc, f) => {
    const key = f.country ? `${f.country}::${f.league}` : f.league;
    if (!acc[key]) acc[key] = { country: f.country, league: f.league, fixtures: [] };
    acc[key].fixtures.push(f);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/picks"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Picks
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Pick</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sport + Date selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Select
              label="Sport"
              name="sport_selector"
              value={sport}
              onChange={(e) => {
                setSport(e.target.value);
                setFormData((prev) => ({ ...prev, sport: e.target.value }));
              }}
              options={SPORTS.map((s) => ({ value: s.value, label: s.label }))}
            />
            <Input
              label="Date"
              name="date_selector"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Fixtures list */}
          {!manualMode && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">
                  Select a Fixture
                </h3>
                <button
                  type="button"
                  onClick={() => setManualMode(true)}
                  className="text-xs text-text-muted hover:text-primary"
                >
                  Manual entry
                </button>
              </div>

              {loadingFixtures ? (
                <div className="flex items-center justify-center py-8 text-text-muted">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading fixtures...
                </div>
              ) : fixtureError ? (
                <div className="flex items-center gap-2 py-4 text-sm text-danger">
                  <AlertCircle className="w-4 h-4" />
                  Failed to load fixtures.{" "}
                  <button
                    type="button"
                    onClick={fetchFixtures}
                    className="underline hover:text-primary"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-4 border border-border rounded-lg p-3">
                  {Object.entries(grouped).map(([key, group]) => (
                    <div key={key}>
                      <p className="text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide">
                        {group.country ? (
                          <>
                            <span className="text-text-primary">{group.league}</span>
                            <span className="mx-1.5 opacity-40">·</span>
                            <span>{group.country}</span>
                          </>
                        ) : (
                          group.league
                        )}
                      </p>
                      <div className="space-y-1">
                        {group.fixtures.map((fixture, i) => {
                          const matchup = `${fixture.homeTeam} vs ${fixture.awayTeam}`;
                          const isSelected = formData.matchup === matchup;
                          return (
                            <button
                              key={`${key}-${i}`}
                              type="button"
                              onClick={() => selectFixture(fixture)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                isSelected
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : "hover:bg-surface-hover text-text-primary"
                              }`}
                            >
                              <span className="font-medium">
                                {fixture.homeTeam} vs {fixture.awayTeam}
                              </span>
                              <span className="text-text-muted text-xs ml-2">
                                {new Date(fixture.eventDate).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {manualMode && !loadingFixtures && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">
                  Manual Entry
                </h3>
                {fixtures.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setManualMode(false)}
                    className="text-xs text-text-muted hover:text-primary"
                  >
                    Back to fixtures
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pick form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="League"
                name="league"
                value={formData.league}
                onChange={handleChange}
                placeholder="e.g., Premier League, NBA"
              />
              <Input
                label="Matchup"
                name="matchup"
                value={formData.matchup}
                onChange={handleChange}
                placeholder="e.g., Arsenal vs Chelsea"
                required
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

            <Input
              label="Selection"
              name="selection"
              value={formData.selection}
              onChange={handleChange}
              placeholder="e.g., Over 2.5, Home Win, Lakers +4.5"
              required
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
                Create Pick
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
