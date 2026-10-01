
import type { Types } from "mongoose";

export const CUSTOMER_STATUSES = [
  "active",
  "inactive",
  "blocked",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_TYPES = [
  "buyer",
  "tenant",
  "investor",
  "seller",
  "landlord",
  "other",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export type CustomerContact = {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
};

export type CustomerRecord = {
  _id: Types.ObjectId;

  userId?: Types.ObjectId | null;
  contact?: CustomerContact | null;

  customerType: CustomerType;
  status: CustomerStatus;

  assignedAgentId?: Types.ObjectId | null;
  sourceLeadId?: Types.ObjectId | null;

  notes?: string | null;

  createdAt: Date;
  updatedAt: Date;
};