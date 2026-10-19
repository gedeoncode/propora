import { NextResponse } from "next/server";


import { logger } from "@/lib/logger";
import { withDatabase } from "@/lib/db/with-db";
import Viewing from "@/features/viewings/models/viewing.model";

export const runtime = "nodejs";

export async function DELETE() {
  try {
    // Safety guard: prevent accidental deletion in production.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          success: false,
          message: "This operation is disabled in production.",
        },
        { status: 403 },
      );
    }

    const result = await withDatabase(async () => {
      return Viewing.deleteMany({});
    });

    logger.info(`Deleted ${result.deletedCount} viewings`);

    return NextResponse.json({
      success: true,
      message: "All viewings have been deleted successfully.",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    logger.error(`Failed to delete all viewings, error: ${error}`);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete viewings.",
      },
      { status: 500 },
    );
  }
}