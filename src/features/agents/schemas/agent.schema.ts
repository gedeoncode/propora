import { z } from "zod";

import {
  AGENT_SPECIALIZATIONS,
  AGENT_STATUSES,
} from "@/features/agents/types/agent";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional();

export const createAgentSchema = z.object({
  userId: z.string().min(1),

  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  phone: optionalTrimmedString(30),

  bio: optionalTrimmedString(2000),

  profileImageUrl: z
    .string()
    .url()
    .optional(),

  licenseNumber: optionalTrimmedString(100),

  specializations: z
    .array(z.enum(AGENT_SPECIALIZATIONS))
    .max(20)
    .default([]),

  status: z
    .enum(AGENT_STATUSES)
    .default("active"),
});

export const updateAgentSchema = createAgentSchema
  .omit({
    userId: true,
  })
  .partial();

export const updateAgentStatusSchema = z.object({
  status: z.enum(AGENT_STATUSES),
});

export type CreateAgentInput = z.infer<
  typeof createAgentSchema
>;

export type UpdateAgentInput = z.infer<
  typeof updateAgentSchema
>;

export type UpdateAgentStatusInput = z.infer<
  typeof updateAgentStatusSchema
>;