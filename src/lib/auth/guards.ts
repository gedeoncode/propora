import "server-only";

import { auth } from "@/auth";
import { userService } from "@/features/users/services/user.service";
import { AppError } from "@/lib/errors/app-error";
import type {
  UserRole,
  UserStatus,
} from "@/features/users/types/user";

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
  status: UserStatus;
};

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AppError(
      "UNAUTHENTICATED",
      "Authentication is required.",
    );
  }

  const user = await userService.getById(
    session.user.id,
  );

  if (user.status !== "active") {
    throw new AppError(
      "FORBIDDEN",
      "Your account is not active.",
    );
  }

  return {
    id: user._id.toString(),
    role: user.role,
    status: user.status,
  };
}

export async function requireRole(
  allowedRoles: readonly UserRole[],
): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
    );
  }

  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole(["admin"]);
}

export async function requireManager(): Promise<AuthenticatedUser> {
  return requireRole(["admin", "manager"]);
}