import { NextResponse } from "next/server";

import { viewingService } from "@/features/viewings/services/viewing.service";
import { updateViewingStatusSchema } from "@/features/viewings/schemas/viewing.schema";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type ViewingStatusRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: ViewingStatusRouteContext,
) {
  try {
    await requireRole(["admin", "manager", "agent", "staff"]);

    const { id } = await context.params;

    const body: unknown = await request.json();
    const input = updateViewingStatusSchema.parse(body);

    const viewing = await viewingService.updateStatus(id, input);

    return NextResponse.json({
      success: true,
      data: viewing,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}