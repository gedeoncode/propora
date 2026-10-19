import type { Types } from "mongoose";

export const USER_ROLES = [
  "admin",
  "manager",
  "agent",
  "staff",
  "tester",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "suspended",
  "deactivated",
  "pending",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export type UserRecord = {
  _id: Types.ObjectId;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string | null;

  passwordHash: string;

  role: UserRole;
  status: UserStatus;

  lastLoginAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};