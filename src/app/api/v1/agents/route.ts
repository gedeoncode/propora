import { NextRequest, NextResponse } from "next/server";

import { AppError } from "@/lib/errors/app-error";
import { apiErrorResponse } from "@/lib/errors/api-error";

import { AGENT_STATUSES } from "@/features/agents/types/agent";
import { agentService } from "@/features/agents/services/agent.service";
import { createAgentSchema } from "@/features/agents/schemas/agent.schema";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status");

    if (
      status &&
      !AGENT_STATUSES.includes(
        status as (typeof AGENT_STATUSES)[number],
      )
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid agent status.",
      );
    }

    const agents = await agentService.list(
      status as (typeof AGENT_STATUSES)[number] | undefined,
    );

    return NextResponse.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

// POST /api/v1/agents

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    const input = createAgentSchema.parse(body);

    const agent = await agentService.create(input);

    return NextResponse.json(
      {
        success: true,
        data: agent,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}