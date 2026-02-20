"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingCard } from "@/components/features/pricing-card";
import { TestimonialCard } from "@/components/features/testimonial-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Stats } from "@/types";
import {
  detectCountry,
  getCurrencyForCountry,
  formatPrice,
  getSavingsText,
} from "@/lib/currency";
import {
  Trophy,
  TrendingUp,
  Bell,
  BarChart3,
  MessageCircle,
} from "lucide-react";

const monthlyFeatures = [
  "All VIP picks (5-10 daily)",
  "Full analysis for each pick",
  "Real-time alerts",
  "Discord community access",
  "Monthly performance reports",
  "Email support",
];

const yearlyFeatures = [
  "All VIP picks (5-10 daily)",
  "Full analysis for each pick",
  "Real-time alerts",
  "Discord community access",
  "Monthly performance reports",
  "Priority email support",
  "Exclusive yearly member perks",
];

const testimonials = [
  {
    name: "Michael T.",
    text: "Been a VIP member for 6 months. The analysis is top-notch and the transparency in track record builds real trust. My bankroll has grown 40%.",
    rating: 5,
    memberSince: "Aug 2024",
  },
  {
    name: "Sarah K.",
    text: "Finally found a picks service that shows their actual results. The ROI speaks for itself. Worth every penny of the subscription.",
    rating: 5,
    memberSince: "Oct 2024",
  },
  {
    name: "James R.",
    text: "The detailed analysis helps me understand the reasoning behind each pick. I've learned so much about sports betting in just 3 months.",
    rating: 5,
    memberSince: "Sep 2024",
  },
];

const faqs = [
  {
    q: "How many picks do you release per day?",
    a: "We typically release 5-10 VIP picks per day across multiple sports. We focus on quality over quantity, only releasing picks where we see strong value.",
  },
  {
    q: "What sports do you cover?",
    a: "We cover NFL, NBA, MLB, NHL, Soccer (Premier League, La Liga, etc.), Tennis, MMA, and more. Our team has specialists for each major sport.",
  },
  {
    q: "How do I receive picks?",
    a: "Picks are posted in your VIP dashboard and sent via real-time alerts. You'll also have access to our Discord community for live updates.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period.",
  },
  {
    q: "What is your track record?",
    a: "We maintain full transparency with our track record. Check our Results page for detailed statistics including win rate, ROI, and profit by sport.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, contact us within 7 days for a full refund.",
  },
];

export function VIPContent() {
  const { isSignedIn } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<ReturnType<typeof getCurrencyForCountry> | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, countryCode] = await Promise.all([
          fetch("/api/stats"),
          detectCountry(),
        ]);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.overall || null);
        }
        setCurrency(getCurrencyForCountry(countryCode));
      } catch (error) {
        console.error("Error fetching data:", error);
        setCurrency(getCurrencyForCountry("US"));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubscribe = async (plan: string) => {
    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }

    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="w-3 h-3 mr-1" />
              Join 2,500+ Winning Members
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              VIP Membership
            </h1>

            <p className="text-lg text-text-muted">
              Get access to our premium picks, detailed analysis, and join a
              community of winning bettors.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 px-4 bg-surface/50">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <Card className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                {isLoading ? (
                  <Skeleton className="h-8 w-14 mx-auto mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-text-primary">
                    {stats?.winRate || 0}%
                  </p>
                )}
                <p className="text-xs text-text-muted">Win Rate</p>
              </Card>
              <Card className="p-4 text-center">
                <BarChart3 className="w-6 h-6 text-secondary mx-auto mb-2" />
                {isLoading ? (
                  <Skeleton className="h-8 w-14 mx-auto mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-text-primary">
                    +{stats?.roi || 0}%
                  </p>
                )}
                <p className="text-xs text-text-muted">ROI</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
              Choose Your Plan
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {currency ? (
                <>
                  <PricingCard
                    name="Monthly"
                    formattedPrice={formatPrice(currency.monthly, currency.symbol)}
                    period="month"
                    description="Full VIP access with monthly billing"
                    features={monthlyFeatures}
                    onSubscribe={() => handleSubscribe("month")}
                    isLoading={loadingPlan === "month"}
                  />
                  <PricingCard
                    name="Yearly"
                    formattedPrice={formatPrice(currency.yearly, currency.symbol)}
                    period="year"
                    description="Best value - save 20%"
                    features={yearlyFeatures}
                    isPopular
                    savings={getSavingsText(currency)}
                    onSubscribe={() => handleSubscribe("year")}
                    isLoading={loadingPlan === "year"}
                  />
                </>
              ) : (
                <>
                  <Skeleton className="h-96 rounded-xl" />
                  <Skeleton className="h-96 rounded-xl" />
                </>
              )}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 px-4 bg-surface/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
              What&apos;s Included
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Bell className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">
                  Real-Time Alerts
                </h3>
                <p className="text-sm text-text-muted">
                  Get notified instantly when new picks are released. Never miss
                  a winning opportunity.
                </p>
              </Card>
              <Card className="p-6">
                <BarChart3 className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">
                  Detailed Analysis
                </h3>
                <p className="text-sm text-text-muted">
                  Understand the reasoning behind every pick with comprehensive
                  breakdowns and key stats.
                </p>
              </Card>
              <Card className="p-6">
                <MessageCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">
                  Discord Community
                </h3>
                <p className="text-sm text-text-muted">
                  Join our exclusive Discord server to chat with other members
                  and get live updates.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials — uncomment when real testimonials are available
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
        */}

        {/* FAQ */}
        <section className="py-16 px-4 bg-surface/50">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i} className="p-4">
                  <h3 className="font-semibold text-text-primary mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-text-muted">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Start Winning?
            </h2>
            <p className="text-text-muted mb-6">
              Join thousands of successful bettors. 7-day money-back guarantee.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleSubscribe("month")}
                className="px-6 py-3 rounded-lg font-medium transition-colors bg-surface border border-border text-text-primary hover:border-primary/50"
              >
                Get Monthly
              </button>
              <button
                onClick={() => handleSubscribe("year")}
                className="px-6 py-3 rounded-lg font-medium transition-colors bg-primary text-black hover:bg-primary/90"
              >
                Get Yearly - Best Value
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
