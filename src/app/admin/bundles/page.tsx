"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultBadge } from "@/components/features/result-badge";
import { formatDateTime } from "@/lib/utils";
import { Bundle } from "@/types";
import { Plus, CheckCircle, XCircle, MinusCircle, RefreshCw, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBundles = async () => {
    setIsLoading(true);
    try {
      // Admin fetches all bundles, not just latest — use a custom admin endpoint approach
      // We reuse the existing route but add ?all=true for admin context
      const res = await fetch("/api/bundles?all=true");
      if (res.ok) {
        const data = await res.json();
        setBundles(data.bundles || []);
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast.error("Failed to load bundles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleSettle = async (bundleId: string, result: "win" | "loss" | "void") => {
    try {
      const res = await fetch(`/api/bundles/${bundleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      if (res.ok) {
        const data = await res.json();
        setBundles((prev) =>
          prev.map((b) => (b.id === bundleId ? { ...b, result: data.bundle.result } : b))
        );
        toast.success(`Bundle marked as ${result}`);
      } else {
        toast.error("Failed to update bundle");
      }
    } catch (error) {
      console.error("Error settling bundle:", error);
      toast.error("Failed to update bundle");
    }
  };

  const handleDelete = async (bundleId: string) => {
    if (!confirm("Delete this bundle and all its picks?")) return;

    try {
      const res = await fetch(`/api/bundles/${bundleId}`, { method: "DELETE" });
      if (res.ok) {
        setBundles((prev) => prev.filter((b) => b.id !== bundleId));
        toast.success("Bundle deleted");
      } else {
        toast.error("Failed to delete bundle");
      }
    } catch (error) {
      console.error("Error deleting bundle:", error);
      toast.error("Failed to delete bundle");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Manage Bundles</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBundles} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link href="/admin/bundles/new">
            <Button size="sm">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Bundle</span>
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {bundles.map((bundle) => (
              <Card key={bundle.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-text-primary">{bundle.title}</span>
                  </div>
                  <ResultBadge result={bundle.result} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {bundle.total_odds.toFixed(2)} odds
                  </Badge>
                  <span className="text-xs text-text-muted">
                    {formatDateTime(bundle.created_at)}
                  </span>
                </div>
                {bundle.description && (
                  <p className="text-xs text-text-muted mb-3">{bundle.description}</p>
                )}
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/bundles/${bundle.id}/edit`}
                    className="p-2 rounded hover:bg-surface text-text-muted"
                    title="Edit Bundle"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleSettle(bundle.id, "win")}
                    className={`p-2 rounded hover:bg-primary/20 text-primary ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                    title="Mark Win"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSettle(bundle.id, "loss")}
                    className={`p-2 rounded hover:bg-danger/20 text-danger ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                    title="Mark Loss"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSettle(bundle.id, "void")}
                    className={`p-2 rounded hover:bg-surface text-text-muted ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                    title="Mark Void"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="p-2 rounded hover:bg-danger/20 text-danger"
                    title="Delete Bundle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                      <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">Title</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Total Odds</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Result</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">Created</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundles.map((bundle) => (
                      <tr
                        key={bundle.id}
                        className="border-b border-border last:border-0 hover:bg-surface/50"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-secondary shrink-0" />
                            <div>
                              <p className="font-medium text-text-primary">{bundle.title}</p>
                              {bundle.description && (
                                <p className="text-xs text-text-muted truncate max-w-xs">{bundle.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="secondary">{bundle.total_odds.toFixed(2)}</Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <ResultBadge result={bundle.result} />
                        </td>
                        <td className="py-3 px-2 text-center text-sm text-text-muted">
                          {formatDateTime(bundle.created_at)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/bundles/${bundle.id}/edit`}
                              className="p-1.5 rounded hover:bg-surface text-text-muted"
                              title="Edit Bundle"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleSettle(bundle.id, "win")}
                              className={`p-1.5 rounded hover:bg-primary/20 text-primary ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                              title="Mark Win"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSettle(bundle.id, "loss")}
                              className={`p-1.5 rounded hover:bg-danger/20 text-danger ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                              title="Mark Loss"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSettle(bundle.id, "void")}
                              className={`p-1.5 rounded hover:bg-surface text-text-muted ${bundle.result !== "pending" ? "opacity-40" : ""}`}
                              title="Mark Void"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(bundle.id)}
                              className="p-1.5 rounded hover:bg-danger/20 text-danger"
                              title="Delete Bundle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {!isLoading && bundles.length === 0 && (
        <Card className="p-8">
          <p className="text-center text-text-muted">
            No bundles yet. Create your first bundle!
          </p>
        </Card>
      )}
    </div>
  );
}
