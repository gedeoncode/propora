import "server-only";

import mongoose from "mongoose";

import {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  type LoginInput,
  type RegisterUserInput,
  type UpdateUserInput,
  type UpdateUserRoleInput,
  type UpdateUserStatusInput,
} from "@/features/users/schemas/user.schema";
import { userRepository } from "@/features/users/repositories/user.repository";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";

function assertValidObjectId(
  id: string,
  fieldName: string,
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Invalid ${fieldName}.`,
    );
  }
}

export const userService = {
  async getById(id: string) {
    assertValidObjectId(id, "user ID");

    const user = await userRepository.findById(id);
    // logger.info(`Retrieved user by ID: ${id}`, {
    //   userId: id,
    //   userExists: !!user,
    // });

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    return user;
  },

  async list(filters = {}) {
    return userRepository.list(filters);
  },

  async register(input: RegisterUserInput) {
    const data = registerUserSchema.parse(input);

    const existingUser =
      await userRepository.existsByEmail(data.email);

    if (existingUser) {
      throw new AppError(
        "CONFLICT",
        "An account with this email already exists.",
      );
    }

    const passwordHash = await hashPassword(data.password);

    return userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: "staff",
      passwordHash,
    });
  },

  async verifyCredentials(input: LoginInput) {
    const data = loginSchema.parse(input);

    const user =
      await userRepository.findByEmailWithPassword(
        data.email,
      );

    /*
     * Deliberately use the same public error for:
     * - unknown email
     * - incorrect password
     *
     * This prevents the login endpoint from revealing whether
     * an email address belongs to a Propora account.
     */
    if (!user) {
      throw new AppError(
        "UNAUTHENTICATED",
        "Invalid email or password.",
      );
    }

    const passwordIsValid = await verifyPassword(
      data.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new AppError(
        "UNAUTHENTICATED",
        "Invalid email or password.",
      );
    }

    if (user.status !== "active") {
      throw new AppError(
        "FORBIDDEN",
        "This account is not active.",
      );
    }

    await userRepository.updateLastLogin(
      user._id.toString(),
    );

    return user;
  },

  async update(
    id: string,
    input: UpdateUserInput,
  ) {
    assertValidObjectId(id, "user ID");

    const data = updateUserSchema.parse(input);

    const existingUser =
      await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    if (
      data.email &&
      data.email !== existingUser.email
    ) {
      const emailExists =
        await userRepository.existsByEmail(data.email);

      if (emailExists) {
        throw new AppError(
          "CONFLICT",
          "An account with this email already exists.",
        );
      }
    }

    const updatedUser =
      await userRepository.updateById(id, data);

    if (!updatedUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    return updatedUser;
  },

  async updateRole(
    id: string,
    input: UpdateUserRoleInput,
  ) {
    assertValidObjectId(id, "user ID");

    const data = updateUserRoleSchema.parse(input);

    const existingUser =
      await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    const updatedUser =
      await userRepository.updateRole(
        id,
        data.role,
      );

    if (!updatedUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    return updatedUser;
  },

  async updateStatus(
    id: string,
    input: UpdateUserStatusInput,
  ) {
    assertValidObjectId(id, "user ID");

    const data = updateUserStatusSchema.parse(input);

    const existingUser =
      await userRepository.findById(id);

    if (!existingUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    const updatedUser =
      await userRepository.updateStatus(
        id,
        data.status,
      );

    if (!updatedUser) {
      throw new AppError("NOT_FOUND", "User not found.");
    }

    return updatedUser;
  },
};