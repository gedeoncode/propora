// app/(marketing)/discover/page.tsx
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";
import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";
import { clientEnv } from "@/config/env.client";
import { buildHref, firstParam, formatPrice, humanizeStatus, listingTypeLabels, PAGE_SIZE, parsePrice, propertyTypeLabels } from "@/features/properties/constants/property.contants";
import { PropertyCard } from "@/features/properties/components/public/property-card";
import { ErrorState } from "@/features/marketing/discover/components/error-state";
import { EmptyState } from "@/features/marketing/discover/components/empty-state";
import { Pagination } from "@/features/marketing/discover/components/pagination";
import { FilterForm } from "@/features/marketing/discover/components/filter-form";
import { DiscoveryFilters } from "@/features/marketing/discover/types/filters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: `Discover Properties | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description: `Explore properties for sale and rent with ${clientEnv.NEXT_PUBLIC_APP_NAME}. Find a home, land, or commercial space that fits your needs.`,
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const listingTypeValue = firstParam(params.listingType);
  const propertyTypeValue = firstParam(params.propertyType);
  const availabilityValue = firstParam(params.availabilityStatus);
  const city = firstParam(params.city)?.trim().slice(0, 120);
  const minPriceValue = firstParam(params.minPrice);
  const maxPriceValue = firstParam(params.maxPrice);
  const requestedPage = Number(firstParam(params.page) ?? "1");

  const filters: DiscoveryFilters = {
    listingType: LISTING_TYPES.includes(
      listingTypeValue as (typeof LISTING_TYPES)[number],
    )
      ? (listingTypeValue as (typeof LISTING_TYPES)[number])
      : undefined,
    propertyType: PROPERTY_TYPES.includes(
      propertyTypeValue as (typeof PROPERTY_TYPES)[number],
    )
      ? (propertyTypeValue as (typeof PROPERTY_TYPES)[number])
      : undefined,
    availabilityStatus: PROPERTY_AVAILABILITY_STATUSES.includes(
      availabilityValue as (typeof PROPERTY_AVAILABILITY_STATUSES)[number],
    )
      ? (availabilityValue as (typeof PROPERTY_AVAILABILITY_STATUSES)[number])
      : undefined,
    city: city || undefined,
    minPrice: parsePrice(minPriceValue),
    maxPrice: parsePrice(maxPriceValue),
  };

  const validPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  // Base query params preserved across pagination and filter removal.
  const queryParams: Record<string, string | undefined> = {
    listingType: filters.listingType,
    propertyType: filters.propertyType,
    availabilityStatus: filters.availabilityStatus,
    city: filters.city,
    minPrice:
      filters.minPrice !== undefined ? String(filters.minPrice) : undefined,
    maxPrice:
      filters.maxPrice !== undefined ? String(filters.maxPrice) : undefined,
  };

  let result: Awaited<ReturnType<typeof propertyService.listPublic>> | null =
    null;

  try {
    result = await propertyService.listPublic(filters, {
      page: validPage,
      limit: PAGE_SIZE,
    });
  } catch {
    // Keep database details on the server; show a useful public error below.
  }

  const properties = result?.items ?? [];
  const pagination = result?.pagination;

  // Build a list of active filter pills with removal hrefs.
  const activeFilters: { label: string; removeHref: string }[] = [];
  if (filters.listingType) {
    activeFilters.push({
      label: listingTypeLabels[filters.listingType],
      removeHref: buildHref(queryParams, {
        listingType: undefined,
        page: undefined,
      }),
    });
  }
  if (filters.propertyType) {
    activeFilters.push({
      label: propertyTypeLabels[filters.propertyType],
      removeHref: buildHref(queryParams, {
        propertyType: undefined,
        page: undefined,
      }),
    });
  }
  if (filters.availabilityStatus) {
    activeFilters.push({
      label: humanizeStatus(filters.availabilityStatus),
      removeHref: buildHref(queryParams, {
        availabilityStatus: undefined,
        page: undefined,
      }),
    });
  }
  if (filters.city) {
    activeFilters.push({
      label: filters.city,
      removeHref: buildHref(queryParams, { city: undefined, page: undefined }),
    });
  }
  if (filters.minPrice !== undefined) {
    activeFilters.push({
      label: `From ${formatPrice(filters.minPrice, "KES")}`,
      removeHref: buildHref(queryParams, {
        minPrice: undefined,
        page: undefined,
      }),
    });
  }
  if (filters.maxPrice !== undefined) {
    activeFilters.push({
      label: `Up to ${formatPrice(filters.maxPrice, "KES")}`,
      removeHref: buildHref(queryParams, {
        maxPrice: undefined,
        page: undefined,
      }),
    });
  }

  const hasFilters = activeFilters.length > 0;
  const resultsLabel = pagination
    ? `${pagination.total.toLocaleString("en-KE")} ${
        pagination.total === 1 ? "property" : "properties"
      }`
    : "Browse listings";

  return (
    <div className="min-h-screen bg-background">
      {/* Compact contextual header — not a full marketing hero */}
      <header className="relative isolate overflow-hidden border-b border-background bg-brand-950 text-background">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            viewBox="0 0 700 900"
            fill="none"
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="white" strokeOpacity="0.12" strokeWidth="1">
              {/* Horizontal grid lines */}
              {Array.from({ length: 40 }, (_, i) => (
                <path key={`h-${i}`} d={`M0 ${150 + i * 20}H700`} />
              ))}

              {/* Vertical grid lines */}
              {Array.from({ length: 40 }, (_, i) => (
                <path key={`v-${i}`} d={`M${i * 25} 0V900`} />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 bg-brand-950/25" />

          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </div>

        {/* Header content */}
        <div className="page-container relative py-5 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                Discover
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                Properties
              </h1>

              <p className="mt-1.5 text-sm text-white/65">
                Homes, land, and commercial spaces for sale and rent.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="page-container py-6 lg:py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          {/* Desktop filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <FilterForm filters={filters} hasFilters={hasFilters} />
            </div>
          </aside>

          {/* Results column */}
          <main id="property-results" className="min-w-0">
            {/* Results toolbar: count + mobile filter toggle */}
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {resultsLabel}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Sorted by newest first
                </p>
              </div>

              {/* Mobile filter toggle — uses <details> to avoid a client component */}
              <details className="group relative lg:hidden">
                <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  Filters
                  {hasFilters && (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {activeFilters.length}
                    </span>
                  )}
                </summary>

                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40 hidden bg-foreground/40 group-open:block"
                  aria-hidden="true"
                />

                {/* Sheet */}
                <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-5 shadow-xl group-open:block">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Refine search</h3>
                    <Link
                      href="/discover"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Link>
                  </div>
                  <FilterForm
                    filters={filters}
                    hasFilters={hasFilters}
                    variant="mobile"
                  />
                </div>
              </details>
            </div>

            {/* Active filter pills */}
            {hasFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    href={filter.removeHref}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-muted"
                  >
                    <span>{filter.label}</span>
                    <X
                      className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      Remove {filter.label} filter
                    </span>
                  </Link>
                ))}
                <Link
                  href="/discover"
                  className="ml-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Clear all
                </Link>
              </div>
            )}

            {/* Results */}
            {!result ? (
              <ErrorState />
            ) : properties.length === 0 ? (
              <EmptyState hasFilters={hasFilters} />
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {properties.map((property, index) => {
                    const image = [...(property.media ?? [])].sort(
                      (a, b) => a.order - b.order,
                    )[0];

                    // Featured treatment for the first card on desktop when there are enough results.
                    const featured = index === 0 && properties.length >= 3;

                    return (
                      <PropertyCard
                        key={String(property._id)}
                        property={property}
                        image={image}
                        featured={featured}
                      />
                    );
                  })}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    queryParams={queryParams}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

