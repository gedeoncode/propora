import "server-only";

import argon2 from "argon2";

/**
 * Hashes a plaintext password using Argon2id.
 *
 * Argon2 is intentionally computationally expensive so that
 * stolen password hashes are significantly harder to crack.
 */
export async function hashPassword(
  password: string,
): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

/**
 * Verifies a plaintext password against an Argon2 hash.
 *
 * Returns false for an invalid password rather than exposing
 * hashing implementation details to callers.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}