import type { Types } from "mongoose";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "viewing_scheduled",
  "negotiating",
  "converted",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "website",
  "referral",
  "social_media",
  "property_portal",
  "walk_in",
  "phone",
  "email",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export type LeadRecord = {
  _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;

  source: LeadSource;
  status: LeadStatus;

  assignedAgentId?: Types.ObjectId | null;

  interestedPropertyIds: Types.ObjectId[];

  notes?: string | null;

  createdAt: Date;
  updatedAt: Date;
};