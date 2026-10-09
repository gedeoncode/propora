
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { leadService } from "@/features/leads/services/lead.service";
import { propertyService } from "@/features/properties/services/property.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AppError } from "@/lib/errors/app-error";
import { apiErrorResponse } from "@/lib/errors/api-error";

const inquirySchema = z
  .object({
    slug: z.string().trim().min(1).max(180),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.union([
      z.string().trim().email().max(254),
      z.literal(""),
    ]),
    phone: z.string().trim().max(30),
    message: z.string().trim().max(2000),
    website: z.string().max(200),
  })
  .refine((data) => data.email.length > 0 || data.phone.length > 0, {
    message: "Provide an email address or phone number.",
    path: ["email"],
  });

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > 10_000) {
      throw new AppError("VALIDATION_ERROR", "Request is too large.");
    }

    const body: unknown = await request.json();
    const input = inquirySchema.parse(body);

    // Honeypot field: silently accept bot submissions without storing them.
    if (input.website) {
      return NextResponse.json({ success: true });
    }

    await connectToDatabase();

    const property = await propertyService.getBySlug(input.slug);

    if (property.publicationStatus !== "published") {
      throw new AppError("NOT_FOUND", "Property not found.");
    }

    if (
      ["sold", "rented", "withdrawn"].includes(
        property.availabilityStatus,
      )
    ) {
      throw new AppError(
        "CONFLICT",
        "This property is no longer available for inquiries.",
      );
    }

    await leadService.create({
      firstName: input.firstName ,
      lastName: input.lastName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      source: "website",
      interestedPropertyIds: [property._id.toString()],
      notes: input.message || undefined,
    });

    return NextResponse.json(
      { success: true },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}