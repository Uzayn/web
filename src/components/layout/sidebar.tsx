"use client";

import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/picks", label: "Picks", icon: FileText },
  { href: "/admin/picks/new", label: "Add Pick", icon: Plus },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <>
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
              onClick={() => setIsOpen(false)}
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
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-background hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Site
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg text-text-primary">Admin</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-background text-text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-[57px] left-0 bottom-0 z-30 w-64 bg-surface border-r border-border p-4 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 min-h-screen bg-surface border-r border-border p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg text-text-primary">Admin</span>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
