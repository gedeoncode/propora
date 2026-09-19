import { NextResponse } from "next/server";

import { AppError, apiErrorResponse } from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";
import { updatePropertySchema } from "@/features/properties/schemas/property.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const property = await propertyService.getById(id);

    // This endpoint is currently public. Do not expose draft or archived
    // properties until authenticated staff access is implemented.
    if (property.publicationStatus !== "published") {
      throw new AppError("NOT_FOUND", "Property not found.");
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
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    // TODO: Replace this guard with a verified server-side session check
    // and a permission check for the property being edited.
    throw new AppError(
      "UNAUTHENTICATED",
      "Sign-in is required to update a property.",
    );

    // Once authentication and authorization are implemented:
    //
    // const actor = await requireAuthenticatedUser();
    // await authorizePropertyUpdate(actor, id);
    //
    // let body: unknown;
    // try {
    //   body = await _request.json();
    // } catch {
    //   throw new AppError("VALIDATION_ERROR", "Request body must be valid JSON.");
    // }
    //
    // const parsed = updatePropertySchema.safeParse(body);
    //
    // if (!parsed.success) {
    //   throw new AppError("VALIDATION_ERROR", "Invalid property data.");
    // }
    //
    // const property = await propertyService.update(id, parsed.data);
    //
    // return NextResponse.json({
    //   success: true,
    //   data: property,
    // });
  } catch (error) {
    return apiErrorResponse(error);
  }
}