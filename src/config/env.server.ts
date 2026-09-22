import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({

  MONGODB_URI: z.string(),

  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url().optional(),

  REDIS_URL: z.string().optional(),

  MEDIA_STORAGE_URL: z.string().optional(),
  MEDIA_STORAGE_KEY: z.string().optional(),

  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid server environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid server environment configuration.");
}

export const serverEnv = parsedEnv.data;