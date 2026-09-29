import "server-only";

import {
  createAgentSchema,
  createAgentWithUserSchema,
  updateAgentSchema,
  updateAgentStatusSchema,
  type CreateAgentInput,
  type CreateAgentWithUserInput,
  type UpdateAgentInput,
  type UpdateAgentStatusInput,
} from "@/features/agents/schemas/agent.schema";
import { agentRepository } from "@/features/agents/repositories/agent.repository";
import { userRepository } from "@/features/users/repositories/user.repository";
import { registerUserSchema } from "@/features/users/schemas/user.schema";
import { hashPassword } from "@/lib/auth/password";
import { withTransaction } from "@/lib/db/mongoose";
import { AppError } from "@/lib/errors/app-error";

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

  async createWithUser(input: CreateAgentWithUserInput) {
    const data = createAgentWithUserSchema.parse(input);

    const userData = registerUserSchema.parse({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: "agent",
    });

    const existingUser =
      await userRepository.existsByEmail(userData.email);

    if (existingUser) {
      throw new AppError(
        "CONFLICT",
        "An account with this email already exists.",
      );
    }

    const passwordHash = await hashPassword(
      userData.password,
    );

    return withTransaction(async (session) => {
      const user = await userRepository.create(
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: "agent",
          passwordHash,
        },
        session,
      );

      const agentData = createAgentSchema.parse({
        userId: user._id.toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        bio: data.bio,
        profileImageUrl: data.profileImageUrl,
        licenseNumber: data.licenseNumber,
        specializations: data.specializations,
        status: "active",
      });

      const agent = await agentRepository.create(
        agentData,
        session,
      );

      return {
        user,
        agent,
      };
    });
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