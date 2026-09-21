import { z } from "zod";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";

const optionalTrimmedString = (max: number) =>
  z.string().trim().max(max).optional();

export const createCustomerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254).optional(),
  phone: optionalTrimmedString(30),

  customerType: z.enum(CUSTOMER_TYPES),
  status: z.enum(CUSTOMER_STATUSES).default("active"),

  assignedAgentId: z.string().min(1).optional(),
  sourceLeadId: z.string().min(1).optional(),

  notes: optionalTrimmedString(5000),
});

export const updateCustomerSchema = createCustomerSchema
  .omit({ status: true })
  .partial();

export const updateCustomerStatusSchema = z.object({
  status: z.enum(CUSTOMER_STATUSES),
});

export const assignCustomerSchema = z.object({
  assignedAgentId: z.string().min(1).nullable(),
});

export type CreateCustomerInput = z.infer<
  typeof createCustomerSchema
>;

export type UpdateCustomerInput = z.infer<
  typeof updateCustomerSchema
>;

export type UpdateCustomerStatusInput = z.infer<
  typeof updateCustomerStatusSchema
>;

export type AssignCustomerInput = z.infer<
  typeof assignCustomerSchema
>;