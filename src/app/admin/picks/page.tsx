"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultBadge } from "@/components/features/result-badge";
import { formatDateTime, SPORTS } from "@/lib/utils";
import { Pick } from "@/types";
import { Plus, Search, CheckCircle, XCircle, MinusCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminPicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const fetchPicks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/picks?includeVip=true");
      if (res.ok) {
        const data = await res.json();
        setPicks(data.picks || []);
      }
    } catch (error) {
      console.error("Error fetching picks:", error);
      toast.error("Failed to load picks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks();
  }, []);

  const filteredPicks = picks.filter((pick) => {
    const matchesSearch =
      pick.matchup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pick.selection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === "all" || pick.sport === sportFilter;
    const matchesResult = resultFilter === "all" || pick.result === resultFilter;
    return matchesSearch && matchesSport && matchesResult;
  });

  const handleSettle = async (pickId: string, result: "win" | "loss" | "push") => {
    try {
      const res = await fetch(`/api/picks/${pickId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      if (res.ok) {
        const data = await res.json();
        setPicks((prev) =>
          prev.map((pick) => (pick.id === pickId ? data.pick : pick))
        );
        toast.success(`Pick marked as ${result}`);
      } else {
        toast.error("Failed to update pick");
      }
    } catch (error) {
      console.error("Error settling pick:", error);
      toast.error("Failed to update pick");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Manage Picks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPicks} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link href="/admin/picks/new">
            <Button size="sm">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Pick</span>
            </Button>
          </Link>
        </div>
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

      {/* Picks List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredPicks.map((pick) => (
              <Card key={pick.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="uppercase text-xs">
                      {pick.sport}
                    </Badge>
                    <Badge variant={pick.is_vip ? "secondary" : "default"} className="text-xs">
                      {pick.is_vip ? "VIP" : "Free"}
                    </Badge>
                  </div>
                  <ResultBadge result={pick.result} />
                </div>
                <p className="font-medium text-text-primary mb-1">{pick.matchup}</p>
                <p className="text-primary text-sm mb-2">{pick.selection}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">
                    {pick.odds} • {formatDateTime(pick.event_date)}
                  </span>
                  {pick.result === "pending" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSettle(pick.id, "win")}
                        className="p-2 rounded hover:bg-primary/20 text-primary"
                        title="Mark Win"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSettle(pick.id, "loss")}
                        className="p-2 rounded hover:bg-danger/20 text-danger"
                        title="Mark Loss"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSettle(pick.id, "push")}
                        className="p-2 rounded hover:bg-surface text-text-muted"
                        title="Mark Push"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden lg:block">
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!isLoading && filteredPicks.length === 0 && (
        <Card className="p-8">
          <p className="text-center text-text-muted">
            {picks.length === 0
              ? "No picks yet. Add your first pick!"
              : "No picks found matching your filters."}
          </p>
        </Card>
      )}
    </div>
  );
}
