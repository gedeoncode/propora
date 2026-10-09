import "server-only";
import { cache } from "react";
import { connectToDatabase } from "@/lib/db/mongoose";
import { propertyService } from "./property.service";


export const getPropertyBySlug = cache(async (slug: string) => {
  await connectToDatabase();
  return propertyService.getPublicBySlug(slug);
});