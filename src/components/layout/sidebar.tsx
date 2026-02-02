"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Plus,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/picks", label: "Picks", icon: FileText },
  { href: "/admin/picks/new", label: "Add Pick", icon: Plus },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-lg text-text-primary">Admin</span>
      </div>

      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:bg-background hover:text-text-primary"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-background hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
