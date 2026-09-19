import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_PUBLICATION_STATUSES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";

const PropertyMediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const PropertyLocationSchema = new Schema(
  {
    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    region: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  { _id: false },
);

const PropertySpecificationsSchema = new Schema(
  {
    bedrooms: {
      type: Number,
      min: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
    },
    area: {
      type: Number,
      min: 0,
    },
    areaUnit: {
      type: String,
      enum: ["sqm", "sqft", "acre", "hectare"],
    },
  },
  { _id: false },
);

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 160,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },

    propertyType: {
      type: String,
      required: true,
      enum: PROPERTY_TYPES,
    },

    listingType: {
      type: String,
      required: true,
      enum: LISTING_TYPES,
    },

    publicationStatus: {
      type: String,
      required: true,
      enum: PROPERTY_PUBLICATION_STATUSES,
      default: "draft",
      index: true,
    },

    availabilityStatus: {
      type: String,
      required: true,
      enum: PROPERTY_AVAILABILITY_STATUSES,
      default: "available",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z]{3}$/,
      default: "KES",
    },

    location: {
      type: PropertyLocationSchema,
      required: true,
    },

    specifications: {
      type: PropertySpecificationsSchema,
      default: () => ({}),
    },

    amenities: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) =>
          items.length <= 100 &&
          items.every((item) => item.trim().length > 0 && item.length <= 100),
        message: "Amenities must contain up to 100 non-empty items.",
      },
    },

    media: {
      type: [PropertyMediaSchema],
      default: [],
      validate: {
        validator: (items: unknown[]) => items.length <= 50,
        message: "A property can have at most 50 media items.",
      },
    },

    assignedAgentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Common query patterns
PropertySchema.index({
  publicationStatus: 1,
  availabilityStatus: 1,
  listingType: 1,
  createdAt: -1,
});

PropertySchema.index({
  "location.city": 1,
  propertyType: 1,
  listingType: 1,
});

PropertySchema.index({ price: 1 });
PropertySchema.index({ assignedAgentId: 1 });

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);

export default Property;