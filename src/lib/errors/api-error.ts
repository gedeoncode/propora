import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";

type ErrorResponseOptions = {
  requestId?: string;
};

export function apiErrorResponse(
  error: unknown,
  options: ErrorResponseOptions = {},
) {
  const requestId = options.requestId;

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error("Operational application error", {
        code: error.code,
        statusCode: error.statusCode,
        requestId,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message:
            error.statusCode >= 500
              ? "An unexpected error occurred."
              : error.message,
          ...(requestId ? { requestId } : {}),
        },
      },
      { status: error.statusCode },
    );
  }

  logger.error("Unhandled API error", {
    requestId,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : String(error),
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
        ...(requestId ? { requestId } : {}),
      },
    },
    { status: 500 },
  );
}