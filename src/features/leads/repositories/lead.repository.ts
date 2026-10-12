import "server-only";

import Lead from "@/features/leads/models/lead.mode";
import type {
  CreateLeadInput,
  UpdateLeadInput,
} from "@/features/leads/schemas/lead.schema";
import type {
  LeadSource,
  LeadStatus,
} from "@/features/leads/types/lead";
import { withDatabase } from "@/lib/db/with-db";

export type LeadListFilters = {
  status?: LeadStatus;
  source?: LeadSource;
  assignedAgentId?: string;
  interestedPropertyId?: string;
};

export const leadRepository = {

  async findById(id: string) {
    return withDatabase(() => Lead.findById(id).exec());
  },

  async list(filters: LeadListFilters = {}) {
    return withDatabase(() => {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.assignedAgentId) {
      query.assignedAgentId = filters.assignedAgentId;
    }

    if (filters.interestedPropertyId) {
      query.interestedPropertyIds = filters.interestedPropertyId;
    }

    return Lead.find(query)
      .sort({ createdAt: -1 })
      .exec();
  })
  },

  async create(input: CreateLeadInput) {
    return withDatabase(() => Lead.create(input));
  },

  async updateById(id: string, input: UpdateLeadInput) {
    return withDatabase(() => 
      Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).exec()
  )
  },

  async updateStatus(id: string, status: LeadStatus) {
    return withDatabase(() =>
    Lead.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true, 
      },
    ).exec())
  },

  async assignAgent(id: string, assignedAgentId: string | null) {
    return withDatabase(() =>
      Lead.findByIdAndUpdate(
        id,
      { assignedAgentId },
      {
        new: true,
        runValidators: true,
      },
    ).exec())
  },

  async deleteById(id: string) {
  return withDatabase(() => Lead.findByIdAndDelete(id).exec());
},
};