import "server-only";

import Agent from "@/features/agents/models/agent.model";
import Customer from "@/features/customers/models/customer.model";
import Lead from "@/features/leads/models/lead.mode";
import Property from "@/features/properties/models/property.model";
import Viewing from "@/features/viewings/models/viewing.model";

type DashboardRepositoryOptions = {
  agentId?: string;
};

export const dashboardRepository = {
  async getMetrics(options: DashboardRepositoryOptions = {}) {
    const { agentId } = options;

    const propertyFilter = agentId
      ? { assignedAgentId: agentId }
      : {};

    const leadFilter = agentId
      ? { assignedAgentId: agentId }
      : {};

    const customerFilter = agentId
      ? { assignedAgentId: agentId }
      : {};

    const viewingFilter = agentId
      ? { agentId }
      : {};

    const [
      totalProperties,
      publishedProperties,
      availableProperties,
      activeLeads,
      activeCustomers,
      activeAgents,
      upcomingViewings,
    ] = await Promise.all([
      Property.countDocuments(propertyFilter).exec(),

      Property.countDocuments({
        ...propertyFilter,
        publicationStatus: "published",
      }).exec(),

      Property.countDocuments({
        ...propertyFilter,
        availabilityStatus: "available",
      }).exec(),

      Lead.countDocuments({
        ...leadFilter,
        status: {
          $nin: ["converted", "lost"],
        },
      }).exec(),

      Customer.countDocuments({
        ...customerFilter,
        status: "active",
      }).exec(),

      agentId
        ? 1
        : Agent.countDocuments({
            status: "active",
          }).exec(),

      Viewing.countDocuments({
        ...viewingFilter,
        status: {
          $in: ["scheduled", "confirmed"],
        },
        scheduledAt: {
          $gte: new Date(),
        },
      }).exec(),
    ]);

    return {
      properties: {
        total: totalProperties,
        published: publishedProperties,
        available: availableProperties,
      },
      leads: {
        active: activeLeads,
      },
      customers: {
        active: activeCustomers,
      },
      agents: {
        active: activeAgents,
      },
      viewings: {
        upcoming: upcomingViewings,
      },
    };
  },

  async listUpcomingViewings(
    limit = 5,
    options: DashboardRepositoryOptions = {},
  ) {
    const { agentId } = options;

    const viewingFilter = agentId
      ? { agentId }
      : {};

    return Viewing.find({
      ...viewingFilter,
      status: {
        $in: ["scheduled", "confirmed"],
      },
      scheduledAt: {
        $gte: new Date(),
      },
    })
      .sort({ scheduledAt: 1 })
      .limit(limit)
      .populate({
        path: "propertyId",
        select: "title location.city",
      })
      .populate({
        path: "agentId",
        select: "firstName lastName",
      })
      .populate({
        path: "customerId",
        select: "firstName lastName",
      })
      .populate({
        path: "leadId",
        select: "firstName lastName",
      })
      .lean()
      .exec();
  },
};