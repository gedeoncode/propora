import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";
import { updateViewingSchema } from "@/features/viewings/schemas/viewing.schema";
import { viewingService } from "@/features/viewings/services/viewing.service";

type ViewingRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: ViewingRouteContext,
) {
  try {
    const { id } = await context.params;

    const viewing = await viewingService.getById(id);

    return NextResponse.json({
      success: true,
      data: viewing,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: ViewingRouteContext,
) {
  try {
    const { id } = await context.params;

    const body: unknown = await request.json();
    const input = updateViewingSchema.parse(body);

    const viewing = await viewingService.update(id, input);

    return NextResponse.json({
      success: true,
      data: viewing,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}