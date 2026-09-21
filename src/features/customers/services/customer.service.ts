import "server-only";

import mongoose from "mongoose";

import { agentRepository } from "@/features/agents/repositories/agent.repository";
import {
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
  assignCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
  type UpdateCustomerStatusInput,
  type AssignCustomerInput,
} from "@/features/customers/schemas/customer.schema";

import { customerRepository } from "@/features/customers/repositories/customer.repository";
import { AppError } from "@/lib/errors/app-error";
import { leadRepository } from "@/features/leads/repositories/lead.repository";

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
      "Only active agents can be assigned to customers.",
    );
  }

  return agent;
}

async function validateSourceLead(sourceLeadId: string) {
  assertValidObjectId(sourceLeadId, "source lead ID");

  const lead = await leadRepository.findById(sourceLeadId);

  if (!lead) {
    throw new AppError("NOT_FOUND", "Source lead not found.");
  }

  return lead;
}

export const customerService = {
  async getById(id: string) {
    assertValidObjectId(id, "customer ID");

    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return customer;
  },

  async list(filters = {}) {
    return customerRepository.list(filters);
  },

  async create(input: CreateCustomerInput) {
    const data = createCustomerSchema.parse(input);

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.sourceLeadId) {
      await validateSourceLead(data.sourceLeadId);

      const existingCustomer =
        await customerRepository.findBySourceLeadId(
          data.sourceLeadId,
        );

      if (existingCustomer) {
        throw new AppError(
          "CONFLICT",
          "A customer already exists for this lead.",
        );
      }
    }

    return customerRepository.create(data);
  },

  async update(id: string, input: UpdateCustomerInput) {
    assertValidObjectId(id, "customer ID");

    const data = updateCustomerSchema.parse(input);

    const existingCustomer =
      await customerRepository.findById(id);

    if (!existingCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.sourceLeadId) {
      await validateSourceLead(data.sourceLeadId);

      const existingCustomerForLead =
        await customerRepository.findBySourceLeadId(
          data.sourceLeadId,
        );

      if (
        existingCustomerForLead &&
        existingCustomerForLead._id.toString() !== id
      ) {
        throw new AppError(
          "CONFLICT",
          "A customer already exists for this lead.",
        );
      }
    }

    const updatedCustomer =
      await customerRepository.updateById(id, data);

    if (!updatedCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return updatedCustomer;
  },

  async updateStatus(
    id: string,
    input: UpdateCustomerStatusInput,
  ) {
    assertValidObjectId(id, "customer ID");

    const data = updateCustomerStatusSchema.parse(input);

    const existingCustomer =
      await customerRepository.findById(id);

    if (!existingCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    if (existingCustomer.status === data.status) {
      return existingCustomer;
    }

    const updatedCustomer =
      await customerRepository.updateStatus(
        id,
        data.status,
      );

    if (!updatedCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return updatedCustomer;
  },

  async assignAgent(
    id: string,
    input: AssignCustomerInput,
  ) {
    assertValidObjectId(id, "customer ID");

    const data = assignCustomerSchema.parse(input);

    const existingCustomer =
      await customerRepository.findById(id);

    if (!existingCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    const updatedCustomer =
      await customerRepository.assignAgent(
        id,
        data.assignedAgentId,
      );

    if (!updatedCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return updatedCustomer;
  },
};