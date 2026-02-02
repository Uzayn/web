"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const navLinks = [
  { href: "/picks", label: "Picks" },
  { href: "/results", label: "Track Record" },
  { href: "/vip", label: "VIP" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-lg text-text-primary">
                WinPicks
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-text-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <div className="hidden md:flex items-center gap-3">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="hidden md:flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
