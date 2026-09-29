import "server-only";

import mongoose, { Schema } from "mongoose";

import { USER_ROLES, USER_STATUSES } from "@/features/users/types/user";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: USER_ROLES,
      default: "staff",
      index: true,
    },

    status: {
      type: String,
      required: true,
      enum: USER_STATUSES,
      default: "active",
      index: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserSchema.index({
  status: 1,
  role: 1,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
