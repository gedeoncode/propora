import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
});

const parsedEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsedEnv.success) {
  console.error(
    "Invalid client environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid client environment configuration.");
}

export const clientEnv = parsedEnv.data;