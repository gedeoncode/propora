import type { Types } from "mongoose";

export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "townhouse",
  "villa",
  "land",
  "office",
  "retail",
  "warehouse",
  "other",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_TYPES = ["sale", "rent"] as const;

export type ListingType = (typeof LISTING_TYPES)[number];

export const PROPERTY_PUBLICATION_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type PropertyPublicationStatus =
  (typeof PROPERTY_PUBLICATION_STATUSES)[number];

export const PROPERTY_AVAILABILITY_STATUSES = [
  "available",
  "under_offer",
  "rented",
  "sold",
  "withdrawn",
] as const;

export type PropertyAvailabilityStatus =
  (typeof PROPERTY_AVAILABILITY_STATUSES)[number];

export type PropertyMedia = {
  url: string;
  alt: string;
  order: number;
};

export type PropertyLocation = {
  address?: string;
  city: string;
  region?: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type PropertySpecifications = {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: "sqm" | "sqft" | "acre" | "hectare";
};

export type PropertyRecord = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  publicationStatus: PropertyPublicationStatus;
  availabilityStatus: PropertyAvailabilityStatus;
  price: number;
  currency: string;
  location: PropertyLocation;
  specifications: PropertySpecifications;
  amenities: string[];
  media: PropertyMedia[];
  assignedAgentId?: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date; };


