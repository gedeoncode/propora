import type { Types } from "mongoose";

export const VIEWING_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type ViewingStatus = (typeof VIEWING_STATUSES)[number];

export const VIEWING_TYPES = [
  "physical",
  "virtual",
] as const;

export type ViewingType = (typeof VIEWING_TYPES)[number];

export type ViewingRecord = {
  _id: Types.ObjectId;

  propertyId: Types.ObjectId;
  agentId: Types.ObjectId;

  customerId?: Types.ObjectId | null;
  leadId?: Types.ObjectId | null;

  type: ViewingType;
  status: ViewingStatus;

  scheduledAt: Date;
  durationMinutes: number;

  notes?: string | null;
  cancellationReason?: string | null;

  createdAt: Date;
  updatedAt: Date;
};