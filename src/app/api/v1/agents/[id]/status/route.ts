import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";

import { updateAgentStatusSchema } from "@/features/agents/schemas/agent.schema";
import { agentService } from "@/features/agents/services/agent.service";

type AgentStatusRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: AgentStatusRouteContext,
) {
  try {
    const { id } = await context.params;

    const body: unknown = await request.json();

    const input = updateAgentStatusSchema.parse(body);

    const agent = await agentService.updateStatus(
      id,
      input,
    );

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}