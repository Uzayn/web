"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ResultBadge } from "@/components/features/result-badge";
import { formatDateTime, SPORTS } from "@/lib/utils";
import { Pick } from "@/types";
import { Plus, Search, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { toast } from "sonner";

// Mock picks data
const mockPicks: Pick[] = [
  {
    id: "1",
    sport: "nba",
    league: "NBA",
    matchup: "Lakers vs Celtics",
    selection: "Lakers +4.5",
    odds: 1.91,
    stake: 1,
    confidence: "high",
    analysis: "Lakers have been covering spreads consistently.",
    is_vip: false,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 86400000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    sport: "nfl",
    league: "NFL",
    matchup: "Chiefs vs Bills",
    selection: "Over 48.5",
    odds: 1.87,
    stake: 1,
    confidence: "medium",
    analysis: "Both offenses have been firing.",
    is_vip: false,
    result: "win",
    profit_loss: 0.87,
    event_date: new Date(Date.now() - 86400000).toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    sport: "soccer",
    league: "Premier League",
    matchup: "Arsenal vs Chelsea",
    selection: "BTTS Yes",
    odds: 1.72,
    stake: 1,
    confidence: "high",
    analysis: "Both teams score in derbies.",
    is_vip: true,
    result: "loss",
    profit_loss: -1,
    event_date: new Date(Date.now() - 172800000).toISOString(),
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    sport: "nba",
    league: "NBA",
    matchup: "Warriors vs Suns",
    selection: "Warriors -3.5",
    odds: 1.95,
    stake: 2,
    confidence: "high",
    analysis: "VIP pick with detailed analysis.",
    is_vip: true,
    result: "pending",
    profit_loss: null,
    event_date: new Date(Date.now() + 172800000).toISOString(),
    settled_at: null,
    created_at: new Date().toISOString(),
  },
];

export default function AdminPicksPage() {
  const [picks, setPicks] = useState(mockPicks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const filteredPicks = picks.filter((pick) => {
    const matchesSearch =
      pick.matchup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pick.selection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || pick.sport === sportFilter;
    const matchesResult = resultFilter === "all" || pick.result === resultFilter;
    return matchesSearch && matchesSport && matchesResult;
  });

  const handleSettle = async (pickId: string, result: "win" | "loss" | "push") => {
    // In production, this would call the API
    setPicks((prev) =>
      prev.map((pick) => {
        if (pick.id === pickId) {
          const profit =
            result === "win"
              ? (pick.odds - 1) * (pick.stake || 1)
              : result === "loss"
              ? -(pick.stake || 1)
              : 0;
          return {
            ...pick,
            result,
            profit_loss: profit,
            settled_at: new Date().toISOString(),
          };
        }
        return pick;
      })
    );
    toast.success(`Pick marked as ${result}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Manage Picks</h1>
        <Link href="/admin/picks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Pick
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search picks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              options={[
                { value: "all", label: "All Sports" },
                ...SPORTS.map((s) => ({ value: s.value, label: s.label })),
              ]}
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full md:w-40"
            />
            <Select
              options={[
                { value: "all", label: "All Results" },
                { value: "pending", label: "Pending" },
                { value: "win", label: "Win" },
                { value: "loss", label: "Loss" },
                { value: "push", label: "Push" },
              ]}
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full md:w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Picks Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">
                    Sport
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">
                    Matchup
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">
                    Selection
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                    Odds
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                    Type
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                    Result
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                    Date
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPicks.map((pick) => (
                  <tr
                    key={pick.id}
                    className="border-b border-border last:border-0 hover:bg-surface/50"
                  >
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="uppercase">
                        {pick.sport}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-medium text-text-primary">
                        {pick.matchup}
                      </p>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-primary">{pick.selection}</p>
                    </td>
                    <td className="py-3 px-2 text-center text-text-primary">
                      {pick.odds}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={pick.is_vip ? "secondary" : "default"}>
                        {pick.is_vip ? "VIP" : "Free"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <ResultBadge result={pick.result} />
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-text-muted">
                      {formatDateTime(pick.event_date)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        {pick.result === "pending" && (
                          <>
                            <button
                              onClick={() => handleSettle(pick.id, "win")}
                              className="p-1.5 rounded hover:bg-primary/20 text-primary"
                              title="Mark Win"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSettle(pick.id, "loss")}
                              className="p-1.5 rounded hover:bg-danger/20 text-danger"
                              title="Mark Loss"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSettle(pick.id, "push")}
                              className="p-1.5 rounded hover:bg-surface text-text-muted"
                              title="Mark Push"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <Link href={`/admin/picks/${pick.id}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPicks.length === 0 && (
            <p className="text-center text-text-muted py-8">
              No picks found matching your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
