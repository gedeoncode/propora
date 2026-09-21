import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";

const CustomerSchema = new Schema(
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

CustomerSchema.index({
  status: 1,
  assignedAgentId: 1,
  createdAt: -1,
});

CustomerSchema.index({
  email: 1,
  phone: 1,
});

const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);

export default Customer;