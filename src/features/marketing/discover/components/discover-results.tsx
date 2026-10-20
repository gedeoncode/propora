
import { propertyService } from "@/features/properties/services/property.service";
import { PAGE_SIZE } from "@/features/properties/constants/property.contants";
import { PropertyCard } from "@/features/properties/components/public/property-card";
import { ErrorState } from "@/features/marketing/discover/components/error-state";
import { EmptyState } from "@/features/marketing/discover/components/empty-state";
import { Pagination } from "@/features/marketing/discover/components/pagination";
import type { DiscoveryFilters } from "@/features/marketing/discover/types/filters";

type DiscoverResultsProps = {
  filters: DiscoveryFilters;
  page: number;
  queryParams: Record<string, string | undefined>;
  hasFilters: boolean;
};

export async function DiscoverResults({
  filters,
  page,
  queryParams,
  hasFilters,
}: DiscoverResultsProps) {
  let result: Awaited<ReturnType<typeof propertyService.listPublic>> | null =
    null;

  try {
    result = await propertyService.listPublic(filters, {
      page,
      limit: PAGE_SIZE,
    });
  } catch {
    // Keep database and infrastructure details server-side.
    // Render the existing public-facing error state.
  }

  if (!result) {
    return (
      <>
        <div className="mb-5 border-b border-border pb-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
            Browse listings
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sorted by newest first
          </p>
        </div>

        <ErrorState />
      </>
    );
  }

  const { items: properties, pagination } = result;

  const resultsLabel = `${pagination.total.toLocaleString("en-KE")} ${
    pagination.total === 1 ? "property" : "properties"
  }`;

  return (
    <>
      {/* <div className="mb-5 border-b border-border pb-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {resultsLabel}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sorted by newest first
        </p>
      </div> */}

      {properties.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property, index) => {
              const image = [...(property.media ?? [])].sort(
                (a, b) => a.order - b.order,
              )[0];

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

          {pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              queryParams={queryParams}
            />
          )}
        </>
      )}
    </>
  );
}
