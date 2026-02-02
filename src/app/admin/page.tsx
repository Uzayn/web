import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Crown,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock admin data
const stats = {
  totalUsers: 2847,
  vipMembers: 342,
  mrr: 14238,
  todaysPicks: 8,
};

const recentSignups = [
  { email: "john@example.com", date: "2 hours ago", plan: "vip" },
  { email: "sarah@example.com", date: "5 hours ago", plan: "free" },
  { email: "mike@example.com", date: "8 hours ago", plan: "vip" },
  { email: "emma@example.com", date: "12 hours ago", plan: "free" },
  { email: "david@example.com", date: "1 day ago", plan: "free" },
];

const todaysPicks = [
  { matchup: "Lakers vs Celtics", selection: "Lakers +4.5", result: "pending" },
  { matchup: "Chiefs vs Bills", selection: "Over 48.5", result: "pending" },
  { matchup: "Arsenal vs Chelsea", selection: "BTTS", result: "win" },
  { matchup: "Warriors vs Suns", selection: "Warriors -3.5", result: "pending" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Admin Dashboard
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">VIP Members</p>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.vipMembers}
                </p>
              </div>
              <Crown className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">MRR</p>
                <p className="text-2xl font-bold text-text-primary">
                  ${stats.mrr.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Today&apos;s Picks</p>
                <p className="text-2xl font-bold text-text-primary">
                  {stats.todaysPicks}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSignups.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {user.email}
                      </p>
                      <p className="text-xs text-text-muted">{user.date}</p>
                    </div>
                  </div>
                  <Badge variant={user.plan === "vip" ? "secondary" : "default"}>
                    {user.plan.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Picks */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Picks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysPicks.map((pick, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {pick.matchup}
                    </p>
                    <p className="text-xs text-primary">{pick.selection}</p>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className={`text-xs capitalize ${
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
