import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "danger" | "outline";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-surface text-text-muted border-border",
      primary: "bg-primary/20 text-primary border-primary/30",
      secondary: "bg-secondary/20 text-secondary border-secondary/30",
      success: "bg-primary/20 text-primary border-primary/30",
      danger: "bg-danger/20 text-danger border-danger/30",
      outline: "bg-transparent text-text-muted border-border",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
