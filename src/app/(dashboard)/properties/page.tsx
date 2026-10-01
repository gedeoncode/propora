import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Bath,
  Building2,
  ChevronDown,
  MapPin,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import {
  PROPERTY_AVAILABILITY_STATUSES,
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_PUBLICATION_STATUSES,
} from "@/features/properties/types/property";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { PropertyActions } from "@/features/properties/components/property-actions";

type PropertiesPageProps = {
  searchParams: Promise<{
    page?: string;
    publicationStatus?: string;
    availabilityStatus?: string;
    listingType?: string;
    propertyType?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

function formatPrice(price: number, currency: string) {
  return `${currency} ${new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(price)}`;
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getPropertyStatusVariant(status: string) {
  switch (status) {
    case "published":
    case "available":
      return "success" as const;

    case "draft":
    case "reserved":
    case "under_offer":
      return "warning" as const;

    case "archived":
    case "sold":
    case "rented":
    case "unavailable":
      return "neutral" as const;

    default:
      return "neutral" as const;
  }
}

function isIncluded<T extends string>(
  value: string | undefined,
  values: readonly T[],
): value is T {
  return value !== undefined && values.includes(value as T);
}

function buildQuery(
  params: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {},
) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries({
    ...params,
    ...overrides,
  })) {
    if (value) {
      query.set(key, value);
    }
  }

  return query.toString();
}
function getResultsStart(page: number, limit: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return (page - 1) * limit + 1;
}

function getResultsEnd(page: number, limit: number, total: number) {
  return Math.min(page * limit, total);
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  await requireRole(["admin", "manager", "agent", "staff"]);
  await connectToDatabase();

  const params = await searchParams;

  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const publicationStatus = isIncluded(
    params.publicationStatus,
    PROPERTY_PUBLICATION_STATUSES,
  )
    ? params.publicationStatus
    : undefined;

  const availabilityStatus = isIncluded(
    params.availabilityStatus,
    PROPERTY_AVAILABILITY_STATUSES,
  )
    ? params.availabilityStatus
    : undefined;

  const listingType = isIncluded(params.listingType, LISTING_TYPES)
    ? params.listingType
    : undefined;

  const propertyType = isIncluded(params.propertyType, PROPERTY_TYPES)
    ? params.propertyType
    : undefined;

  const minPriceValue = Number(params.minPrice);
  const maxPriceValue = Number(params.maxPrice);

  const minPrice =
    params.minPrice && Number.isFinite(minPriceValue) && minPriceValue >= 0
      ? minPriceValue
      : undefined;

  const maxPrice =
    params.maxPrice && Number.isFinite(maxPriceValue) && maxPriceValue >= 0
      ? maxPriceValue
      : undefined;

  const city = params.city?.trim() || undefined;

  const result = await propertyService.list(
    {
      publicationStatus,
      availabilityStatus,
      listingType,
      propertyType,
      city,
      minPrice,
      maxPrice,
    },
    {
      page,
      limit: 20,
    },
  );

  const { items, pagination } = result;
  const resultsStart = getResultsStart(
    pagination.page,
    pagination.limit,
    pagination.total,
  );

  const resultsEnd = getResultsEnd(
    pagination.page,
    pagination.limit,
    pagination.total,
  );

  const currentFilters = {
    publicationStatus,
    availabilityStatus,
    listingType,
    propertyType,
    city,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  };

  const previousPageQuery = buildQuery(currentFilters, {
    page: String(pagination.page - 1),
  });

  const nextPageQuery = buildQuery(currentFilters, {
    page: String(pagination.page + 1),
  });

  const hasFilters = Boolean(
    publicationStatus ||
    availabilityStatus ||
    listingType ||
    propertyType ||
    city ||
    minPrice !== undefined ||
    maxPrice !== undefined,
  );

  const advancedFiltersActive = Boolean(
    publicationStatus ||
    availabilityStatus ||
    minPrice !== undefined ||
    maxPrice !== undefined,
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Properties"
        description="Manage your property inventory, listings, availability, and publication status."
        action={{
          href: "/properties/new",
          label: "Add property",
        }}
      />

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card">
        <form method="GET">
          <div className="border-b border-border p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="city">Search by city</Label>

                <Input
                  id="city"
                  name="city"
                  type="search"
                  defaultValue={city ?? ""}
                  placeholder="e.g. Nairobi, Mombasa..."
                />
              </div>

              <div className="w-full lg:w-48 space-y-2">
                <Label htmlFor="propertyType">Property type</Label>

                <select
                  id="propertyType"
                  name="propertyType"
                  defaultValue={propertyType ?? ""}
                  className={selectClassName}
                >
                  <option value="">All property types</option>

                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-40 space-y-2">
                <Label htmlFor="listingType">Listing</Label>

                <select
                  id="listingType"
                  name="listingType"
                  defaultValue={listingType ?? ""}
                  className={selectClassName}
                >
                  <option value="">Sale or rent</option>

                  {LISTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit">Search</Button>

                {hasFilters ? (
                  <Button variant="ghost">
                    <Link href="/properties">Clear</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <details className="group" open={advancedFiltersActive}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                More filters
                {advancedFiltersActive ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Active
                  </span>
                ) : null}
              </span>

              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="border-t border-border px-4 py-4 sm:px-5 sm:py-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="publicationStatus">Publication</Label>

                  <select
                    id="publicationStatus"
                    name="publicationStatus"
                    defaultValue={publicationStatus ?? ""}
                    className={selectClassName}
                  >
                    <option value="">All statuses</option>

                    {PROPERTY_PUBLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availabilityStatus">Availability</Label>

                  <select
                    id="availabilityStatus"
                    name="availabilityStatus"
                    defaultValue={availabilityStatus ?? ""}
                    className={selectClassName}
                  >
                    <option value="">All statuses</option>

                    {PROPERTY_AVAILABILITY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum price</Label>

                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    min="0"
                    defaultValue={params.minPrice ?? ""}
                    placeholder="No minimum"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Maximum price</Label>

                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    min="0"
                    defaultValue={params.maxPrice ?? ""}
                    placeholder="No maximum"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit">Apply filters</Button>
              </div>
            </div>
          </details>
        </form>
      </section>
      {/* Active filter context */}
      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">
            Active filters
          </span>

          {city ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              City: {city}
            </span>
          ) : null}

          {propertyType ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Type: {formatLabel(propertyType)}
            </span>
          ) : null}

          {listingType ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Listing: {formatLabel(listingType)}
            </span>
          ) : null}

          {publicationStatus ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Publication: {formatLabel(publicationStatus)}
            </span>
          ) : null}

          {availabilityStatus ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Availability: {formatLabel(availabilityStatus)}
            </span>
          ) : null}

          {minPrice !== undefined ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Min: {formatPrice(minPrice, "")}
            </span>
          ) : null}

          {maxPrice !== undefined ? (
            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
              Max: {formatPrice(maxPrice, "")}
            </span>
          ) : null}

          <Link
            href="/properties"
            className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Clear all
          </Link>
        </div>
      ) : null}

      {/* Inventory */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold">Property inventory</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {pagination.total === 0
                ? "No properties found"
                : `Showing ${resultsStart}–${resultsEnd} of ${pagination.total} ${
                    pagination.total === 1 ? "property" : "properties"
                  }`}
            </p>
          </div>

          {hasFilters ? (
            <Link
              href="/properties"
              className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View all properties
            </Link>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </div>

            <p className="mt-4 font-medium">
              {hasFilters
                ? "No properties match your filters"
                : "No properties yet"}
            </p>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {hasFilters
                ? "Try broadening your search or clearing some filters."
                : "Add your first property to start building your inventory."}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {hasFilters ? (
                <Link
                  href="/properties"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Clear filters
                </Link>
              ) : null}

              <Link
                href="/properties/new"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add property
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-245 text-sm">
                <caption className="sr-only">Property inventory</caption>

                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Property
                    </th>

                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Details
                    </th>

                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Listing
                    </th>

                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Price
                    </th>

                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Status
                    </th>

                    <th className="w-12 px-3 py-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {items.map((property) => {
                    const specifications = property.specifications;

                    return (
                      <tr
                        key={property._id.toString()}
                        className="group transition-colors hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/properties/${property._id.toString()}`}
                            className="block rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            <div className="flex items-start gap-3">
                              <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground sm:flex">
                                <Building2
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="font-medium transition-colors group-hover:text-primary">
                                  {property.title}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin
                                    className="size-3 shrink-0"
                                    aria-hidden="true"
                                  />

                                  <span className="truncate">
                                    {property.location?.city || "No city"}
                                    {property.location?.country
                                      ? `, ${property.location.country}`
                                      : ""}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {specifications?.bedrooms !== undefined ? (
                              <span className="inline-flex items-center gap-1">
                                <BedDouble
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                {specifications.bedrooms}
                              </span>
                            ) : null}

                            {specifications?.bathrooms !== undefined ? (
                              <span className="inline-flex items-center gap-1">
                                <Bath className="size-3.5" aria-hidden="true" />
                                {specifications.bathrooms}
                              </span>
                            ) : null}

                            {specifications?.area !== undefined ? (
                              <span>
                                {new Intl.NumberFormat("en").format(
                                  specifications.area,
                                )}{" "}
                                {specifications.areaUnit ?? "sqm"}
                              </span>
                            ) : null}

                            {specifications?.bedrooms === undefined &&
                            specifications?.bathrooms === undefined &&
                            specifications?.area === undefined ? (
                              <span>Details unavailable</span>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium">
                            {formatLabel(property.listingType)}
                          </span>

                          <span className="mt-1 block text-xs text-muted-foreground">
                            {formatLabel(property.propertyType)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-medium">
                            {formatPrice(property.price, property.currency)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <StatusBadge
                              variant={getPropertyStatusVariant(
                                property.publicationStatus,
                              )}
                            >
                              {formatLabel(property.publicationStatus)}
                            </StatusBadge>

                            <StatusBadge
                              variant={getPropertyStatusVariant(
                                property.availabilityStatus,
                              )}
                            >
                              {formatLabel(property.availabilityStatus)}
                            </StatusBadge>
                          </div>
                        </td>

                        <td className="px-3 py-4 text-right">
                          <PropertyActions
                            propertyId={property._id.toString()}
                            propertyTitle={property.title}
                            publicationStatus={property.publicationStatus}
                            availabilityStatus={property.availabilityStatus}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                {pagination.page > 1 ? (
                  <Link
                    href={`/properties?${previousPageQuery}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex h-8 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium opacity-50">
                    Previous
                  </span>
                )}

                {pagination.page < pagination.totalPages ? (
                  <Link
                    href={`/properties?${nextPageQuery}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="inline-flex h-8 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium opacity-50">
                    Next
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
