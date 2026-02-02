import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y min-h-[100px]",
            error && "border-danger focus:ring-danger/50 focus:border-danger",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
