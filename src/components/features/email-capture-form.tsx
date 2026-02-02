"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text-primary">Get Free Picks</h3>
      </div>
      <p className="text-sm text-text-muted mb-4">
        Subscribe to receive our best free picks directly to your inbox.
      </p>

      {status === "success" ? (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
          <p className="text-primary font-medium">Thanks for subscribing!</p>
          <p className="text-sm text-text-muted mt-1">
            You&apos;ll receive our next free pick soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" isLoading={isLoading}>
            Subscribe
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-danger mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
