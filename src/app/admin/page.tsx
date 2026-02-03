"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pick } from "@/types";
import {
  Users,
  Crown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  vipMembers: number;
  freeUsers: number;
  totalPicks: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentPicks, setRecentPicks] = useState<Pick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, picksRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/picks?includeVip=true"),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats({
            totalUsers: usersData.stats?.total || 0,
            vipMembers: usersData.stats?.vip || 0,
            freeUsers: usersData.stats?.free || 0,
            totalPicks: 0,
          });
        }

        if (picksRes.ok) {
          const picksData = await picksRes.json();
          const picks = picksData.picks || [];
          setRecentPicks(picks.slice(0, 5));
          setStats((prev) => prev ? { ...prev, totalPicks: picks.length } : null);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const todaysPicks = recentPicks.filter((pick) => {
    const pickDate = new Date(pick.event_date);
    const today = new Date();
    return pickDate.toDateString() === today.toDateString();
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
        Admin Dashboard
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted">Total Users</p>
                {isLoading ? (
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16 mt-1" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-text-primary">
                    {stats?.totalUsers || 0}
                  </p>
                )}
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted">VIP</p>
                {isLoading ? (
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16 mt-1" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-text-primary">
                    {stats?.vipMembers || 0}
                  </p>
                )}
              </div>
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted">Total Picks</p>
                {isLoading ? (
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16 mt-1" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-text-primary">
                    {stats?.totalPicks || 0}
                  </p>
                )}
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-text-muted">Today</p>
                {isLoading ? (
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16 mt-1" />
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-text-primary">
                    {todaysPicks.length}
                  </p>
                )}
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Picks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Picks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : recentPicks.length > 0 ? (
              <div className="space-y-3">
                {recentPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <Badge variant="outline" className="uppercase text-xs flex-shrink-0">
                        {pick.sport}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {pick.matchup}
                        </p>
                        <p className="text-xs text-primary truncate">{pick.selection}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {pick.result === "pending" && (
                        <Clock className="w-4 h-4 text-text-muted" />
                      )}
                      {pick.result === "win" && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                      {pick.result === "loss" && (
                        <XCircle className="w-4 h-4 text-danger" />
                      )}
                      <span
                        className={`text-xs capitalize hidden sm:inline ${
                          pick.result === "win"
                            ? "text-primary"
                            : pick.result === "loss"
                            ? "text-danger"
                            : "text-text-muted"
                        }`}
                      >
                        {pick.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-4">
                No picks yet. Add your first pick!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/picks/new"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="text-text-primary font-medium">Add New Pick</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </a>
              <a
                href="/admin/picks"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="text-text-primary font-medium">Manage Picks</span>
                <FileText className="w-5 h-5 text-text-muted" />
              </a>
              <a
                href="/admin/users"
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="text-text-primary font-medium">View Users</span>
                <Users className="w-5 h-5 text-text-muted" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
