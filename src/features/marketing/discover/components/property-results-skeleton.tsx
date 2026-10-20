type PropertyResultsSkeletonProps = {
  count?: number;
};

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      aria-hidden="true"
    />
  );
}

function PropertyCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <article
      aria-hidden="true"
      className={`overflow-hidden rounded-xl border border-border bg-card ${
        featured ? "sm:col-span-2 xl:col-span-2" : ""
      }`}
    >
      {/* Property image placeholder */}
      <div
        className={`relative overflow-hidden bg-muted ${
          featured ? "aspect-video sm:aspect-21/9" : "aspect-4/3"
        }`}
      >
        <SkeletonBlock className="absolute left-3 top-3 h-5 w-20 rounded-md" />
        <SkeletonBlock className="absolute bottom-4 left-3 h-2 w-1/3" />
      </div>

      {/* Property details placeholder */}
      <div className={featured ? "p-5 sm:p-6" : "p-4"}>
        <SkeletonBlock className="h-3 w-24" />

        <div className="mt-3 space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <SkeletonBlock className="size-3.5 shrink-0 rounded-full" />
          <SkeletonBlock className="h-3 w-2/3" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3.5">
          <SkeletonBlock
            className={`h-6 ${featured ? "w-36 sm:h-7" : "w-28"}`}
          />

          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-3 w-6" />
            <SkeletonBlock className="h-3 w-6" />
            <SkeletonBlock className="h-3 w-8" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function PropertyResultsSkeleton({
  count = 6,
}: PropertyResultsSkeletonProps) {
  const safeCount = Number.isSafeInteger(count)
    ? Math.min(Math.max(count, 1), 12)
    : 6;

  return (
    <div role="status" aria-label="Loading properties" className="min-w-0">
      <span className="sr-only">Loading properties…</span>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: safeCount }, (_, index) => (
          <PropertyCardSkeleton key={index} featured={index === 0} />
        ))}
      </div>
    </div>
  );
}
