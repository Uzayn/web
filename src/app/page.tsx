"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { addDays, subDays } from "date-fns";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DateNavigator } from "@/components/features/date-navigator";
import { SportFilter } from "@/components/features/sport-filter";
import { PicksFeed } from "@/components/features/picks-feed";
import { StickyVIPBanner } from "@/components/features/sticky-vip-banner";
import { StatsBar } from "@/components/features/stats-bar";
import { EmailCaptureForm } from "@/components/features/email-capture-form";
import { TestimonialCard } from "@/components/features/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toDateString } from "@/lib/utils";
import { Pick, Stats } from "@/types";
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  Check,
  ArrowRight,
  Target,
  BarChart3,
} from "lucide-react";

const testimonials = [
  {
    name: "Michael T.",
    text: "Been a VIP member for 6 months. The analysis is top-notch and the transparency in track record builds real trust.",
    rating: 5,
    memberSince: "Aug 2024",
  },
  {
    name: "Sarah K.",
    text: "Finally found a picks service that shows their actual results. The ROI speaks for itself.",
    rating: 5,
    memberSince: "Oct 2024",
  },
  {
    name: "James R.",
    text: "The detailed analysis helps me understand the reasoning behind each pick. Worth every penny.",
    rating: 5,
    memberSince: "Sep 2024",
  },
];

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedSport, setSelectedSport] = useState("all");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [isVip, setIsVip] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/status")
      .then((res) => res.json())
      .then((data) => {
        setIsVip(data.isVip);
      })
      .catch(() => {})
      .finally(() => setStatusLoaded(true));

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.overall || null);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const fetchPicks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        date: toDateString(currentDate),
        includeVip: "true",
      });
      if (selectedSport !== "all") {
        params.set("sport", selectedSport);
      }
      const res = await fetch(`/api/picks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPicks(data.picks || []);
      }
    } catch (error) {
      console.error("Error fetching picks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, selectedSport]);

  useEffect(() => {
    fetchPicks();
  }, [fetchPicks]);

  const displayStats = stats || {
    totalPicks: 0,
    winRate: 0,
    roi: 0,
    unitsProfit: 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Picks Section */}
        <section className="px-4 py-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <DateNavigator
              currentDate={currentDate}
              onPrevious={() => setCurrentDate((d) => subDays(d, 1))}
              onNext={() => setCurrentDate((d) => addDays(d, 1))}
            />

            <SportFilter
              selected={selectedSport}
              onChange={setSelectedSport}
            />

            <PicksFeed
              picks={picks}
              isVip={isVip}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              {statsLoading ? "..." : `${displayStats.winRate}%`} Win Rate This Season
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              Expert Sports Picks
              <span className="text-primary"> That Win</span>
            </h1>

            <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of winning bettors. Get daily expert picks with
              detailed analysis, transparent track records, and a proven
              winning formula.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/vip">
                <Button size="lg" className="w-full sm:w-auto">
                  Join VIP Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/picks">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Free Picks
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 px-4 bg-surface/50">
          <div className="container mx-auto max-w-4xl">
            {statsLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : (
              <StatsBar
                totalPicks={displayStats.totalPicks}
                winRate={displayStats.winRate}
                roi={displayStats.roi}
                unitsProfit={displayStats.unitsProfit}
              />
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">
                  1. Get Expert Picks
                </h3>
                <p className="text-sm text-text-muted">
                  Receive daily picks from our team of professional sports
                  analysts with years of experience.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">
                  2. Read the Analysis
                </h3>
                <p className="text-sm text-text-muted">
                  Understand the reasoning behind each pick with detailed
                  breakdowns and key factors.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">
                  3. Track Results
                </h3>
                <p className="text-sm text-text-muted">
                  Every pick is recorded and tracked. Full transparency with
                  our verified track record.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* VIP Benefits */}
        <section className="py-16 px-4 bg-surface/50">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  VIP Membership
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                  Unlock Premium Picks & Analysis
                </h2>
                <p className="text-text-muted mb-6">
                  Get access to our highest conviction plays, detailed analysis,
                  and exclusive insights that free members don&apos;t see.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    "All VIP picks with full analysis",
                    "Higher confidence plays",
                    "Real-time alerts",
                    "Exclusive Discord community",
                    "Monthly performance reports",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-text-primary">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/vip">
                  <Button size="lg">
                    View VIP Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-text-primary">Verified</p>
                  <p className="text-xs text-text-muted">All picks tracked</p>
                </Card>
                <Card className="p-4 text-center">
                  <Zap className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="font-semibold text-text-primary">Instant</p>
                  <p className="text-xs text-text-muted">Real-time alerts</p>
                </Card>
                <Card className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-text-primary">Community</p>
                  <p className="text-xs text-text-muted">Discord access</p>
                </Card>
                <Card className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="font-semibold text-text-primary">
                    {statsLoading ? "..." : `+${displayStats.roi}%`}
                  </p>
                  <p className="text-xs text-text-muted">Average ROI</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
              What Our Members Say
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={i} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Email Capture */}
        <section className="py-16 px-4 bg-surface/50">
          <div className="container mx-auto max-w-xl">
            <EmailCaptureForm />
          </div>
        </section>
      </main>

      <Footer />

      {statusLoaded && !isVip && <StickyVIPBanner />}
    </div>
  );
}
