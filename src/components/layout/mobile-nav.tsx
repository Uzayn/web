"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/picks", label: "Picks" },
  { href: "/results", label: "Track Record" },
  { href: "/vip", label: "VIP" },
  { href: "/responsible-gambling", label: "Responsible Gambling" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-muted hover:text-text-primary"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-background"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border my-2 pt-2">
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/account" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Account Settings
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-sm text-text-muted">Your Account</span>
                  </div>
                </div>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
