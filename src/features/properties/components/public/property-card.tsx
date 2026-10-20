
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import Link from "next/link";
import { propertyService } from "../../services/property.service";
import {
  formatArea,
  formatPrice,
  humanizeStatus,
  listingTypeLabels,
  propertyTypeLabels,
} from "../../constants/property.contants";
import { PropertyType, ListingType, PropertyMedia } from "../../types/property";

type PropertyCardProps = {
  property: Awaited<
    ReturnType<typeof propertyService.listPublic>
  >["items"][number];
  image: PropertyMedia | undefined;
  featured?: boolean;
};

export function PropertyCard({
  property,
  image,
  featured,
}: PropertyCardProps) {
  const locationText = [property.location.city, property.location.region]
    .filter(Boolean)
    .join(", ");

  const specifications = property.specifications;

  return (
    <article
      className={`group relative min-w-0 overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/15 hover:shadow-sm ${
        featured ? "sm:col-span-2 xl:col-span-2" : ""
      }`}
    >
      <Link
        href={`/discover/${property.slug}`}
        className="block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`View ${property.title}`}
      >
        {/* Image */}
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

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-foreground/40 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center truncate rounded-md bg-background/95 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-sm backdrop-blur-sm">
            {listingTypeLabels[property.listingType as ListingType]}
          </span>

          {property.availabilityStatus !== "available" && (
            <span className="absolute right-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center truncate rounded-md bg-foreground/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background backdrop-blur-sm">
              {humanizeStatus(property.availabilityStatus)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className={featured ? "min-w-0 p-4 sm:p-6" : "min-w-0 p-3 sm:p-4"}>
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
            {propertyTypeLabels[property.propertyType as PropertyType]}
          </p>

          <h3
            className={`mt-1.5 line-clamp-2 font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary ${
              featured ? "text-lg sm:text-xl" : "text-[0.9375rem]"
            }`}
          >
            {property.title}
          </h3>

          <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">
              {locationText || "Location not specified"}
            </span>
          </p>

          {/* Price */}
          <div className="mt-4 min-w-0 border-t border-border pt-3.5">
            <p
              className={`min-w-0 break-words font-semibold tracking-tight text-foreground ${
                featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
              }`}
            >
              {formatPrice(property.price, property.currency)}
              {property.listingType === "rent" && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / period
                </span>
              )}
            </p>

            {/* Specifications: wrap instead of clipping */}
            <div
              className="mt-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground"
              aria-label="Property specifications"
            >
              {specifications?.bedrooms !== undefined && (
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                  <BedDouble className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{specifications.bedrooms}</span>
                  <span className="sr-only">bedrooms</span>
                </span>
              )}

              {specifications?.bathrooms !== undefined && (
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                  <Bath className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{specifications.bathrooms}</span>
                  <span className="sr-only">bathrooms</span>
                </span>
              )}

              {specifications?.area !== undefined && (
                <span className="inline-flex min-w-0 items-center gap-1">
                  <Ruler className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">
                    {formatArea(
                      specifications.area,
                      specifications.areaUnit,
                    )}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
