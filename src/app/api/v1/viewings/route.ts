import { NextRequest, NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";
import { AppError } from "@/lib/errors/app-error";
import { createViewingSchema } from "@/features/viewings/schemas/viewing.schema";
import {
  VIEWING_STATUSES,
  VIEWING_TYPES,
} from "@/features/viewings/types/viewing";
import { viewingService } from "@/features/viewings/services/viewing.service";

function isViewingStatus(
  value: string,
): value is (typeof VIEWING_STATUSES)[number] {
  return VIEWING_STATUSES.includes(
    value as (typeof VIEWING_STATUSES)[number],
  );
}

function isViewingType(
  value: string,
): value is (typeof VIEWING_TYPES)[number] {
  return VIEWING_TYPES.includes(
    value as (typeof VIEWING_TYPES)[number],
  );
}

function parseDate(value: string | null, fieldName: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Invalid ${fieldName}.`,
    );
  }

  return date;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status");
    const type = searchParams.get("type");

    if (status && !isViewingStatus(status)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid viewing status.",
      );
    }

    if (type && !isViewingType(type)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid viewing type.",
      );
    }

    const from = parseDate(
      searchParams.get("from"),
      "from date",
    );

    const to = parseDate(
      searchParams.get("to"),
      "to date",
    );

    if (from && to && from > to) {
      throw new AppError(
        "VALIDATION_ERROR",
        "The from date must be before the to date.",
      );
    }

    const viewings = await viewingService.list({
      status: status ?? undefined,
      type: type ?? undefined,
      propertyId:
        searchParams.get("propertyId") ?? undefined,
      agentId:
        searchParams.get("agentId") ?? undefined,
      customerId:
        searchParams.get("customerId") ?? undefined,
      leadId:
        searchParams.get("leadId") ?? undefined,
      from,
      to,
    });

    return NextResponse.json({
      success: true,
      data: viewings,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = createViewingSchema.parse(body);

    const viewing = await viewingService.create(input);

    return NextResponse.json(
      {
        success: true,
        data: viewing,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}