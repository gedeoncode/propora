import { buildHref, getPageNumbers } from "@/features/properties/constants/property.contants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  queryParams,
}: {
  page: number;
  totalPages: number;
  queryParams: Record<string, string | undefined>;
}) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5 border-t border-border pt-6"
    >
      {page > 1 ? (
        <Link
          href={buildHref(queryParams, { page: String(page - 1) })}
          rel="prev"
          aria-label="Previous page"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-40"
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === -1 ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(queryParams, { page: String(p) })}
            aria-label={`Page ${p}`}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(queryParams, { page: String(page + 1) })}
          rel="next"
          aria-label="Next page"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-40"
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}



