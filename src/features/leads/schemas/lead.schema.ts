import { z } from "zod";

import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "@/features/leads/types/lead";

const optionalTrimmedString = (max: number) =>
  z.string().trim().max(max).optional();

export const createLeadSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254).optional(),
  phone: optionalTrimmedString(30),

  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES).default("new"),

  assignedAgentId: z.string().min(1).optional(),

  interestedPropertyIds: z
    .array(z.string().min(1))
    .max(50)
    .default([]),

  notes: optionalTrimmedString(5000),
});

export const updateLeadSchema = createLeadSchema
  .omit({ status: true })
  .partial();

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export const assignLeadSchema = z.object({
  assignedAgentId: z.string().min(1).nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<
  typeof updateLeadStatusSchema
>;
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;