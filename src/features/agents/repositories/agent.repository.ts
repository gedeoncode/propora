import "server-only";

import Agent from "@/features/agents/models/agent.model";
import type {
  CreateAgentInput,
  UpdateAgentInput,
} from "@/features/agents/schemas/agent.schema";

export const agentRepository = {
  async findById(id: string) {
    return Agent.findById(id).exec();
  },

  async findByUserId(userId: string) {
    return Agent.findOne({ userId }).exec();
  },

  async list(status?: "active" | "inactive" | "suspended") {
    const query = status ? { status } : {};

    return Agent.find(query)
      .sort({ createdAt: -1 })
      .exec();
  },

  async create(input: CreateAgentInput) {
    return Agent.create(input);
  },

  async updateById(id: string, input: UpdateAgentInput) {
    return Agent.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).exec();
  },

  async updateStatus(
    id: string,
    status: "active" | "inactive" | "suspended",
  ) {
    return Agent.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },
};