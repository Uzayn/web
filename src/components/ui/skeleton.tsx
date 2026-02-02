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
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16" />
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
