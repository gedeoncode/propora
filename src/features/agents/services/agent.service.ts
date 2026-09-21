import "server-only";

import { AppError } from "@/lib/errors/app-error";

import {
  createAgentSchema,
  updateAgentSchema,
  updateAgentStatusSchema,
  type CreateAgentInput,
  type UpdateAgentInput,
  type UpdateAgentStatusInput,
} from "@/features/agents/schemas/agent.schema";

import { agentRepository } from "@/features/agents/repositories/agent.repository";

export const agentService = {
  async getById(id: string) {
    const agent = await agentRepository.findById(id);

    if (!agent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent not found.",
      );
    }

    return agent;
  },

  async getByUserId(userId: string) {
    const agent = await agentRepository.findByUserId(userId);

    if (!agent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent profile not found.",
      );
    }

    return agent;
  },

  async list(status?: CreateAgentInput["status"]) {
    return agentRepository.list(status);
  },

  async create(input: CreateAgentInput) {
    const data = createAgentSchema.parse(input);

    const existingAgent =
      await agentRepository.findByUserId(data.userId);

    if (existingAgent) {
      throw new AppError(
        "CONFLICT",
        "An agent profile already exists for this user.",
      );
    }

    return agentRepository.create(data);
  },

  async update(
    id: string,
    input: UpdateAgentInput,
  ) {
    const data = updateAgentSchema.parse(input);

    const existingAgent =
      await agentRepository.findById(id);

    if (!existingAgent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent not found.",
      );
    }

    const updatedAgent =
      await agentRepository.updateById(id, data);

    if (!updatedAgent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent not found.",
      );
    }

    return updatedAgent;
  },

  async updateStatus(
    id: string,
    input: UpdateAgentStatusInput,
  ) {
    const data = updateAgentStatusSchema.parse(input);

    const existingAgent =
      await agentRepository.findById(id);

    if (!existingAgent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent not found.",
      );
    }

    if (existingAgent.status === data.status) {
      return existingAgent;
    }

    const updatedAgent =
      await agentRepository.updateStatus(
        id,
        data.status,
      );

    if (!updatedAgent) {
      throw new AppError(
        "NOT_FOUND",
        "Agent not found.",
      );
    }

    return updatedAgent;
  },
};