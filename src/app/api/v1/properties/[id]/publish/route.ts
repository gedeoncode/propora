import { NextResponse } from "next/server";

import { AppError, apiErrorResponse} from "@/lib/errors/";
import { propertyService } from "@/features/properties/services/property.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    // TODO: Authenticate the user and check their permission to publish
    // this property before calling the service.
    throw new AppError(
      "UNAUTHENTICATED",
      "Sign-in is required to publish a property.",
    );

    // After adding authentication:
    // const actor = await requireAuthenticatedUser();
    // await authorizePropertyPublish(actor, id);
    // const property = await propertyService.publish(id);
    //
    // return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return apiErrorResponse(error);
  }
}