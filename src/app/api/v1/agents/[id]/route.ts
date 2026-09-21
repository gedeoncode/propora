import { NextResponse } from "next/server";

import { apiErrorResponse } from "@/lib/errors/api-error";

import { updateAgentSchema } from "@/features/agents/schemas/agent.schema";
import { agentService } from "@/features/agents/services/agent.service";

type AgentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: AgentRouteContext,
) {
  try {
    const { id } = await context.params;

    const agent = await agentService.getById(id);

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: AgentRouteContext,
) {
  try {
    const { id } = await context.params;

    const body: unknown = await request.json();

    const input = updateAgentSchema.parse(body);

    const agent = await agentService.update(id, input);

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}