import "server-only";

import Agent from "@/features/agents/models/agent.model";
import { dashboardRepository } from "@/features/analytics/repositories/dashboard.repository";
import { requireRole } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors/app-error";

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
      const agent = await Agent.findOne({
        userId: user.id,
      })
        .select("_id")
        .lean()
        .exec();

      if (!agent) {
        throw new AppError(
          "NOT_FOUND",
          "Agent profile was not found.",
        );
      }

      agentId = agent._id.toString();
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