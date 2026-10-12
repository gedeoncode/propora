
import { NextResponse } from "next/server";

import { updateLeadStatusSchema } from "@/features/leads/schemas/lead.schema";
import { leadService } from "@/features/leads/services/lead.service";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type LeadRouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

export async function PATCH(
  request: Request,
  context: LeadRouteContext,
) {
  try {
    await requireRole([...ALLOWED_ROLES]);

    const { id } = await context.params;
    const body: unknown = await request.json();
    const input = updateLeadStatusSchema.parse(body);

    const lead = await leadService.updateStatus(id, input);

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}