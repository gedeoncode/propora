import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  AGENT_SPECIALIZATIONS,
  AGENT_STATUSES,
} from "@/features/agents/types/agent";

const AgentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    profileImageUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: null,
    },

    licenseNumber: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    specializations: {
      type: [String],
      enum: AGENT_SPECIALIZATIONS,
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 20,
        message: "An agent can have at most 20 specializations.",
      },
    },

    status: {
      type: String,
      required: true,
      enum: AGENT_STATUSES,
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

AgentSchema.index({
  status: 1,
  createdAt: -1,
});

const Agent =
  mongoose.models.Agent ||
  mongoose.model("Agent", AgentSchema);

export default Agent;