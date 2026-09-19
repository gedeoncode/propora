import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const connected = mongoose.connection.readyState === 1;

    if (!connected) {
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
  } catch {
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