
import { NextResponse } from "next/server";

import { updateCustomerStatusSchema } from "@/features/customers/schemas/customer.schema";
import { customerService } from "@/features/customers/services/customer.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type CustomerStatusRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: CustomerStatusRouteContext,
) {
  try {
    await requireRole(["admin", "manager", "agent"]);
    await connectToDatabase();

    const { id } = await context.params;
    const body: unknown = await request.json();
    const input = updateCustomerStatusSchema.parse(body);

    const customer = await customerService.updateStatus(id, input);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}