
import type { MetadataRoute } from "next";

import { connectToDatabase } from "@/lib/db/mongoose";
import { propertyService } from "@/features/properties/services/property.service";

import { clientEnv } from "@/config/env.client";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${clientEnv.NEXT_PUBLIC_APP_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${clientEnv.NEXT_PUBLIC_APP_URL}/discover`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    await connectToDatabase();

    const firstPage = await propertyService.listPublic({}, {
      page: 1,
      limit: 100,
    });

    const properties = [...firstPage.items];

    for (
      let page = 2;
      page <= firstPage.pagination.totalPages;
      page += 1
    ) {
      const result = await propertyService.listPublic({}, {
        page,
        limit: 100,
      });

      properties.push(...result.items);
    }

    const propertyRoutes: MetadataRoute.Sitemap = properties.map(
      (property) => ({
        url: `${clientEnv.NEXT_PUBLIC_APP_URL}/discover/${encodeURIComponent(property.slug)}`,
        lastModified: property.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    );

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    // Still expose the static public routes if the database is unavailable.
    return staticRoutes;
  }
}