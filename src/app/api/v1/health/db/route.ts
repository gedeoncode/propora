
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const connected = mongoose.connection.readyState === 1;

    if (!connected) {
      logger.error(
        `Database is disconnected: ${mongoose.connection.readyState}`,
      );

      return NextResponse.json(
        {
          success: false,
          data: {
            database: "disconnected",
          },
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        database: "connected",
      },
    });
  } catch (error) {
    logger.error(
      `Database health check failed: ${error instanceof Error ? error.message : String(error)}`,
    );

    return NextResponse.json(
      {
        success: false,
        data: {
          database: "unavailable",
        },
      },
      { status: 503 },
    );
  }
}
