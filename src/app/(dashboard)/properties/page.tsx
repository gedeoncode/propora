import Link from "next/link";

import { propertyService } from "@/features/properties/services/property.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import {
  PROPERTY_AVAILABILITY_STATUSES,
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_PUBLICATION_STATUSES,
} from "@/features/properties/types/property";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(price);
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusClass(status: string) {
  switch (status) {
    case "published":
    case "available":
      return "bg-emerald-50 text-emerald-700";

    case "draft":
    case "reserved":
      return "bg-amber-50 text-amber-700";

    case "archived":
    case "sold":
    case "unavailable":
      return "bg-muted text-muted-foreground";

    default:
      return "bg-muted text-muted-foreground";
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

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  await requireRole(["admin", "manager", "agent", "staff"]);
  await connectToDatabase();

  const params = await searchParams;

  const parsedPage = Number(params.page);
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

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

  const listingType = isIncluded(
    params.listingType,
    LISTING_TYPES,
  )
    ? params.listingType
    : undefined;

  const propertyType = isIncluded(
    params.propertyType,
    PROPERTY_TYPES,
  )
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Property management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Properties
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your property inventory, publication status, and
            availability.
          </p>
        </div>

        <Link
          href="/properties/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Add property
        </Link>
      </div>

      <form
        method="GET"
        className="rounded-xl border bg-card p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Filters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Narrow down the property inventory.
            </p>
          </div>

          {hasFilters ? (
            <Link
              href="/properties"
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label
              htmlFor="publicationStatus"
              className="text-sm font-medium"
            >
              Publication
            </label>

            <select
              id="publicationStatus"
              name="publicationStatus"
              defaultValue={publicationStatus ?? ""}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
            <label
              htmlFor="availabilityStatus"
              className="text-sm font-medium"
            >
              Availability
            </label>

            <select
              id="availabilityStatus"
              name="availabilityStatus"
              defaultValue={availabilityStatus ?? ""}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
            <label htmlFor="listingType" className="text-sm font-medium">
              Listing type
            </label>

            <select
              id="listingType"
              name="listingType"
              defaultValue={listingType ?? ""}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All listing types</option>

              {LISTING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="propertyType" className="text-sm font-medium">
              Property type
            </label>

            <select
              id="propertyType"
              name="propertyType"
              defaultValue={propertyType ?? ""}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All property types</option>

              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              defaultValue={city ?? ""}
              placeholder="Search by city"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="minPrice" className="text-sm font-medium">
              Minimum price
            </label>

            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              defaultValue={params.minPrice ?? ""}
              placeholder="0"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="maxPrice" className="text-sm font-medium">
              Maximum price
            </label>

            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              defaultValue={params.maxPrice ?? ""}
              placeholder="No maximum"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Property inventory</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {pagination.total}{" "}
              {pagination.total === 1 ? "property" : "properties"} found
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-medium">
              {hasFilters
                ? "No properties match these filters"
                : "No properties found"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {hasFilters
                ? "Try adjusting or clearing your filters."
                : "Add your first property to start building your inventory."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Property
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Listing
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Publication
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {items.map((property) => (
                    <tr
                      key={property._id.toString()}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/properties/${property._id.toString()}`}
                          className="block"
                        >
                          <p className="font-medium hover:text-primary">
                            {property.title}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {property.location?.city || "No city"},{" "}
                            {property.location?.country || "No country"}
                          </p>
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatLabel(property.propertyType)}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatLabel(property.listingType)}
                      </td>

                      <td className="px-5 py-4 font-medium">
                        {formatPrice(property.price)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                            property.publicationStatus,
                          )}`}
                        >
                          {formatLabel(property.publicationStatus)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                            property.availabilityStatus,
                          )}`}
                        >
                          {formatLabel(property.availabilityStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                {pagination.page > 1 ? (
                  <Link
                    href={`/properties?${previousPageQuery}`}
                    className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium text-muted-foreground opacity-50">
                    Previous
                  </span>
                )}

                {pagination.page < pagination.totalPages ? (
                  <Link
                    href={`/properties?${nextPageQuery}`}
                    className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium text-muted-foreground opacity-50">
                    Next
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}