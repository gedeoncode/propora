import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from "@/features/leads/types/lead";

const LeadSchema = new Schema(
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

    source: {
      type: String,
      required: true,
      enum: LEAD_SOURCES,
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: LEAD_STATUSES,
      default: "new",
      index: true,
    },

    assignedAgentId: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
      index: true,
    },

    interestedPropertyIds: {
      type: [Schema.Types.ObjectId],
      ref: "Property",
      default: [],
      validate: {
        validator: (items: mongoose.Types.ObjectId[]) =>
          items.length <= 50,
        message: "A lead can have at most 50 interested properties.",
      },
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

LeadSchema.index({
  status: 1,
  assignedAgentId: 1,
  createdAt: -1,
});

LeadSchema.index({
  email: 1,
  phone: 1,
});

LeadSchema.index({
  interestedPropertyIds: 1,
});

const Lead =
  mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);

export default Lead;