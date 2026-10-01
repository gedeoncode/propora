
import { z } from "zod";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId.");

const optionalTrimmedString = (max: number) =>
  z.string().trim().max(max).optional();

export const customerContactSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z
    .union([z.string().trim().email().max(254), z.literal("")])
    .optional(),
  phone: optionalTrimmedString(30),
});

export const createCustomerSchema = z
  .object({
    userId: objectIdSchema.optional(),
    contact: customerContactSchema.optional(),

    customerType: z.enum(CUSTOMER_TYPES),
    status: z.enum(CUSTOMER_STATUSES).default("active"),

    assignedAgentId: objectIdSchema.optional(),
    sourceLeadId: objectIdSchema.optional(),

    notes: optionalTrimmedString(5000),
  })
  .superRefine((data, ctx) => {
    const hasUser = Boolean(data.userId);
    const hasContact = Boolean(data.contact);

    if (hasUser === hasContact) {
      ctx.addIssue({
        code: "custom",
        path: ["userId"],
        message:
          "Provide either a registered user's userId or CRM contact details, but not both.",
      });
    }
  });

export const updateCustomerSchema = z
  .object({
    userId: objectIdSchema.nullable().optional(),
    contact: customerContactSchema.nullable().optional(),

    customerType: z.enum(CUSTOMER_TYPES).optional(),
    assignedAgentId: objectIdSchema.nullable().optional(),
    sourceLeadId: objectIdSchema.nullable().optional(),

    notes: optionalTrimmedString(5000).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.userId && data.contact) {
      ctx.addIssue({
        code: "custom",
        path: ["contact"],
        message:
          "A registered customer cannot also have CRM-only contact details.",
      });
    }
  });

export const updateCustomerStatusSchema = z.object({
  status: z.enum(CUSTOMER_STATUSES),
});

export const assignCustomerSchema = z.object({
  assignedAgentId: objectIdSchema.nullable(),
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