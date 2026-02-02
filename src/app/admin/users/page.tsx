"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { Search, Mail, Crown, Users } from "lucide-react";

// Mock users data
const mockUsers = [
  {
    id: "1",
    email: "john@example.com",
    subscription_status: "vip",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "2",
    email: "sarah@example.com",
    subscription_status: "free",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "3",
    email: "mike@example.com",
    subscription_status: "vip",
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "4",
    email: "emma@example.com",
    subscription_status: "churned",
    created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
  {
    id: "5",
    email: "david@example.com",
    subscription_status: "free",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "6",
    email: "lisa@example.com",
    subscription_status: "vip",
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "7",
    email: "chris@example.com",
    subscription_status: "free",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "8",
    email: "amanda@example.com",
    subscription_status: "vip",
    created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    vip: mockUsers.filter((u) => u.subscription_status === "vip").length,
    free: mockUsers.filter((u) => u.subscription_status === "free").length,
    churned: mockUsers.filter((u) => u.subscription_status === "churned").length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Manage Users</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-text-muted" />
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-sm text-text-muted">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Crown className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold text-text-primary">{stats.vip}</p>
            <p className="text-sm text-text-muted">VIP Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-text-primary">{stats.free}</p>
            <p className="text-sm text-text-muted">Free Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-danger" />
            <p className="text-2xl font-bold text-text-primary">{stats.churned}</p>
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

          {filteredUsers.length === 0 && (
            <p className="text-center text-text-muted py-8">
              No users found matching your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
