import { NextResponse } from "next/server";

import { userService } from "@/features/users/services/user.service";
import { requireAuth } from "@/lib/auth/guards";
import { apiErrorResponse } from "@/lib/errors/api-error";

export async function GET() {
  try {
    const authenticatedUser = await requireAuth();

    const user = await userService.getById(
      authenticatedUser.id,
    );

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}