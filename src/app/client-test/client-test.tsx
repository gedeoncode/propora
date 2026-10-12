import Link from "next/link";
import {
  ArrowDownUp,
  BedDouble,
  Bath,
  MapPin,
  Ruler,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";
import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";

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

function buildPageHref(
  params: Record<string, string | undefined>,
  page: number,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, value);
    }
  }

  query.set("page", String(page));

  return `/discover?${query.toString()}`;
}

export const metadata = {
  title: `Discover Properties | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description:
    "Explore properties for sale and rent. Find a home, land, or commercial space that fits your needs.",
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

  const queryParams = {
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
  const hasFilters = Object.values(queryParams).some(
    (value) => value !== undefined,
  );

  return (
    <div className="min-h-screen bg-background">
      {" "}
      <section className="border-b border-border bg-slate-950 text-white">
        {" "}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {" "}
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            Find your next place{" "}
          </p>{" "}
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Properties that fit your next chapter.{" "}
          </h1>{" "}
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Explore homes, land, and commercial spaces available for sale or
            rent.{" "}
          </p>{" "}
        </div>{" "}
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside>
          <form
            action="/discover"
            method="get"
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                className="size-4 text-primary"
                aria-hidden="true"
              />
              <h2 className="font-semibold">Refine your search</h2>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium"
                >
                  City or location
                </label>
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
                    className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="listingType"
                  className="mb-2 block text-sm font-medium"
                >
                  Listing type
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  defaultValue={filters.listingType ?? ""}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Buy or rent</option>
                  {LISTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {listingTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="propertyType"
                  className="mb-2 block text-sm font-medium"
                >
                  Property type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  defaultValue={filters.propertyType ?? ""}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All property types</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {propertyTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="availabilityStatus"
                  className="mb-2 block text-sm font-medium"
                >
                  Availability
                </label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  defaultValue={filters.availabilityStatus ?? ""}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Any status</option>
                  {PROPERTY_AVAILABILITY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Price range</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="minPrice"
                      className="mb-1 block text-xs text-muted-foreground"
                    >
                      Minimum
                    </label>
                    <input
                      id="minPrice"
                      name="minPrice"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      defaultValue={filters.minPrice}
                      placeholder="No min"
                      className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="maxPrice"
                      className="mb-1 block text-xs text-muted-foreground"
                    >
                      Maximum
                    </label>
                    <input
                      id="maxPrice"
                      name="maxPrice"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      defaultValue={filters.maxPrice}
                      placeholder="No max"
                      className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                <Search className="size-4" aria-hidden="true" />
                Apply filters
              </button>

              {hasFilters && (
                <Link
                  href="/discover"
                  className="block text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Clear all filters
                </Link>
              )}
            </div>
          </form>
        </aside>

        <main id="property-results" className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Explore properties
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pagination
                  ? `${pagination.total.toLocaleString("en-KE")} ${
                      pagination.total === 1 ? "property" : "properties"
                    } found`
                  : "Browse available listings"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownUp className="size-4" aria-hidden="true" />
              <span>Newest listings first</span>
            </div>
          </div>

          {!result ? (
            <div
              role="alert"
              className="rounded-2xl border border-border bg-card px-6 py-12 text-center"
            >
              <h3 className="font-semibold">
                Properties are temporarily unavailable
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                We couldn’t load listings right now. Please try again in a
                moment.
              </p>
              <Link
                href="/discover"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Try again
              </Link>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                <Search
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                No matching properties
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try changing your location or filters to see more listings.
              </p>
              <Link
                href="/discover"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => {
                  const image = [...(property.media ?? [])].sort(
                    (a, b) => a.order - b.order,
                  )[0];

                  return (
                    <article
                      key={String(property._id)}
                      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                    >
                      <Link
                        href={`/discover/${property.slug}`}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                        aria-label={`View ${property.title}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {image ? (
                            // Use a standard image until remote image hosts are configured in next.config.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image.url}
                              alt={image.alt}
                              loading="lazy"
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                              Image coming soon
                            </div>
                          )}

                          <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                            {listingTypeLabels[property.listingType]}
                          </span>

                          {property.availabilityStatus !== "available" && (
                            <span className="absolute right-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold capitalize text-white">
                              {property.availabilityStatus.replace("_", " ")}
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-primary">
                            {propertyTypeLabels[property.propertyType]}
                          </p>

                          <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-card-foreground transition-colors group-hover:text-primary">
                            {property.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin
                              className="size-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {[
                                property.location.city,
                                property.location.region,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </p>

                          <p className="mt-4 text-xl font-bold tracking-tight">
                            {formatPrice(property.price, property.currency)}
                            {property.listingType === "rent" && (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                / rental period
                              </span>
                            )}
                          </p>

                          <div className="mt-4 flex min-h-5 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                            {property.specifications?.bedrooms !==
                              undefined && (
                              <span className="inline-flex items-center gap-1.5">
                                <BedDouble
                                  className="size-4"
                                  aria-hidden="true"
                                />
                                {property.specifications.bedrooms} beds
                              </span>
                            )}

                            {property.specifications?.bathrooms !==
                              undefined && (
                              <span className="inline-flex items-center gap-1.5">
                                <Bath className="size-4" aria-hidden="true" />
                                {property.specifications.bathrooms} baths
                              </span>
                            )}

                            {property.specifications?.area !== undefined && (
                              <span className="inline-flex items-center gap-1.5">
                                <Ruler className="size-4" aria-hidden="true" />
                                {formatArea(
                                  property.specifications.area,
                                  property.specifications.areaUnit,
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <nav
                  aria-label="Property result pages"
                  className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
                >
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>

                  <div className="flex gap-2">
                    {pagination.page > 1 ? (
                      <Link
                        href={buildPageHref(queryParams, pagination.page - 1)}
                        rel="prev"
                        className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm text-muted-foreground opacity-50">
                        Previous
                      </span>
                    )}

                    {pagination.page < pagination.totalPages ? (
                      <Link
                        href={buildPageHref(queryParams, pagination.page + 1)}
                        rel="next"
                        className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm text-muted-foreground opacity-50">
                        Next
                      </span>
                    )}
                  </div>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
