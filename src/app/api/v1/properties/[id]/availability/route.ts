import { NextResponse } from "next/server";

import { AppError, apiErrorResponse } from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";
import { updatePropertyAvailabilitySchema } from "@/features/properties/schemas/property.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    // TODO: Authenticate the user and check their permission to change
    // availability for this property.
    throw new AppError(
      "UNAUTHENTICATED",
      "Sign-in is required to change property availability.",
    );

    // After adding authentication:
    // const actor = await requireAuthenticatedUser();
    // const { id } = await params;
    // await authorizePropertyUpdate(actor, id);
    //
    // let body: unknown;
    // try {
    //   body = await request.json();
    // } catch {
    //   throw new AppError("VALIDATION_ERROR", "Request body must be valid JSON.");
    // }
    //
    // const parsed = updatePropertyAvailabilitySchema.safeParse({
    //   ...body,
    //   propertyId: id,
    // });
    //
    // if (!parsed.success) {
    //   throw new AppError("VALIDATION_ERROR", "Invalid availability status.");
    // }
    //
    // const property = await propertyService.updateAvailability(
    //   id,
    //   parsed.data.availabilityStatus,
    // );
    //
    // return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return apiErrorResponse(error);
  }
}