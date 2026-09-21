import { z } from "zod";

import {
  VIEWING_STATUSES,
  VIEWING_TYPES,
} from "@/features/viewings/types/viewing";

const optionalTrimmedString = (max: number) =>
  z.string().trim().max(max).optional();

export const createViewingSchema = z.object({
  propertyId: z.string().min(1),
  agentId: z.string().min(1),

  customerId: z.string().min(1).optional(),
  leadId: z.string().min(1).optional(),

  type: z.enum(VIEWING_TYPES),
  status: z.enum(VIEWING_STATUSES).default("scheduled"),

  scheduledAt: z.coerce.date(),
  durationMinutes: z
    .number()
    .int()
    .min(15)
    .max(480)
    .default(60),

  notes: optionalTrimmedString(5000),
  cancellationReason: optionalTrimmedString(1000),
});

export const updateViewingSchema = createViewingSchema
  .omit({
    status: true,
  })
  .partial();

export const updateViewingStatusSchema = z.object({
  status: z.enum(VIEWING_STATUSES),
  cancellationReason: optionalTrimmedString(1000),
});

export type CreateViewingInput = z.infer<
  typeof createViewingSchema
>;

export type UpdateViewingInput = z.infer<
  typeof updateViewingSchema
>;

export type UpdateViewingStatusInput = z.infer<
  typeof updateViewingStatusSchema
>;