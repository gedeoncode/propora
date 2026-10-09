import Link from "next/link";
import { notFound } from "next/navigation";
export { getPropertyMetadata as generateMetadata } from "./metadata";
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  CheckCircle2,
  MapPin,
  Ruler,
} from "lucide-react";

import { PublicPropertyInquiryForm } from "@/features/leads/components/public-inquiry-property-form";
import { PropertyDetailPageProps } from "@/features/properties/types/public-page-props";
import { getPropertyBySlug } from "@/features/properties/services/public-property-query";

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

const availabilityLabels: Record<string, string> = {
  available: "Available",
  under_offer: "Under offer",
  rented: "Rented",
  sold: "Sold",
  withdrawn: "Withdrawn",
};

function formatPrice(price: number, currency: string): string {
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

function formatArea(area: number, unit: string | undefined): string {
  const units: Record<string, string> = {
    sqm: "m²",
    sqft: "sq ft",
    acre: "acres",
    hectare: "hectares",
  };

  return `${area.toLocaleString("en-KE")} ${units[unit ?? ""] ?? unit ?? ""}`.trim();
}

function formatListingType(listingType: "sale" | "rent"): string {
  return listingType === "sale" ? "For sale" : "For rent";
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const images = [...(property.media ?? [])].sort((a, b) => a.order - b.order);

  const locationParts = [
    property.location.city,
    property.location.region,
    property.location.country,
  ].filter(Boolean);

  const locationLabel = locationParts.join(", ");
  const addressLine = property.location.address;

  const isAvailable = property.availabilityStatus === "available";

  const specs = [
    property.specifications?.bedrooms !== undefined && {
      key: "bedrooms",
      icon: BedDouble,
      value: String(property.specifications.bedrooms),
      label: property.specifications.bedrooms === 1 ? "Bedroom" : "Bedrooms",
    },
    property.specifications?.bathrooms !== undefined && {
      key: "bathrooms",
      icon: Bath,
      value: String(property.specifications.bathrooms),
      label: property.specifications.bathrooms === 1 ? "Bathroom" : "Bathrooms",
    },
    property.specifications?.area !== undefined && {
      key: "area",
      icon: Ruler,
      value: formatArea(
        property.specifications.area,
        property.specifications.areaUnit,
      ),
      label: "Property size",
    },
  ].filter(Boolean) as {
    key: string;
    icon: typeof BedDouble;
    value: string;
    label: string;
  }[];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Back link */}
        <Link
          href="/discover"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to properties
        </Link>

        {/* Header: title, chips, location, price */}
        <header className="mt-6 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {formatListingType(property.listingType)}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {propertyTypeLabels[property.propertyType] ??
                propertyTypeLabels.other}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                isAvailable
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isAvailable ? "bg-emerald-500" : "bg-muted-foreground/60"
                }`}
                aria-hidden="true"
              />
              {availabilityLabels[property.availabilityStatus] ??
                property.availabilityStatus}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0 max-w-3xl">
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.25rem]">
                {property.title}
              </h1>

              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {addressLine && (
                    <span className="text-foreground/80">{addressLine}</span>
                  )}
                  {addressLine && locationLabel && (
                    <span className="text-muted-foreground/60"> · </span>
                  )}
                  {locationLabel}
                </span>
              </p>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {property.listingType === "sale"
                  ? "Asking price"
                  : "Rental price"}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                {formatPrice(property.price, property.currency)}
              </p>
              {property.listingType === "rent" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Rental frequency not specified
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Body grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
          {/* Main column */}
          <div className="min-w-0">
            {/* Gallery */}
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {images.length > 0 ? (
                <div className="grid gap-px sm:grid-cols-[minmax(0,1fr)_180px]">
                  <div className="relative aspect-[4/3] min-h-64 overflow-hidden sm:aspect-auto sm:min-h-[420px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[0].url}
                      alt={images[0].alt}
                      fetchPriority="high"
                      className="size-full object-cover"
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="hidden gap-px sm:grid sm:grid-rows-2">
                      {images.slice(1, 3).map((image) => (
                        <div
                          key={`${image.url}-${image.order}`}
                          className="relative min-h-0 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={image.alt}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
                  No property images available
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-2 grid grid-cols-4 gap-2 sm:hidden">
                {images.slice(1, 5).map((image) => (
                  <div
                    key={`${image.url}-${image.order}`}
                    className="aspect-square overflow-hidden rounded-md border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Specifications */}
            {specs.length > 0 && (
              <section className="mt-8">
                <h2 className="sr-only">Property specifications</h2>
                <dl className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card">
                  {specs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.key}
                        className="flex flex-col items-start gap-2 px-4 py-4 sm:px-5 sm:py-5"
                      >
                        <Icon
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <dd className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                          {spec.value}
                        </dd>
                        <dt className="text-xs text-muted-foreground">
                          {spec.label}
                        </dt>
                      </div>
                    );
                  })}
                </dl>
              </section>
            )}

            {/* About */}
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                About this property
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-[0.9375rem]">
                {property.description}
              </p>
            </section>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <section className="mt-10 border-t border-border pt-8">
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Features and amenities
                </h2>

                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {/* Property summary */}
              <dl className="divide-y divide-border text-sm">
                <div className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <dt className="text-muted-foreground">Property type</dt>
                  <dd className="text-right font-medium text-foreground">
                    {propertyTypeLabels[property.propertyType] ??
                      propertyTypeLabels.other}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <dt className="text-muted-foreground">Listing</dt>
                  <dd className="text-right font-medium text-foreground">
                    {formatListingType(property.listingType)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="text-right font-medium text-foreground">
                    {availabilityLabels[property.availabilityStatus] ??
                      property.availabilityStatus}
                  </dd>
                </div>
              </dl>

              {/* Inquiry */}
              <div className="border-t border-border bg-muted/40 px-5 py-5">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Interested in this property?
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Send an inquiry to the agency to learn more or discuss
                  arranging a viewing.
                </p>

                <div className="mt-4">
                  {["available", "under_offer"].includes(
                    property.availabilityStatus,
                  ) ? (
                    <PublicPropertyInquiryForm slug={property.slug} />
                  ) : (
                    <p className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-muted-foreground">
                      This property is no longer accepting inquiries.
                    </p>
                  )}
                </div>
              </div>

              {/* Cross-link */}
              <div className="border-t border-border px-5 py-4">
                <Link
                  href="/discover"
                  className="group inline-flex w-full items-center justify-between gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Explore more properties
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
