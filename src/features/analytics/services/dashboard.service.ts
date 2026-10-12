import "server-only";

import Agent from "@/features/agents/models/agent.model";
import { dashboardRepository } from "@/features/analytics/repositories/dashboard.repository";
import { requireRole } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors/app-error";
import { agentRepository } from "@/features/agents/repositories/agent.repository";

const DEFAULT_UPCOMING_VIEWINGS_LIMIT = 5;

export const dashboardService = {
  async getOverview(
    upcomingViewingsLimit = DEFAULT_UPCOMING_VIEWINGS_LIMIT,
  ) {
    const user = await requireRole([
      "admin",
      "manager",
      "agent",
      "staff",
    ]);

    const limit = Math.min(
      20,
      Math.max(1, upcomingViewingsLimit),
    );

    let agentId: string | undefined;

    if (user.role === "agent") {
     const foundAgentId = await agentRepository.findIdByUserId(user.id);

      if (!foundAgentId) {
        throw new AppError(
          "NOT_FOUND",
          "Agent profile was not found.",
        );
      }

      agentId = foundAgentId;
    }

    const repositoryOptions = {
      ...(agentId ? { agentId } : {}),
    };

    const [metrics, upcomingViewings] = await Promise.all([
      dashboardRepository.getMetrics(repositoryOptions),
      dashboardRepository.listUpcomingViewings(
        limit,
        repositoryOptions,
      ),
    ]);

    return {
      role: user.role,
      scope: agentId ? "agent" : "workspace",
      metrics,
      upcomingViewings,
    };
  },
};