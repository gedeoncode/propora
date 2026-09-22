import { NextResponse } from "next/server";

import { registerUserSchema } from "@/features/users/schemas/user.schema";
import { userService } from "@/features/users/services/user.service";
import { apiErrorResponse } from "@/lib/errors/api-error";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const input = registerUserSchema.parse(body);

    const user = await userService.register(input);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}