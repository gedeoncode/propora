// app/(public)/discover/page.tsx
import Link from "next/link";
import {
  BedDouble,
  Bath,
  MapPin,
  Ruler,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";
import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";
import { clientEnv } from "@/config/env.client";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type DiscoveryFilters = {
  listingType?: (typeof LISTING_TYPES)[number];
  propertyType?: (typeof PROPERTY_TYPES)[number];
  availabilityStatus?: (typeof PROPERTY_AVAILABILITY_STATUSES)[number];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
};

const PAGE_SIZE = 12;

const propertyTypeLabels: Record<(typeof PROPERTY_TYPES)[number], string> = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  land: "Land",
  office: "Office",
  retail: "Retail",
  warehouse: "Warehouse",
  other: "Other",
};

const listingTypeLabels = {
  sale: "For sale",
  rent: "For rent",
} as const;

function firstParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-KE")}`;
  }
}

function formatArea(area: number, unit: string | undefined): string {
  const labels: Record<string, string> = {
    sqm: "m²",
    sqft: "sq ft",
    acre: "acres",
    hectare: "hectares",
  };
  return `${area.toLocaleString("en-KE")} ${labels[unit ?? ""] ?? unit ?? ""}`.trim();
}

function buildHref(
  params: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {},
): string {
  const query = new URLSearchParams();
  const merged = { ...params, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== "") {
      query.set(key, value);
    }
  }

  const qs = query.toString();
  return qs ? `/discover?${qs}` : "/discover";
}

function humanizeStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Compute the set of pagination page numbers to render (with -1 as ellipsis). */
function getPageNumbers(current: number, total: number): (number | -1)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | -1)[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push(-1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(-1);
  pages.push(total);
  return pages;
}

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

/* -------------------------------------------------------------------------- */
/*                              Small local pieces                            */
/* -------------------------------------------------------------------------- */

type FilterFormProps = {
  filters: DiscoveryFilters;
  hasFilters: boolean;
  variant?: "rail" | "mobile";
};

function FilterForm({
  filters,
  hasFilters,
  variant = "rail",
}: FilterFormProps) {
  const isMobile = variant === "mobile";

  return (
    <form
      action="/discover"
      method="get"
      className={
        isMobile ? "space-y-5" : "rounded-xl border border-border bg-card p-5"
      }
    >
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="size-4 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
          </div>
          {hasFilters && (
            <Link
              href="/discover"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Reset
            </Link>
          )}
        </div>
      )}

      <div className={isMobile ? "space-y-5" : "mt-5 space-y-5"}>
        <Field label="Listing type" htmlFor="listingType">
          <select
            id="listingType"
            name="listingType"
            defaultValue={filters.listingType ?? ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="">Buy or rent</option>
            {LISTING_TYPES.map((type) => (
              <option key={type} value={type}>
                {listingTypeLabels[type]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Property type" htmlFor="propertyType">
          <select
            id="propertyType"
            name="propertyType"
            defaultValue={filters.propertyType ?? ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {propertyTypeLabels[type]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Availability" htmlFor="availabilityStatus">
          <select
            id="availabilityStatus"
            name="availabilityStatus"
            defaultValue={filters.availabilityStatus ?? ""}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="">Any status</option>
            {PROPERTY_AVAILABILITY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanizeStatus(status)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price range" hint="In KES" htmlFor="minPrice">
          <div className="grid grid-cols-2 gap-3">
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              inputMode="numeric"
              defaultValue={filters.minPrice}
              placeholder="Min"
              aria-label="Minimum price"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              inputMode="numeric"
              defaultValue={filters.maxPrice}
              placeholder="Max"
              aria-label="Maximum price"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </Field>

        <Field label="Location" htmlFor="city">
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="city"
              name="city"
              defaultValue={filters.city}
              placeholder="e.g. Nairobi"
              maxLength={120}
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
        </Field>

        <div
          className={
            isMobile
              ? "sticky bottom-0 -mx-5 mt-6 border-t border-border bg-card px-5 pt-4"
              : ""
          }
        >
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Search className="size-4" aria-hidden="true" />
            Show results
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground/80">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

type PropertyCardProps = {
  property: Awaited<
    ReturnType<typeof propertyService.listPublic>
  >["items"][number];
  image: { url: string; alt: string; order: number } | undefined;
  featured?: boolean;
};

function PropertyCard({ property, image, featured }: PropertyCardProps) {
  const locationText = [property.location.city, property.location.region]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/15 hover:shadow-md ${
        featured ? "sm:col-span-2 xl:col-span-2" : ""
      }`}
    >
      <Link
        href={`/discover/${property.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`View ${property.title}`}
      >
        <div
          className={`relative overflow-hidden bg-muted ${
            featured ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[4/3]"
          }`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Image coming soon
            </div>
          )}

          {/* Subtle bottom scrim for legibility of chips */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/40 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-background/95 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-sm">
            {listingTypeLabels[property.listingType]}
          </span>

          {property.availabilityStatus !== "available" && (
            <span className="absolute right-3 top-3 inline-flex items-center rounded-md bg-foreground/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background backdrop-blur-sm">
              {humanizeStatus(property.availabilityStatus)}
            </span>
          )}
        </div>

        <div className={featured ? "p-5 sm:p-6" : "p-4"}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {propertyTypeLabels[property.propertyType]}
              </p>
              <h3
                className={`mt-1.5 line-clamp-2 font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary ${
                  featured ? "text-lg sm:text-xl" : "text-[0.9375rem]"
                }`}
              >
                {property.title}
              </h3>
            </div>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {locationText || "Location not specified"}
            </span>
          </p>

          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-3.5">
            <p
              className={`font-semibold tracking-tight text-foreground ${
                featured ? "text-2xl" : "text-xl"
              }`}
            >
              {formatPrice(property.price, property.currency)}
              {property.listingType === "rent" && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / period
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {property.specifications?.bedrooms !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="size-3.5" aria-hidden="true" />
                  {property.specifications.bedrooms}
                </span>
              )}
              {property.specifications?.bathrooms !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Bath className="size-3.5" aria-hidden="true" />
                  {property.specifications.bathrooms}
                </span>
              )}
              {property.specifications?.area !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="size-3.5" aria-hidden="true" />
                  {formatArea(
                    property.specifications.area,
                    property.specifications.areaUnit,
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Pagination({
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

function ErrorState() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-border bg-card px-6 py-12 text-center"
    >
      <h3 className="font-semibold text-foreground">
        Properties are temporarily unavailable
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn’t load listings right now. Please try again in a moment.
      </p>
      <Link
        href="/discover"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </Link>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
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
