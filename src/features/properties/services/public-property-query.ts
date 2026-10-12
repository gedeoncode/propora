import "server-only";
import { cache } from "react";
import { propertyService } from "./property.service";


export const getPropertyBySlug = cache(async (slug: string) => {
  return propertyService.getPublicBySlug(slug);
});