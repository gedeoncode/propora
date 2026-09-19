import {
  PropertyPublicationStatus,
  PropertyAvailabilityStatus,
  ListingType,
  PropertyType,
} from "@/features/properties/types/property";

export type PropertyListFilters = {
  publicationStatus?: PropertyPublicationStatus;
  availabilityStatus?: PropertyAvailabilityStatus;
  listingType?: ListingType;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type PropertyQuery = {
  publicationStatus?: PropertyListFilters["publicationStatus"];
  availabilityStatus?: PropertyListFilters["availabilityStatus"];
  listingType?: PropertyListFilters["listingType"];
  propertyType?: PropertyListFilters["propertyType"];
  "location.city"?: {
    $regex: string;
    $options: "i";
  };
  price?: {
    $gte?: number;
    $lte?: number;
  };
};
