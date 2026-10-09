import type { Metadata } from "next";
import { getPropertyBySlug } from "@/features/properties/services/public-property-query";
import { PropertyDetailPageProps } from "@/features/properties/types/public-page-props";
import { clientEnv } from "@/config/env.client";

export async function getPropertyMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    const property = await getPropertyBySlug(slug);

    if (!property) {
      return {
        title: "Property Not Found",
        robots: { index: false, follow: false },
      };
    }

    const location = [
      property.location.city,
      property.location.region,
      property.location.country,
    ]
      .filter(Boolean)
      .join(", ");

    const title = `${property.title} in ${location}`;
    const description =
      property.description.replace(/\s+/g, " ").trim().slice(0, 155) ||
      `Explore this ${property.propertyType} ${
        property.listingType === "sale" ? "for sale" : "for rent"
      } in ${location}. Contact the agency to learn more.`;

    const image = [...(property.media ?? [])].sort(
      (a, b) => a.order - b.order,
    )[0];

    const url = `${clientEnv.NEXT_PUBLIC_APP_URL}/discover/${encodeURIComponent(property.slug)}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        siteName: clientEnv.NEXT_PUBLIC_APP_NAME,
        title,
        description,
        url,
        images: image ? [{ url: image.url, alt: image.alt }] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        description,
        images: image ? [image.url] : undefined,
      },
    };
  } catch {
    return {
      title: "Property Details",
      description: `Explore properties on ${clientEnv.NEXT_PUBLIC_APP_NAME}.`,
      robots: { index: false, follow: false },
    };
  }
}
