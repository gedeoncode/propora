
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { propertyService } from "@/features/properties/services/property.service";

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  land: "Land",
  office: "Office",
  retail: "Retail space",
  warehouse: "Warehouse",
  other: "Property",
};

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-KE")}`;
  }
}

export async function PublicFeaturedProperties() {
  let properties: Awaited<
    ReturnType<typeof propertyService.listPublic>
  >["items"] = [];

  try {

    const result = await propertyService.listPublic({}, {
      page: 1,
      limit: 6,
    });

    properties = result.items;
  } catch {
    // The rest of the homepage remains available if listings cannot load.
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
              className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Properties worth discovering
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore recently listed homes, land, and commercial
              spaces from our property listings.
            </p>
          </div>

          <Link
            href="/discover"
            className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-primary hover:underline sm:self-auto"
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
              <article
                key={String(property._id)}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <Link
                  href={`/discover/${property.slug}`}
                  aria-label={`View ${property.title}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                        Image unavailable
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                      {property.listingType === "sale"
                        ? "For sale"
                        : "For rent"}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {propertyTypeLabels[property.propertyType] ??
                        "Property"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-12 font-semibold leading-6 group-hover:text-primary">
                      {property.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {[property.location.city, property.location.region]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </p>

                    <p className="mt-4 text-xl font-bold tracking-tight">
                      {formatPrice(property.price, property.currency)}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}