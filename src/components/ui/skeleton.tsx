import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface",
        className
      )}
    />
  );
}

export function PickCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl py-2.5 px-3">
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
        <Skeleton className="h-3 w-24 md:w-1/3 lg:w-1/4 shrink-0" />
        <div className="flex items-center justify-between gap-4 flex-1">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20 shrink-0" />
          <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
