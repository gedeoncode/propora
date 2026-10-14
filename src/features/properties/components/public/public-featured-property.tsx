
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";
import { PropertyCard } from "./property-card";

export async function PublicFeaturedProperties() {
  let properties: Awaited<
    ReturnType<typeof propertyService.listPublic>
  >["items"] = [];

  try {
    const result = await propertyService.listPublic(
      {},
      {
        page: 1,
        limit: 6,
      },
    );

    properties = result.items;
  } catch {
    // Keep the rest of the homepage available if listings cannot load.
    return null;
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-properties-heading"
      className="bg-background pt-14 sm:pt-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Explore Propora
            </p>

            <h2
              id="featured-properties-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Properties worth discovering
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore recently listed homes, land, and commercial spaces
              from our property listings.
            </p>
          </div>

          <Link
            href="/discover"
            className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:self-auto"
          >
            View all properties
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const image = [...(property.media ?? [])].sort(
              (a, b) => a.order - b.order,
            )[0];

            return (
              <PropertyCard
                key={String(property._id)}
                property={property}
                image={image}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
