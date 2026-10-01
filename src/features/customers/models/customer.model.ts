
import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";

const CustomerContactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const CustomerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    contact: {
      type: CustomerContactSchema,
      default: undefined,
    },

    customerType: {
      type: String,
      required: true,
      enum: CUSTOMER_TYPES,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: CUSTOMER_STATUSES,
      default: "active",
      index: true,
    },

    assignedAgentId: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
      index: true,
    },

    sourceLeadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Each registered user can be linked to at most one customer.
// Sparse indexing allows multiple documents without a userId.
CustomerSchema.index(
  { userId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

CustomerSchema.index({
  status: 1,
  assignedAgentId: 1,
  createdAt: -1,
});

CustomerSchema.index({
  "contact.email": 1,
  "contact.phone": 1,
});

const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);

export default Customer;