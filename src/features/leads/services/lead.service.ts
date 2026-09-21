import "server-only";

import mongoose from "mongoose";

import { agentRepository } from "@/features/agents/repositories/agent.repository";
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  assignLeadSchema,
  type CreateLeadInput,
  type UpdateLeadInput,
  type UpdateLeadStatusInput,
  type AssignLeadInput,
} from "@/features/leads/schemas/lead.schema";
import {
  LEAD_STATUSES,
  type LeadStatus,
} from "@/features/leads/types/lead";
import { propertyRepository } from "@/features/properties/repositories/property.repository";
import { AppError } from "@/lib/errors/app-error";
import { leadRepository } from "@/features/leads/repositories/lead.repository";

const TERMINAL_LEAD_STATUSES: LeadStatus[] = ["converted", "lost"];

const ALLOWED_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted", "lost"],
  contacted: ["qualified", "lost"],
  qualified: ["viewing_scheduled", "negotiating", "lost"],
  viewing_scheduled: ["negotiating", "qualified", "lost"],
  negotiating: ["converted", "lost"],
  converted: [],
  lost: ["new"],
};

function assertValidObjectId(id: string, fieldName: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Invalid ${fieldName}.`,
    );
  }
}

async function validateAgent(agentId: string) {
  assertValidObjectId(agentId, "agent ID");

  const agent = await agentRepository.findById(agentId);

  if (!agent) {
    throw new AppError("NOT_FOUND", "Agent not found.");
  }

  if (agent.status !== "active") {
    throw new AppError(
      "CONFLICT",
      "Only active agents can be assigned to leads.",
    );
  }

  return agent;
}

async function validateProperties(propertyIds: string[]) {
  const uniquePropertyIds = [...new Set(propertyIds)];

  for (const propertyId of uniquePropertyIds) {
    assertValidObjectId(propertyId, "property ID");

    const property = await propertyRepository.findById(propertyId);

    if (!property) {
      throw new AppError(
        "NOT_FOUND",
        `Property ${propertyId} not found.`,
      );
    }
  }
}

export const leadService = {
  async getById(id: string) {
    assertValidObjectId(id, "lead ID");

    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    return lead;
  },

  async list(filters = {}) {
    return leadRepository.list(filters);
  },

  async create(input: CreateLeadInput) {
    const data = createLeadSchema.parse(input);

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.interestedPropertyIds.length > 0) {
      await validateProperties(data.interestedPropertyIds);
    }

    return leadRepository.create(data);
  },

  async update(id: string, input: UpdateLeadInput) {
    assertValidObjectId(id, "lead ID");

    const data = updateLeadSchema.parse(input);

    const existingLead = await leadRepository.findById(id);

    if (!existingLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.interestedPropertyIds) {
      await validateProperties(data.interestedPropertyIds);
    }

    const updatedLead = await leadRepository.updateById(id, data);

    if (!updatedLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    return updatedLead;
  },

  async updateStatus(
    id: string,
    input: UpdateLeadStatusInput,
  ) {
    assertValidObjectId(id, "lead ID");

    const data = updateLeadStatusSchema.parse(input);

    const existingLead = await leadRepository.findById(id);

    if (!existingLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    if (existingLead.status === data.status) {
      return existingLead;
    }
    const currentLeadStatus = existingLead.status as LeadStatus;
    const allowedTransitions =
      ALLOWED_STATUS_TRANSITIONS[currentLeadStatus];

    if (!allowedTransitions.includes(data.status)) {
      throw new AppError(
        "CONFLICT",
        `Lead cannot transition from "${currentLeadStatus}" to "${data.status}".`,
      );
    }

    const updatedLead = await leadRepository.updateStatus(
      id,
      data.status,
    );

    if (!updatedLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    return updatedLead;
  },

  async assignAgent(
    id: string,
    input: AssignLeadInput,
  ) {
    assertValidObjectId(id, "lead ID");

    const data = assignLeadSchema.parse(input);

    const existingLead = await leadRepository.findById(id);

    if (!existingLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    const updatedLead = await leadRepository.assignAgent(
      id,
      data.assignedAgentId,
    );

    if (!updatedLead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    return updatedLead;
  },
};