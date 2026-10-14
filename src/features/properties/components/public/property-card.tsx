import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { propertyService } from "../../services/property.service";
import { formatArea, formatPrice, humanizeStatus, listingTypeLabels, propertyTypeLabels } from "../../constants/property.contants";
import { PropertyType, ListingType, PropertyMedia } from "../../types/property";

type PropertyCardProps = {
  property: Awaited<
    ReturnType<typeof propertyService.listPublic>
  >["items"][number];
  image: PropertyMedia | undefined;
  featured?: boolean;
};

export function PropertyCard({ property, image, featured }: PropertyCardProps) {
  const locationText = [property.location.city, property.location.region]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/15 hover:shadow-md ${
        featured ? "sm:col-span-2 xl:col-span-2" : ""
      }`}
    >
      <Link
        href={`/discover/${property.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`View ${property.title}`}
      >
        <div
          className={`relative overflow-hidden bg-muted ${
            featured ? "aspect-video sm:aspect-21/9" : "aspect-4/3"
          }`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Image coming soon
            </div>
          )}

          {/* Subtle bottom scrim for legibility of chips */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-foreground/40 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-background/95 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-sm">
            {listingTypeLabels[property.listingType as ListingType]}
          </span>

          {property.availabilityStatus !== "available" && (
            <span className="absolute right-3 top-3 inline-flex items-center rounded-md bg-foreground/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background backdrop-blur-sm">
              {humanizeStatus(property.availabilityStatus)}
            </span>
          )}
        </div>

        <div className={featured ? "p-5 sm:p-6" : "p-4"}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {propertyTypeLabels[property.propertyType as PropertyType]}
              </p>
              <h3
                className={`mt-1.5 line-clamp-2 font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary ${
                  featured ? "text-lg sm:text-xl" : "text-[0.9375rem]"
                }`}
              >
                {property.title}
              </h3>
            </div>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {locationText || "Location not specified"}
            </span>
          </p>

          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-3.5">
            <p
              className={`font-semibold tracking-tight text-foreground ${
                featured ? "text-2xl" : "text-xl"
              }`}
            >
              {formatPrice(property.price, property.currency)}
              {property.listingType === "rent" && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / period
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {property.specifications?.bedrooms !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="size-3.5" aria-hidden="true" />
                  {property.specifications.bedrooms}
                </span>
              )}
              {property.specifications?.bathrooms !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Bath className="size-3.5" aria-hidden="true" />
                  {property.specifications.bathrooms}
                </span>
              )}
              {property.specifications?.area !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="size-3.5" aria-hidden="true" />
                  {formatArea(
                    property.specifications.area,
                    property.specifications.areaUnit,
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
