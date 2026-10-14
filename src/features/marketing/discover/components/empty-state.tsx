import {  Search } from "lucide-react";
import Link from "next/link";

export function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        <Search className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        No matching properties
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? "Try removing a filter or widening your price range to see more listings."
          : "There are no listings available right now. Please check back soon."}
      </p>
      {hasFilters && (
        <Link
          href="/discover"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}