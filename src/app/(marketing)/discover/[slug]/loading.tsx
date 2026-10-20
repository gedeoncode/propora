
import Link from "next/link";

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-16">
      <div className="page-container pt-5 sm:pt-6">
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
        </div>

        {/* Property title, location and price */}
        <header className="mt-4 grid gap-4 border-b border-border pb-6 sm:mt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10 lg:pb-7">
          <div className="min-w-0">
            <Skeleton className="h-8 w-4/5 max-w-lg sm:h-9 lg:h-10" />

            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-48 max-w-[75%]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-2" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:items-end">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-40 sm:h-9" />
          </div>
        </header>

        {/* Property image gallery */}
        <section
          aria-label="Property image gallery loading"
          className="mt-6 grid grid-cols-1 gap-2 sm:mt-7 sm:grid-cols-2"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-xl sm:row-span-2 sm:aspect-auto sm:min-h-[340px] lg:min-h-[440px]" />

          <div className="hidden grid-cols-2 gap-2 sm:grid">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          </div>
        </section>

        {/* Main content and inquiry sidebar */}
        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
          <main className="min-w-0">
            {/* Property specifications */}
            <section
              aria-label="Property specifications loading"
              className="border-y border-border"
            >
              <div className="grid grid-cols-3 divide-x divide-border">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col gap-2 py-4 pl-3 first:pl-0 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-5"
                  >
                    <Skeleton className="size-4 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-3 w-16 max-w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="mt-9 sm:mt-10">
              <Skeleton className="h-4 w-40" />

              <div className="mt-4 space-y-3">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-11/12" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </section>

            {/* Amenities */}
            <section className="mt-9 sm:mt-10">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-6" />
              </div>

              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <Skeleton className="size-4 shrink-0 rounded-full" />
                    <Skeleton className="h-3.5 w-32 max-w-full" />
                  </div>
                ))}
              </div>
            </section>

            {/* Additional property details */}
            <section className="mt-9 sm:mt-10">
              <Skeleton className="h-4 w-36" />

              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between gap-4 border-b border-border py-3"
                  >
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Inquiry sidebar */}
          <aside className="lg:sticky lg:top-6">
            <div className="space-y-6">
              <div className="divide-y divide-border border-y border-border">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                ))}
              </div>

              <section className="border-t border-border pt-5">
                <Skeleton className="h-5 w-48" />

                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>

                <div className="mt-5 space-y-4">
                  <Skeleton className="h-11 w-full rounded-lg" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky inquiry action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-4 backdrop-blur lg:hidden">
        <div className="page-container flex items-center gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-11 w-36 shrink-0 rounded-lg" />
        </div>
      </div>

      <span className="sr-only" role="status">
        Loading property details. Please wait.
      </span>
    </div>
  );
}

export default function Loading() {
  return <PropertyDetailSkeleton />;
}
