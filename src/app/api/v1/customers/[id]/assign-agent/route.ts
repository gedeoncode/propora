
import { NextResponse } from "next/server";

import { assignCustomerSchema } from "@/features/customers/schemas/customer.schema";
import { customerService } from "@/features/customers/services/customer.service";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type AssignCustomerRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: AssignCustomerRouteContext,
) {
  try {
    await requireRole(["admin", "manager", "agent", "staff"]);

    const { id } = await context.params;
    const body: unknown = await request.json();
    const input = assignCustomerSchema.parse(body);

    const customer = await customerService.assignAgent(id, input);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}