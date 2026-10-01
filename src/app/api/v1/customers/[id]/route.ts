
import { NextResponse } from "next/server";

import { customerService } from "@/features/customers/services/customer.service";
import { updateCustomerSchema } from "@/features/customers/schemas/customer.schema";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

type CustomerRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: CustomerRouteContext,
) {
  try {
    await requireRole(["admin", "manager", "agent"]);
    await connectToDatabase();

    const { id } = await context.params;
    const customer = await customerService.getById(id);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: CustomerRouteContext,
) {
  try {
    await requireRole(["admin", "manager", "agent"]);
    await connectToDatabase();

    const { id } = await context.params;
    const body: unknown = await request.json();
    const input = updateCustomerSchema.parse(body);

    const customer = await customerService.update(id, input);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}