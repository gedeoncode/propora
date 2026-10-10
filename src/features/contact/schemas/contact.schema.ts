
import { z } from "zod";

export const contactSubmissionSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(100),
  lastName: z.string().trim().min(1, "Enter your last name.").max(100),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254),
  phone: z.string().trim().max(30, "Phone number is too long.").optional(),
  subject: z
    .string()
    .trim()
    .min(1, "Choose a subject.")
    .max(150, "Subject must be 150 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(3000, "Message must be 3,000 characters or fewer."),
  website: z.string().max(200).optional(),
});

export type ContactSubmissionInput = z.infer<
  typeof contactSubmissionSchema
>;