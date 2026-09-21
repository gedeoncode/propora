import { NextRequest, NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";
import { AppError } from "@/lib/errors/app-error";
import {
  createLeadSchema,
} from "@/features/leads/schemas/lead.schema";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "@/features/leads/types/lead";
import { leadService } from "@/features/leads/services/lead.service";

function isLeadStatus(
  value: string,
): value is (typeof LEAD_STATUSES)[number] {
  return LEAD_STATUSES.includes(
    value as (typeof LEAD_STATUSES)[number],
  );
}

function isLeadSource(
  value: string,
): value is (typeof LEAD_SOURCES)[number] {
  return LEAD_SOURCES.includes(
    value as (typeof LEAD_SOURCES)[number],
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const assignedAgentId =
      searchParams.get("assignedAgentId") ?? undefined;
    const interestedPropertyId =
      searchParams.get("interestedPropertyId") ?? undefined;

    if (status && !isLeadStatus(status)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid lead status.",
      );
    }

    if (source && !isLeadSource(source)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid lead source.",
      );
    }

    const leads = await leadService.list({
      status: status ?? undefined,
      source: source ?? undefined,
      assignedAgentId,
      interestedPropertyId,
    });

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = createLeadSchema.parse(body);

    const lead = await leadService.create(input);

    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}