import "server-only";

import mongoose, { Schema } from "mongoose";

import {
  VIEWING_STATUSES,
  VIEWING_TYPES,
} from "@/features/viewings/types/viewing";

const ViewingSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    agentId: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },

    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: VIEWING_TYPES,
      default: "physical",
    },

    status: {
      type: String,
      required: true,
      enum: VIEWING_STATUSES,
      default: "scheduled",
      index: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 480,
      default: 60,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ViewingSchema.index({
  agentId: 1,
  scheduledAt: 1,
});

ViewingSchema.index({
  propertyId: 1,
  scheduledAt: 1,
});

ViewingSchema.index({
  customerId: 1,
  scheduledAt: 1,
});

ViewingSchema.index({
  leadId: 1,
  scheduledAt: 1,
});

ViewingSchema.index({
  status: 1,
  scheduledAt: 1,
});

const Viewing =
  mongoose.models.Viewing ||
  mongoose.model("Viewing", ViewingSchema);

export default Viewing;