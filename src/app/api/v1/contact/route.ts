
import { NextRequest, NextResponse } from "next/server";

import { contactSubmissionSchema } from "@/features/contact/schemas/contact.schema";
import { leadService } from "@/features/leads/services/lead.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AppError } from "@/lib/errors/app-error";
import { apiErrorResponse } from "@/lib/errors/api-error";

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") ?? 0,
    );

    if (contentLength > 15_000) {
      throw new AppError("VALIDATION_ERROR", "Request is too large.");
    }

    const body: unknown = await request.json();
    const input = contactSubmissionSchema.parse(body);

    // Silently accept honeypot submissions without storing them.
    if (input.website?.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    await connectToDatabase();

    const lead = await leadService.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || undefined,
      source: "website",
      notes: [
        `Contact subject: ${input.subject}`,
        "",
        input.message,
      ].join("\n"),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received.",
        data: {
          id: lead._id.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}