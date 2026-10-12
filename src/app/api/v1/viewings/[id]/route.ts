
import { NextResponse } from "next/server";

import { updateViewingSchema } from "@/features/viewings/schemas/viewing.schema";
import { viewingService } from "@/features/viewings/services/viewing.service";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type ViewingRouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

export async function GET(
  _request: Request,
  context: ViewingRouteContext,
) {
  try {
    await requireRole([...ALLOWED_ROLES]);

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
    await requireRole([...ALLOWED_ROLES]);
    await connectToDatabase();

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

export async function DELETE(
  _request: Request,
  context: ViewingRouteContext,
) {
  try {
    await requireRole(["admin", "manager"]);
    await connectToDatabase();

    const { id } = await context.params;

    const viewing = await viewingService.delete(id);

    return NextResponse.json({
      success: true,
      data: viewing,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}