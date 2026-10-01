import { NextResponse } from "next/server";

import { AppError } from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";
import { updatePropertySchema } from "@/features/properties/schemas/property.schema";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = [
  "admin",
  "manager",
  "agent",
  "staff",
] as const;

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const property =
      await propertyService.getById(id);

    if (
      property.publicationStatus !==
      "published"
    ) {
      throw new AppError(
        "NOT_FOUND",
        "Property not found.",
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireRole(ALLOWED_ROLES);
    await connectToDatabase();

    const { id } = await params;

    const body: unknown =
      await request.json();

    const input =
      updatePropertySchema.parse(body);

    const property =
      await propertyService.update(
        id,
        input,
      );

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}