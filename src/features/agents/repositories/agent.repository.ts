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
    const matchStage = status ? { status } : {};

    return withDatabase(async () => {
      return Agent.aggregate([
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.role": { $ne: "admin" },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            bio: 1,
            profileImageUrl: 1,
            licenseNumber: 1,
            specializations: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: {
              _id: "$user._id",
              firstName: "$user.firstName",
              lastName: "$user.lastName",
              email: "$user.email",
            },
          },
        },
      ]).exec();
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
