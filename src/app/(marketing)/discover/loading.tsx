
export default function Loading() {
  return (
    <div
      className="min-h-screen bg-background"
      role="status"
      aria-busy="true"
      aria-label="Loading properties"
    >
      {/* Discover page heading */}
      <header className="relative isolate overflow-hidden border-b border-border bg-brand-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="page-container relative py-5 sm:py-6">
          <div className="animate-pulse">
            <div className="h-3 w-20 rounded bg-blue-300/30" />

            <div className="mt-3 h-8 w-48 max-w-full rounded-md bg-white/15 sm:w-64" />

            <div className="mt-3 h-4 w-72 max-w-full rounded bg-white/10" />
          </div>
        </div>
      </header>

      {/* Discover content */}
      <div className="page-container py-6 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">

          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-3 w-10 rounded bg-muted" />
                </div>

                <div className="mt-6 space-y-5">
                  {[1, 2, 3].map((item) => (
                    <div key={item}>
                      <div className="mb-2 h-3 w-24 rounded bg-muted" />
                      <div className="h-10 rounded-lg border border-border bg-muted/60" />
                    </div>
                  ))}

                  <div>
                    <div className="mb-2 h-3 w-20 rounded bg-muted" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 rounded-lg bg-muted/60" />
                      <div className="h-10 rounded-lg bg-muted/60" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 h-3 w-16 rounded bg-muted" />
                    <div className="h-10 rounded-lg bg-muted/60" />
                  </div>

                  <div className="h-11 rounded-lg bg-primary/20" />
                </div>
              </div>
            </div>
          </aside>

          {/* Property results */}
          <main className="min-w-0" aria-hidden="true">
            {/* Results toolbar */}
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
              <div className="animate-pulse">
                <div className="h-5 w-36 rounded bg-muted sm:w-44" />
                <div className="mt-2 h-3 w-32 rounded bg-muted/70" />
              </div>

              {/* Mobile filter button placeholder */}
              <div className="h-10 w-24 shrink-0 animate-pulse rounded-lg border border-border bg-muted/60 lg:hidden" />
            </div>

            {/* Property card grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => {
                const featured = item === 0;

                return (
                  <article
                    key={item}
                    className={`overflow-hidden rounded-xl border border-border bg-card ${
                      featured
                        ? "sm:col-span-2 xl:col-span-2"
                        : ""
                    }`}
                  >
                    <div
                      className={`animate-pulse bg-muted ${
                        featured
                          ? "aspect-video sm:aspect-21/9"
                          : "aspect-4/3"
                      }`}
                    />

                    <div
                      className={`animate-pulse ${
                        featured ? "p-5 sm:p-6" : "p-4"
                      }`}
                    >
                      {/* Property type */}
                      <div className="h-3 w-20 rounded bg-muted" />

                      {/* Property title */}
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-11/12 rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted/70" />
                      </div>

                      {/* Location */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="size-4 shrink-0 rounded-full bg-muted" />
                        <div className="h-3 w-3/5 rounded bg-muted/70" />
                      </div>

                      {/* Price and specifications */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <div
                          className={`rounded bg-muted ${
                            featured ? "h-7 w-36" : "h-6 w-28"
                          }`}
                        />

                        <div className="flex gap-3">
                          <div className="h-4 w-8 rounded bg-muted/70" />
                          <div className="h-4 w-8 rounded bg-muted/70" />
                          <div className="h-4 w-10 rounded bg-muted/70" />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination placeholder */}
            <div className="mt-10 flex justify-center gap-2 border-t border-border pt-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`size-9 animate-pulse rounded-lg ${
                    item === 1
                      ? "bg-primary/20"
                      : "border border-border bg-muted/50"
                  }`}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Screen-reader announcement */}
      <span className="sr-only">Loading property listings. Please wait.</span>
    </div>
  );
}
