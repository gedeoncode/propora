import "server-only";

import mongoose from "mongoose";

import { agentRepository } from "@/features/agents/repositories/agent.repository";
import {
  createViewingSchema,
  updateViewingSchema,
  updateViewingStatusSchema,
  type CreateViewingInput,
  type UpdateViewingInput,
  type UpdateViewingStatusInput,
} from "@/features/viewings/schemas/viewing.schema";
import { viewingRepository } from "@/features/viewings/repositories/viewing.repository";
import { VIEWING_STATUSES } from "@/features/viewings/types/viewing";
import { customerRepository } from "@/features/customers/repositories/customer.repository";
import { leadRepository } from "@/features/leads/repositories/lead.repository";
import { propertyRepository } from "@/features/properties/repositories/property.repository";
import { AppError } from "@/lib/errors/app-error";

const NON_EDITABLE_STATUSES = ["completed", "cancelled", "no_show"] as const;

function assertValidObjectId(id: string, fieldName: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("VALIDATION_ERROR", `Invalid ${fieldName}.`);
  }
}

function assertParticipant(customerId?: string, leadId?: string) {
  if (!customerId && !leadId) {
    throw new AppError(
      "VALIDATION_ERROR",
      "A viewing must have a customer or lead.",
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
    throw new AppError("CONFLICT", "Only active agents can conduct viewings.");
  }

  return agent;
}

async function validateProperty(propertyId: string) {
  assertValidObjectId(propertyId, "property ID");

  const property = await propertyRepository.findById(propertyId);

  if (!property) {
    throw new AppError("NOT_FOUND", "Property not found.");
  }

  if (property.publicationStatus === "archived") {
    throw new AppError(
      "CONFLICT",
      "Archived properties cannot have new viewings.",
    );
  }

  if (
    property.availabilityStatus === "sold" ||
    property.availabilityStatus === "rented" ||
    property.availabilityStatus === "withdrawn"
  ) {
    throw new AppError(
      "CONFLICT",
      "This property is not available for new viewings.",
    );
  }

  return property;
}

async function validateParticipant(customerId?: string, leadId?: string) {
  assertParticipant(customerId, leadId);

  if (customerId) {
    assertValidObjectId(customerId, "customer ID");

    const customer = await customerRepository.findById(customerId);

    if (!customer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }
  }

  if (leadId) {
    assertValidObjectId(leadId, "lead ID");

    const lead = await leadRepository.findById(leadId);

    if (!lead) {
      throw new AppError("NOT_FOUND", "Lead not found.");
    }

    if (lead.status === "lost") {
      throw new AppError("CONFLICT", "A lost lead cannot have a new viewing.");
    }
  }
}

function assertSchedulableDate(scheduledAt: Date) {
  if (Number.isNaN(scheduledAt.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid viewing date.");
  }

  if (scheduledAt.getTime() <= Date.now()) {
    throw new AppError(
      "VALIDATION_ERROR",
      "A viewing must be scheduled for a future date and time.",
    );
  }
}

async function assertNoAgentConflict(
  agentId: string,
  scheduledAt: Date,
  durationMinutes: number,
  excludeViewingId?: string,
) {
  const conflict = await viewingRepository.findConflictingViewing(
    agentId,
    scheduledAt,
    durationMinutes,
    excludeViewingId,
  );

  if (conflict) {
    throw new AppError(
      "CONFLICT",
      "The agent already has another viewing during this time.",
    );
  }
}

export const viewingService = {
  async getById(id: string) {
    assertValidObjectId(id, "viewing ID");

    const viewing = await viewingRepository.findById(id);

    if (!viewing) {
      throw new AppError("NOT_FOUND", "Viewing not found.");
    }

    return viewing;
  },

  async list(filters = {}) {
    return viewingRepository.list(filters);
  },

  async create(input: CreateViewingInput) {
    const data = createViewingSchema.parse(input);

    await validateAgent(data.agentId);
    await validateProperty(data.propertyId);
    await validateParticipant(data.customerId, data.leadId);

    assertSchedulableDate(data.scheduledAt);

    await assertNoAgentConflict(
      data.agentId,
      data.scheduledAt,
      data.durationMinutes,
    );

    return viewingRepository.create(data);
  },

  async update(id: string, input: UpdateViewingInput) {
    assertValidObjectId(id, "viewing ID");

    const data = updateViewingSchema.parse(input);

    const existingViewing = await viewingRepository.findById(id);

    if (!existingViewing) {
      throw new AppError("NOT_FOUND", "Viewing not found.");
    }

    if (
      NON_EDITABLE_STATUSES.includes(
        existingViewing.status as (typeof NON_EDITABLE_STATUSES)[number],
      )
    ) {
      throw new AppError(
        "CONFLICT",
        "Completed, cancelled, and no-show viewings cannot be edited.",
      );
    }

    const agentId = data.agentId ?? existingViewing.agentId.toString();
    const propertyId = data.propertyId ?? existingViewing.propertyId.toString();

    const customerId =
      data.customerId !== undefined
        ? data.customerId
        : existingViewing.customerId?.toString();

    const leadId =
      data.leadId !== undefined
        ? data.leadId
        : existingViewing.leadId?.toString();

    const scheduledAt = data.scheduledAt ?? existingViewing.scheduledAt;

    const durationMinutes =
      data.durationMinutes ?? existingViewing.durationMinutes;

    await validateAgent(agentId);
    await validateProperty(propertyId);
    await validateParticipant(customerId, leadId);

    assertSchedulableDate(scheduledAt);

    await assertNoAgentConflict(agentId, scheduledAt, durationMinutes, id);

    const updatedViewing = await viewingRepository.updateById(id, data);

    if (!updatedViewing) {
      throw new AppError("NOT_FOUND", "Viewing not found.");
    }

    return updatedViewing;
  },

  async updateStatus(id: string, input: UpdateViewingStatusInput) {
    assertValidObjectId(id, "viewing ID");

    const data = updateViewingStatusSchema.parse(input);

    const existingViewing = await viewingRepository.findById(id);

    if (!existingViewing) {
      throw new AppError("NOT_FOUND", "Viewing not found.");
    }

    if (existingViewing.status === data.status) {
      return existingViewing;
    }

    if (data.status === "cancelled" && !data.cancellationReason) {
      throw new AppError(
        "VALIDATION_ERROR",
        "A cancellation reason is required when cancelling a viewing.",
      );
    }

    const allowedTransitions: Record<
      (typeof VIEWING_STATUSES)[number],
      readonly (typeof VIEWING_STATUSES)[number][]
    > = {
      scheduled: ["confirmed", "cancelled", "no_show"],
      confirmed: ["completed", "cancelled", "no_show"],
      completed: [],
      cancelled: [],
      no_show: [],
    };

    const currentStatus =
      existingViewing.status as (typeof VIEWING_STATUSES)[number];

    if (!allowedTransitions[currentStatus].includes(data.status)) {
      throw new AppError(
        "CONFLICT",
        `Viewing cannot transition from "${existingViewing.status}" to "${data.status}".`,
      );
    }

    const updatedViewing = await viewingRepository.updateStatus(
      id,
      data.status,
      data.cancellationReason,
    );

    if (!updatedViewing) {
      throw new AppError("NOT_FOUND", "Viewing not found.");
    }

    return updatedViewing;
  },
};
