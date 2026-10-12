import "server-only";

import type { ClientSession } from "mongoose";

import Agent from "@/features/agents/models/agent.model";
import type {
  CreateAgentInput,
  UpdateAgentInput,
} from "@/features/agents/schemas/agent.schema";
import { withDatabase } from "@/lib/db/with-db";

export const agentRepository = {
  async findById(id: string) {
    return withDatabase(async () => {
      return Agent.findById(id)
        .populate("userId", "firstName lastName email")
        .exec();
    });
  },

  async findByUserId(userId: string) {
    return withDatabase(async () => {
      return Agent.findOne({ userId })
        .populate("userId", "firstName lastName email")
        .exec();
    });
  },

  async findIdByUserId(userId: string): Promise<string | null> {
    return withDatabase(async () => {
      const agent = await Agent.findOne({ userId }).select("_id").lean().exec();

      return agent ? agent._id.toString() : null;
    });
  },

  async list(status?: "active" | "inactive" | "suspended") {
    const query = status ? { status } : {};

    return withDatabase(async () => {
      return Agent.find(query)
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .exec();
    });
  },

  async create(input: CreateAgentInput, session?: ClientSession) {
    return withDatabase(async () => {
      if (session) {
        const [agent] = await Agent.create([input], { session });

      return agent;
    }

      return Agent.create(input);
    });
  },

  async updateById(id: string, input: UpdateAgentInput) {
    return withDatabase(async () => {
      return Agent.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      }).exec();
    });
  },

  async updateStatus(id: string, status: "active" | "inactive" | "suspended") {
    return withDatabase(async () => {
      return Agent.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        },
      ).exec();
    });
  },
};
