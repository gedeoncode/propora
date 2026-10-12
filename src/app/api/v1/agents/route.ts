import { NextRequest, NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";
import { AppError } from "@/lib/errors/app-error";
import { requireAdmin } from "@/lib/auth/guards";

import { agentService } from "@/features/agents/services/agent.service";
import { createAgentWithUserSchema } from "@/features/agents/schemas/agent.schema";
import { AGENT_STATUSES } from "@/features/agents/types/agent";

function isAgentStatus(
  value: string,
): value is (typeof AGENT_STATUSES)[number] {
  return AGENT_STATUSES.includes(
    value as (typeof AGENT_STATUSES)[number],
  );
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const status = request.nextUrl.searchParams.get("status");

    if (status && !isAgentStatus(status)) {
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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const input = createAgentWithUserSchema.parse(body);

    const result = await agentService.createWithUser(input);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: result.user._id.toString(),
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            role: result.user.role,
            status: result.user.status,
            createdAt: result.user.createdAt,
          },
          agent: result.agent,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
