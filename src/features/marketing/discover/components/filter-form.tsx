import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Field } from "./field";
import { DiscoveryFilters } from "../types/filters";
import { LISTING_TYPES, PROPERTY_AVAILABILITY_STATUSES, PROPERTY_TYPES } from "@/features/properties/types/property";
import { humanizeStatus, listingTypeLabels, propertyTypeLabels } from "@/features/properties/constants/property.contants";
type FilterFormProps = {
  filters: DiscoveryFilters;
  hasFilters: boolean;
  variant?: "rail" | "mobile";
};

export function FilterForm({
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
