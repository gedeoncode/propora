import type { Types } from "mongoose";

export const AGENT_STATUSES = [
  "active",
  "inactive",
  "suspended",
] as const;

export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const AGENT_SPECIALIZATIONS = [
  "residential",
  "commercial",
  "land",
  "property_management",
  "luxury",
  "new_development",
  "investment",
  "other",
] as const;

export type AgentSpecialization =
  (typeof AGENT_SPECIALIZATIONS)[number];

export type AgentRecord = {
  _id: Types.ObjectId;

  /**
   * Links the professional Agent profile to the application's
   * authentication/account identity.
   */
  userId: Types.ObjectId;

  firstName: string;
  lastName: string;

  phone?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  licenseNumber?: string | null;

  specializations: AgentSpecialization[];

  status: AgentStatus;

  createdAt: Date;
  updatedAt: Date;
};