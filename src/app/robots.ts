
import { clientEnv } from "@/config/env.client";
import type { MetadataRoute } from "next";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/discover"],
      disallow: [
        "/api/",
        "/dashboard/",
        "/login",
        "/register",
      ],
    },
    sitemap: `${clientEnv.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}