import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  memberSince?: string;
}

export function TestimonialCard({
  name,
  text,
  rating,
  memberSince,
}: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-secondary fill-secondary" : "text-border"
            }`}
          />
        ))}
      </div>

      <p className="text-text-muted text-sm mb-4 leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="font-medium text-text-primary">{name}</span>
        {memberSince && (
          <span className="text-xs text-text-muted">
            VIP since {memberSince}
          </span>
        )}
      </div>
    </Card>
  );
}
