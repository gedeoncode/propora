import { NextRequest, NextResponse } from "next/server";

import { AppError, apiErrorResponse } from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";
import { createPropertySchema } from "@/features/properties/schemas/property.schema";
import {
  LISTING_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
  PROPERTY_TYPES,
  PropertyAvailabilityStatus,
} from "@/features/properties/types/property";

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}


export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const listingType = params.get("listingType");
    const propertyType = params.get("propertyType");
    const availabilityStatus = params.get("availabilityStatus");

    const minPrice = parseNumber(params.get("minPrice"));
    const maxPrice = parseNumber(params.get("maxPrice"));

    const page = Number(params.get("page") ?? 1);
    const limit = Number(params.get("limit") ?? 20);

    if (
      listingType &&
      !LISTING_TYPES.includes(listingType as (typeof LISTING_TYPES)[number])
    ) {
      throw new AppError("VALIDATION_ERROR", "Invalid listingType.");
    }

    if (
      propertyType &&
      !PROPERTY_TYPES.includes(propertyType as (typeof PROPERTY_TYPES)[number])
    ) {
      throw new AppError("VALIDATION_ERROR", "Invalid propertyType.");
    }

    if (
      availabilityStatus &&
      !PROPERTY_AVAILABILITY_STATUSES.includes(
        availabilityStatus as  PropertyAvailabilityStatus,
      )
    ) {
      throw new AppError("VALIDATION_ERROR", "Invalid availabilityStatus.");
    }

    if (
      (params.has("minPrice") && minPrice === undefined) ||
      (params.has("maxPrice") && maxPrice === undefined)
    ) {
      throw new AppError("VALIDATION_ERROR", "Prices must be valid numbers.");
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "minPrice cannot be greater than maxPrice.",
      );
    }

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError(
        "VALIDATION_ERROR",
        "page must be a positive integer.",
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new AppError(
        "VALIDATION_ERROR",
        "limit must be an integer between 1 and 100.",
      );
    }

    const filters = {
      listingType: listingType as (typeof LISTING_TYPES)[number] | undefined,
      propertyType: propertyType as (typeof PROPERTY_TYPES)[number] | undefined,
      availabilityStatus: availabilityStatus as
        | PropertyAvailabilityStatus
        | undefined,
      city: params.get("city")?.trim() || undefined,
      minPrice,
      maxPrice,
    };

    const result = await propertyService.listPublic(filters, { page, limit });

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Integrate your authentication provider here.
    // Resolve the current user from a verified server-side session,
    // then check that their role permits property creation.
    //
    // Do not use a user ID supplied by the request body or an
    // unverified request header.
    throw new AppError(
      "UNAUTHENTICATED",
      "Sign-in is required to create a property.",
    );

    // Once authentication is implemented:
    //
    // const actor = await requireAuthenticatedUser();
    // const body = await request.json();
    // const parsed = createPropertySchema.safeParse(body);
    //
    // if (!parsed.success) {
    //   throw new AppError("VALIDATION_ERROR", "Invalid property data.");
    // }
    //
    // const property = await propertyService.create(parsed.data, actor.id);
    //
    // return NextResponse.json(
    //   { success: true, data: property },
    //   { status: 201 },
    // );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
