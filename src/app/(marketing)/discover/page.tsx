
import { Suspense } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";
import { clientEnv } from "@/config/env.client";
import {
  buildHref,
  firstParam,
  formatPrice,
  humanizeStatus,
  listingTypeLabels,
  PAGE_SIZE,
  parsePrice,
  propertyTypeLabels,
} from "@/features/properties/constants/property.contants";
import { PropertyResultsSkeleton } from "@/features/marketing/discover/components/property-results-skeleton";
import { DiscoverResults } from "@/features/marketing/discover/components/discover-results";
import { FilterForm } from "@/features/marketing/discover/components/filter-form";
import type { DiscoveryFilters } from "@/features/marketing/discover/types/filters";

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

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

  // Preserve active filters when navigating pagination or removing filters.
  const queryParams: Record<string, string | undefined> = {
    listingType: filters.listingType,
    propertyType: filters.propertyType,
    availabilityStatus: filters.availabilityStatus,
    city: filters.city,
    minPrice:
      filters.minPrice !== undefined
        ? String(filters.minPrice)
        : undefined,
    maxPrice:
      filters.maxPrice !== undefined
        ? String(filters.maxPrice)
        : undefined,
  };

  // Build active filter pills and their removal URLs.
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
      removeHref: buildHref(queryParams, {
        city: undefined,
        page: undefined,
      }),
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

  return (
    <div className="min-h-screen bg-background">
      <header className="relative isolate overflow-hidden border-b border-background bg-brand-950 text-background">
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
              {Array.from({ length: 40 }, (_, i) => (
                <path key={`h-${i}`} d={`M0 ${150 + i * 20}H700`} />
              ))}

              {Array.from({ length: 40 }, (_, i) => (
                <path key={`v-${i}`} d={`M${i * 25} 0V900`} />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 bg-brand-950/25" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </div>

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
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <FilterForm
                filters={filters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Results column */}
          <main id="property-results" className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3 ">
              {/* <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  Browse listings
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Sorted by newest first
                </p>
              </div> */}

              {/* Mobile filter control remains outside Suspense */}
              <details className="group relative lg:hidden">
                <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                  <SlidersHorizontal
                    className="size-4"
                    aria-hidden="true"
                  />
                  Filters

                  {hasFilters && (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {activeFilters.length}
                    </span>
                  )}
                </summary>

                <div
                  className="fixed inset-0 z-40 hidden bg-foreground/40 group-open:block"
                  aria-hidden="true"
                />

                <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-5 shadow-xl group-open:block">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      Refine search
                    </h3>

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

            {/* Active filter pills — unchanged */}
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

            {/* Only property results are suspended */}
            <Suspense
              key={JSON.stringify({
                filters,
                page: validPage,
              })}
              fallback={
                <PropertyResultsSkeleton count={PAGE_SIZE} />
              }
            >
              <DiscoverResults
                filters={filters}
                page={validPage}
                queryParams={queryParams}
                hasFilters={hasFilters}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
