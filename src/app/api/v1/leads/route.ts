
import { NextRequest, NextResponse } from "next/server";

import { leadService } from "@/features/leads/services/lead.service";
import { createLeadSchema } from "@/features/leads/schemas/lead.schema";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "@/features/leads/types/lead";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors/app-error";
import { apiErrorResponse } from "@/lib/errors/api-error";

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

function isLeadStatus(value: string) {
  return LEAD_STATUSES.includes(
    value as (typeof LEAD_STATUSES)[number],
  );
}

function isLeadSource(value: string) {
  return LEAD_SOURCES.includes(
    value as (typeof LEAD_SOURCES)[number],
  );
}

export async function GET(request: NextRequest) {
  try {
    await requireRole([...ALLOWED_ROLES]);
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const source = searchParams.get("source");

    if (status && !isLeadStatus(status)) {
      throw new AppError("VALIDATION_ERROR", "Invalid lead status.");
    }

    if (source && !isLeadSource(source)) {
      throw new AppError("VALIDATION_ERROR", "Invalid lead source.");
    }

    const leads = await leadService.list({
      status: status ?? undefined,
      source: source ?? undefined,
      assignedAgentId: searchParams.get("assignedAgentId") ?? undefined,
      interestedPropertyId:
        searchParams.get("interestedPropertyId") ?? undefined,
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
    await requireRole([...ALLOWED_ROLES]);
    await connectToDatabase();

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