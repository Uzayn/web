"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyVIPBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-sm text-text-primary">
            <span className="font-semibold">Unlock VIP Picks</span>
            <span className="hidden sm:inline text-text-muted">
              {" "}— Get access to all premium picks and analysis
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/vip">
            <Button size="sm">Get VIP Access</Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
