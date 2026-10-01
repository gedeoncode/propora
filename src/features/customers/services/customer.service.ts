
import "server-only";

import mongoose from "mongoose";

import { agentRepository } from "@/features/agents/repositories/agent.repository";
import { customerRepository } from "@/features/customers/repositories/customer.repository";
import {
  assignCustomerSchema,
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
  type AssignCustomerInput,
  type CreateCustomerInput,
  type UpdateCustomerInput,
  type UpdateCustomerStatusInput,
} from "@/features/customers/schemas/customer.schema";
import { leadRepository } from "@/features/leads/repositories/lead.repository";
import { userRepository } from "@/features/users/repositories/user.repository";
import { AppError } from "@/lib/errors/app-error";

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

async function validateUser(userId: string) {
  assertValidObjectId(userId, "user ID");

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found.");
  }

  return user;
}

async function validateSourceLead(sourceLeadId: string) {
  assertValidObjectId(sourceLeadId, "source lead ID");

  const lead = await leadRepository.findById(sourceLeadId);

  if (!lead) {
    throw new AppError("NOT_FOUND", "Source lead not found.");
  }

  return lead;
}

async function ensureUserNotLinked(
  userId: string,
  currentCustomerId?: string,
) {
  const existingCustomer =
    await customerRepository.findByUserId(userId);

  if (
    existingCustomer &&
    existingCustomer._id.toString() !== currentCustomerId
  ) {
    throw new AppError(
      "CONFLICT",
      "This user is already linked to another customer.",
    );
  }
}

async function ensureSourceLeadNotConverted(
  sourceLeadId: string,
  currentCustomerId?: string,
) {
  const existingCustomer =
    await customerRepository.findBySourceLeadId(sourceLeadId);

  if (
    existingCustomer &&
    existingCustomer._id.toString() !== currentCustomerId
  ) {
    throw new AppError(
      "CONFLICT",
      "A customer already exists for this lead.",
    );
  }
}

/**
 * Converts a populated customer document into a consistent display object.
 * Personal details come from User for registered customers, or contact
 * for CRM-only customers. They are not duplicated in MongoDB.
 */
function toCustomerView(customer: {
  toObject: () => Record<string, any>;
}) {
  const record = customer.toObject();

  const linkedUser =
    record.userId &&
    typeof record.userId === "object" &&
    "_id" in record.userId
      ? record.userId
      : null;

  const assignedAgent =
    record.assignedAgentId &&
    typeof record.assignedAgentId === "object" &&
    "_id" in record.assignedAgentId
      ? record.assignedAgentId
      : null;

  const sourceLead =
    record.sourceLeadId &&
    typeof record.sourceLeadId === "object" &&
    "_id" in record.sourceLeadId
      ? record.sourceLeadId
      : null;

  const agentUser =
    assignedAgent?.userId &&
    typeof assignedAgent.userId === "object" &&
    "_id" in assignedAgent.userId
      ? assignedAgent.userId
      : null;

  const contact = record.contact ?? null;
  const person = linkedUser ?? contact;

  return {
    ...record,

    userId: linkedUser?._id ?? record.userId ?? null,

    user: linkedUser
      ? {
          _id: linkedUser._id,
          firstName: linkedUser.firstName,
          lastName: linkedUser.lastName,
          email: linkedUser.email,
          phone: linkedUser.phone ?? null,
        }
      : null,

    assignedAgentId: assignedAgent?._id ?? record.assignedAgentId ?? null,

    assignedAgent: assignedAgent
      ? {
          _id: assignedAgent._id,
          userId: agentUser?._id ?? assignedAgent.userId ?? null,
          firstName: agentUser?.firstName ?? "",
          lastName: agentUser?.lastName ?? "",
          email: agentUser?.email ?? null,
          phone: agentUser?.phone ?? null,
          status: assignedAgent.status,
        }
      : null,

    sourceLeadId: sourceLead?._id ?? record.sourceLeadId ?? null,

    sourceLead: sourceLead
      ? {
          _id: sourceLead._id,
          firstName: sourceLead.firstName ?? "",
          lastName: sourceLead.lastName ?? "",
          email: sourceLead.email ?? null,
          phone: sourceLead.phone ?? null,
          status: sourceLead.status,
          source: sourceLead.source,
        }
      : null,

    firstName: person?.firstName ?? "",
    lastName: person?.lastName ?? "",
    email: person?.email ?? null,
    phone: person?.phone ?? null,
  };
}

export const customerService = {
  async getById(id: string) {
    assertValidObjectId(id, "customer ID");

    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return toCustomerView(customer);
  },

  async list(filters = {}) {
    const customers = await customerRepository.list(filters);

    return customers.map(toCustomerView);
  },

  async create(input: CreateCustomerInput) {
    const data = createCustomerSchema.parse(input);

    if (data.userId) {
      await validateUser(data.userId);
      await ensureUserNotLinked(data.userId);
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.sourceLeadId) {
      await validateSourceLead(data.sourceLeadId);
      await ensureSourceLeadNotConverted(data.sourceLeadId);
    }

    const customer = await customerRepository.create(data);

    if (!customer) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create customer.",
      );
    }

    return toCustomerView(customer);
  },

  async update(id: string, input: UpdateCustomerInput) {
    assertValidObjectId(id, "customer ID");

    const data = updateCustomerSchema.parse(input);

    const existingCustomer =
      await customerRepository.findById(id);

    if (!existingCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    // A relationship change must leave exactly one contact source.
    if (
      data.userId === null &&
      data.contact === undefined
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Provide CRM contact details when unlinking a user.",
      );
    }

    if (
      data.contact === null &&
      data.userId === undefined
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Provide a userId when removing CRM contact details.",
      );
    }

    if (data.userId) {
      await validateUser(data.userId);
      await ensureUserNotLinked(data.userId, id);
    }

    if (data.assignedAgentId) {
      await validateAgent(data.assignedAgentId);
    }

    if (data.sourceLeadId) {
      await validateSourceLead(data.sourceLeadId);
      await ensureSourceLeadNotConverted(data.sourceLeadId, id);
    }

    const updatedCustomer =
      await customerRepository.updateById(id, data);

    if (!updatedCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return toCustomerView(updatedCustomer);
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
      return toCustomerView(existingCustomer);
    }

    const updatedCustomer =
      await customerRepository.updateStatus(id, data.status);

    if (!updatedCustomer) {
      throw new AppError("NOT_FOUND", "Customer not found.");
    }

    return toCustomerView(updatedCustomer);
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

    return toCustomerView(updatedCustomer);
  },
};