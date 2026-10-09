import "server-only";

import { isValidObjectId } from "mongoose";

import { AppError } from "@/lib/errors/app-error";
import { propertyRepository } from "@/features/properties/repositories/property.repository";

import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@/features/properties/schemas/property.schema";

import type { PropertyListFilters } from "@/features/properties/repositories/property.repository.types";
import { PaginationOptions } from "@/types/pagination";
import { PropertyAvailabilityStatus } from "../types/property";

function ensureValidId(id: string) {
  if (!isValidObjectId(id)) {
    throw new AppError("VALIDATION_ERROR", "Invalid property ID.");
  }
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateSlug(title: string) {
  const base = slugify(title) || "property";

  // A short random suffix reduces the chance of slug collisions.
  const suffix = crypto.randomUUID().slice(0, 8);

  return `${base}-${suffix}`;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export const propertyService = {
  async create(input: CreatePropertyInput, createdBy: string) {
    ensureValidId(createdBy);

    try {
      return await propertyRepository.create({
        ...input,
        slug: generateSlug(input.title),
        createdBy,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(
          "CONFLICT",
          "A property with conflicting unique data already exists.",
        );
      }

      throw error;
    }
  },

  async getById(id: string) {
    ensureValidId(id);

    const property = await propertyRepository.findById(id);

    if (!property) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    return property;
  },

  async getBySlug(slug: string) {
    const property = await propertyRepository.findBySlug(slug);

    if (!property) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    return property;
  },

  async getPublicBySlug(slug: string) {
    const property = await propertyRepository.findBySlug(slug);

    if (!property || property.publicationStatus !== "published") {
      return null;
    }

    return property;
  },

  async list(
    filters: PropertyListFilters = {},
    pagination: PaginationOptions = {},
  ) {
    return propertyRepository.list(filters, pagination);
  },

  /**
   * Public discovery should use this method rather than the unrestricted list.
   * This prevents draft and archived properties from appearing publicly.
   */
  async listPublic(
    filters: Omit<PropertyListFilters, "publicationStatus"> = {},
    pagination: PaginationOptions = {},
  ) {
    return propertyRepository.list(
      {
        ...filters,
        publicationStatus: "published",
      },
      pagination,
    );
  },

  async update(id: string, input: UpdatePropertyInput) {
    ensureValidId(id);

    const existing = await propertyRepository.findById(id);

    if (!existing) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    if (existing.publicationStatus === "archived") {
      throw new AppError("CONFLICT", "Archived properties cannot be edited.");
    }

    try {
      const updated = await propertyRepository.updateById(id, input);

      if (!updated) {
        throw new AppError("NOT_FOUND", "Property not found.");
      }

      return updated;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(
          "CONFLICT",
          "A property with conflicting unique data already exists.",
        );
      }

      throw error;
    }
  },

  async publish(id: string) {
    ensureValidId(id);

    const property = await propertyRepository.findById(id);

    if (!property) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    if (property.publicationStatus === "archived") {
      throw new AppError(
        "CONFLICT",
        "Archived properties cannot be published.",
      );
    }

    if (
      !property.title.trim() ||
      !property.description.trim() ||
      !property.location?.city?.trim() ||
      !property.location?.country?.trim() ||
      property.price <= 0
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Complete the property title, description, location, and price before publishing.",
      );
    }

    if (!property.media || property.media.length === 0) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Add at least one property image before publishing.",
      );
    }

    property.publicationStatus = "published";

    if (!property.publishedAt) {
      property.publishedAt = new Date();
    }

    await property.save();

    return property;
  },

  async archive(id: string) {
    ensureValidId(id);

    const property = await propertyRepository.archiveById(id);

    if (!property) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    return property;
  },

  async updateAvailability(
    id: string,
    availabilityStatus: PropertyAvailabilityStatus,
  ) {
    ensureValidId(id);

    const property = await propertyRepository.findById(id);

    if (!property) {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    if (property.publicationStatus === "archived") {
      throw new AppError(
        "CONFLICT",
        "Archived properties cannot have their availability changed.",
      );
    }

    property.availabilityStatus = availabilityStatus;

    await property.save();

    return property;
  },
};
