import "server-only";


import Property from "@/features/properties/models/property.model";
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@/features/properties/schemas/property.schema";
import type { PropertyListFilters, PropertyQuery } from "./property.repository.types";
import type { PaginationOptions } from "@/types/pagination";
import { withDatabase } from "@/lib/db/with-db";


export const propertyRepository = {
  async findById(id: string) {
    return withDatabase(() => Property.findById(id).exec());
  },

  async findBySlug(slug: string) {
    return withDatabase(() => Property.findOne({ slug }).exec());
  },

  async list(
    filters: PropertyListFilters = {},
    pagination: PaginationOptions = {},
  ) {
    return withDatabase(async () => {
    const page = Math.max(1, pagination.page ?? 1);
    const limit = Math.min(100, Math.max(1, pagination.limit ?? 20));
    const skip = (page - 1) * limit;

    const query: PropertyQuery = {};

    if (filters.publicationStatus) {
      query.publicationStatus = filters.publicationStatus;
    }

    if (filters.availabilityStatus) {
      query.availabilityStatus = filters.availabilityStatus;
    }

    if (filters.listingType) {
      query.listingType = filters.listingType;
    }

    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }

    if (filters.city) {
      query["location.city"] = {
        $regex: filters.city,
        $options: "i",
      };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};

      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    const [items, total] = await Promise.all([
      Property.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Property.countDocuments(query).exec(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });
  },

  async create(input: CreatePropertyInput & { slug: string; createdBy: string }) {
    return withDatabase(() => Property.create({
      ...input,
      publicationStatus: "draft",
    }));
  },

  async updateById(id: string, input: UpdatePropertyInput) {
    return withDatabase(() => 
      Property.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
    }).exec())
  },

  async archiveById(id: string) {
    return withDatabase(() =>
      Property.findByIdAndUpdate(
        id,
      { publicationStatus: "archived" },
      {
        new: true,
        runValidators: true,
      },
    ).exec())
  },
};