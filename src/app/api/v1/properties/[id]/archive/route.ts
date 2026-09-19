import { NextResponse } from "next/server";

import { AppError, apiErrorResponse } from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    // TODO: Authenticate the user and verify their permission to archive
    // this property.
    throw new AppError(
      "UNAUTHENTICATED",
      "Sign-in is required to archive a property.",
    );

    // After authentication and authorization are implemented:
    //
    // const actor = await requireAuthenticatedUser();
    // const { id } = await params;
    // await authorizePropertyArchive(actor, id);
    //
    // const property = await propertyService.archive(id);
    //
    // return NextResponse.json({
    //   success: true,
    //   data: property,
    // });
  } catch (error) {
    return apiErrorResponse(error);
  }
}