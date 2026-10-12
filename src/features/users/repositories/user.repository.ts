import "server-only";

import type { ClientSession } from "mongoose";

import User from "@/features/users/models/user.model";
import type {
  RegisterUserInput,
  UpdateUserInput,
} from "@/features/users/schemas/user.schema";
import type { UserRole, UserStatus } from "@/features/users/types/user";
import { withDatabase } from "@/lib/db/with-db";

export type UserListFilters = {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
};

export const userRepository = {

  async findById(id: string) {
    return withDatabase(() => User.findById(id).exec());
  },

  async findByEmail(email: string) {
    return withDatabase(() => User.findOne({
      email: email.toLowerCase(),
    }).exec());
  },

  async findByEmailWithPassword(email: string) {
    return withDatabase(() => User.findOne({
      email: email.toLowerCase(),
    })
      .select("+passwordHash")
      .exec());
  },

  async list(filters: UserListFilters = {}) {
    return withDatabase(async () => {
    const query: Record<string, unknown> = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const search = filters.search.trim();

      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
    }

    return User.find(query)
      .sort({ createdAt: -1 })
      .exec();
  })
  },

  async create(
    input: Omit<RegisterUserInput, "password"> & {
      passwordHash: string;
    },
    session?: ClientSession,
  ) {
    return withDatabase(async () => {
    if (session) {
      const [user] = await User.create([input], { session });
      return user;
    }

    return User.create(input);
  })
  },

  async updateById(id: string, input: UpdateUserInput) {
    return withDatabase(() => 
      User.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      }).exec());
  },

  async updateRole(id: string, role: UserRole) {
    return withDatabase(() =>
      User.findByIdAndUpdate(
        id,
        { role },
        {
          new: true,
          runValidators: true,
        },
    ).exec());
  },

  async updateStatus(id: string, status: UserStatus) {
    return withDatabase(() =>
      User.findByIdAndUpdate(
        id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).exec());
  },

  async updateLastLogin(id: string) {
    return withDatabase(() =>
      User.findByIdAndUpdate(
        id,
      { lastLoginAt: new Date() },
      {
        new: true,
        runValidators: true,
      },
    ).exec());
  },

  async existsByEmail(email: string) {
    return withDatabase(() =>
      User.exists({
        email: email.toLowerCase(),
      })
    );
  },
};