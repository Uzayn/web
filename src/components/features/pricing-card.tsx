"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
  isLoading?: boolean;
  savings?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  onSubscribe,
  isLoading = false,
  savings,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col h-full",
        isPopular && "border-primary shadow-lg shadow-primary/20"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary" className="px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{name}</h3>
        <p className="text-sm text-text-muted mb-4">{description}</p>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-bold text-text-primary">${price}</span>
          <span className="text-text-muted">/{period}</span>
        </div>

        {savings && (
          <p className="text-sm text-primary font-medium mb-4">{savings}</p>
        )}

        <Button
          onClick={onSubscribe}
          isLoading={isLoading}
          className="w-full mt-4"
          variant={isPopular ? "primary" : "outline"}
          size="lg"
        >
          Get Started
        </Button>
      </div>

      <div className="p-6 pt-0 flex-1">
        <p className="text-sm font-medium text-text-primary mb-3">
          What&apos;s included:
        </p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-text-muted">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
