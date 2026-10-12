import { NextResponse } from "next/server";

import { propertyService } from "@/features/properties/services/property.service";
import { updatePropertyAvailabilitySchema } from "@/features/properties/schemas/property.schema";
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

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireRole(ALLOWED_ROLES);

    const { id } = await params;

    const body: unknown =
      await request.json();

    const input =
      updatePropertyAvailabilitySchema.parse(
        body,
      );

    const property =
      await propertyService.updateAvailability(
        id,
        input.availabilityStatus,
      );

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}