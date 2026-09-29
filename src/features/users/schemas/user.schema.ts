import { z } from "zod";

import { USER_ROLES, USER_STATUSES } from "@/features/users/types/user";

const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

const nameSchema = z.string().trim().min(1).max(80);

const passwordSchema = z.string().min(8).max(128);

export const registerUserSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: z.string().trim().max(30).optional(),
  password: passwordSchema,
  role: z.enum(USER_ROLES).default("staff"),
});

export const updateUserSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: z.string().trim().max(30).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(USER_STATUSES),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
