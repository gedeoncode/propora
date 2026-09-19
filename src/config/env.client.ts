import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const parsedEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedEnv.success) {
  console.error(
    "Invalid client environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid client environment configuration.");
}

export const clientEnv = parsedEnv.data;