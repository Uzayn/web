"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Search, Mail, Crown, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  subscription_status: string;
  created_at: string;
}

interface UserStats {
  total: number;
  vip: number;
  free: number;
  churned: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, vip: 0, free: 0, churned: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setStats(data.stats || { total: 0, vip: 0, free: 0, churned: 0 });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Manage Users</h1>
        <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-text-muted" />
            {isLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            )}
            <p className="text-sm text-text-muted">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Crown className="w-6 h-6 mx-auto mb-2 text-secondary" />
            {isLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-text-primary">{stats.vip}</p>
            )}
            <p className="text-sm text-text-muted">VIP Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            {isLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-text-primary">{stats.free}</p>
            )}
            <p className="text-sm text-text-muted">Free Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-danger" />
            {isLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-2xl font-bold text-text-primary">{stats.churned}</p>
            )}
            <p className="text-sm text-text-muted">Churned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "vip", label: "VIP" },
                { value: "free", label: "Free" },
                { value: "churned", label: "Churned" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-text-muted">
                      Email
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                      Status
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-text-muted">
                      Joined
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-surface/50"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-muted" />
                          <span className="text-text-primary">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge
                          variant={
                            user.subscription_status === "vip"
                              ? "secondary"
                              : user.subscription_status === "churned"
                              ? "danger"
                              : "default"
                          }
                        >
                          {user.subscription_status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-text-muted">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <p className="text-center text-text-muted py-8">
              {users.length === 0
                ? "No users yet."
                : "No users found matching your filters."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
