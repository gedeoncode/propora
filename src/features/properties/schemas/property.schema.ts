import { z } from "zod";

import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";

const mediaSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().min(1).max(250),
  order: z.number().int().min(0).default(0),
});

const locationSchema = z.object({
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional(),
  country: z.string().trim().min(1).max(120),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

const specificationsSchema = z.object({
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  area: z.number().positive().optional(),
  areaUnit: z.enum(["sqm", "sqft", "acre", "hectare"]).optional(),
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(20).max(10_000),

  propertyType: z.enum(PROPERTY_TYPES),
  listingType: z.enum(LISTING_TYPES),

  availabilityStatus: z
    .enum(PROPERTY_AVAILABILITY_STATUSES)
    .default("available"),

  price: z.number().min(0),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/)
    .transform((value) => value.toUpperCase())
    .default("KES"),

  location: locationSchema,
  specifications: specificationsSchema.default({}),
  amenities: z.array(z.string().trim().min(1).max(100)).max(100).default([]),

  media: z.array(mediaSchema).max(50).default([]),

  assignedAgentId: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

// Publication and availability updates are handled by dedicated operations, so we define separate schemas for those.
export const publishPropertySchema = z.object({
  propertyId: z.string().min(1),
});

export const updatePropertyAvailabilitySchema = z.object({
  availabilityStatus: z.enum(PROPERTY_AVAILABILITY_STATUSES),
});

export type PublishPropertyInput = z.infer<typeof publishPropertySchema>;

export type UpdatePropertyAvailabilityInput = z.infer<
  typeof updatePropertyAvailabilitySchema
>;
