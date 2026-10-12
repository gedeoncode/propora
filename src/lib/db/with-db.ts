
import "server-only";

import { connectToDatabase } from "./mongoose";

export async function withDatabase<T>(
  operation: () => Promise<T>,
): Promise<T> {
  await connectToDatabase();
  return operation();
}
