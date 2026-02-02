"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  User,
  Mail,
  Crown,
  Calendar,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Mock subscription data - would come from database
  const subscription = {
    status: "free" as "free" | "vip",
    plan: null as string | null,
    currentPeriodEnd: null as string | null,
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await fetch("/api/subscription/cancel", { method: "POST" });
      // Refresh page or update state
      window.location.reload();
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-8">
            Account Settings
          </h1>

          {/* Profile Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-text-muted" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-text-primary">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-text-muted flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-muted mb-2">Member since</p>
                <p className="text-text-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={subscription.status === "vip" ? "secondary" : "default"}
                    >
                      {subscription.status === "vip" ? "VIP" : "Free"}
                    </Badge>
                    {subscription.plan && (
                      <span className="text-text-primary capitalize">
                        ({subscription.plan})
                      </span>
                    )}
                  </div>
                </div>

                {subscription.status === "free" ? (
                  <Link href="/vip">
                    <Button>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to VIP
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>

              {subscription.status === "vip" && subscription.currentPeriodEnd && (
                <div className="bg-background rounded-lg p-3 text-sm">
                  <p className="text-text-muted">
                    Your subscription renews on{" "}
                    <span className="text-text-primary font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </p>
                </div>
              )}

              {subscription.status === "free" && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm">
                  <p className="text-text-muted">
                    Upgrade to VIP to unlock premium picks, detailed analysis,
                    and exclusive community access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing (VIP only) */}
          {subscription.status === "vip" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted text-sm mb-4">
                  Manage your payment method and view billing history through
                  Paystack.
                </p>
                <Button variant="outline">Manage Billing</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* Cancel Subscription Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-text-primary mb-2">
              Are you sure you want to cancel your VIP subscription?
            </p>
            <p className="text-sm text-text-muted">
              You&apos;ll lose access to all VIP picks and features at the end
              of your current billing period.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setShowCancelModal(false)}>
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelSubscription}
            isLoading={isCancelling}
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
