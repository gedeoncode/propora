
import { NextRequest, NextResponse } from "next/server";

import {
  createCustomerSchema,
} from "@/features/customers/schemas/customer.schema";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";
import { customerService } from "@/features/customers/services/customer.service";
import { requireRole } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";
import { AppError } from "@/lib/errors/app-error";

function isCustomerStatus(
  value: string,
): value is (typeof CUSTOMER_STATUSES)[number] {
  return CUSTOMER_STATUSES.includes(
    value as (typeof CUSTOMER_STATUSES)[number],
  );
}

function isCustomerType(
  value: string,
): value is (typeof CUSTOMER_TYPES)[number] {
  return CUSTOMER_TYPES.includes(
    value as (typeof CUSTOMER_TYPES)[number],
  );
}

export async function GET(request: NextRequest) {
  try {
    await requireRole(["admin", "manager", "agent", "staff"]);

    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status");
    const customerType = searchParams.get("customerType");
    const assignedAgentId =
      searchParams.get("assignedAgentId") ?? undefined;
    const sourceLeadId =
      searchParams.get("sourceLeadId") ?? undefined;

    if (status && !isCustomerStatus(status)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid customer status.",
      );
    }

    if (customerType && !isCustomerType(customerType)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid customer type.",
      );
    }

    const customers = await customerService.list({
      status: status ? (status as (typeof CUSTOMER_STATUSES)[number]) : undefined,
      customerType: customerType
        ? (customerType as (typeof CUSTOMER_TYPES)[number])
        : undefined,
      assignedAgentId,
      sourceLeadId,
    });

    return NextResponse.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["admin", "manager", "agent", "staff"]);

    const body: unknown = await request.json();
    const input = createCustomerSchema.parse(body);

    const customer = await customerService.create(input);

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}