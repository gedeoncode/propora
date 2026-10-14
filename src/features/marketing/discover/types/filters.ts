import { LISTING_TYPES, PROPERTY_AVAILABILITY_STATUSES, PROPERTY_TYPES } from "@/features/properties/types/property";

export type DiscoveryFilters = {
  listingType?: (typeof LISTING_TYPES)[number];
  propertyType?: (typeof PROPERTY_TYPES)[number];
  availabilityStatus?: (typeof PROPERTY_AVAILABILITY_STATUSES)[number];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
};