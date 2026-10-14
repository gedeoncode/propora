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
import { PropertyGallery } from "@/features/properties/components/public-property-gallery";
import { MobileInquiryBar } from "@/features/properties/components/public/public-mobile-inquiry-bar";
import { PropertyMedia } from "@/features/properties/types/property";

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
  return `${area.toLocaleString("en-KE")} ${
    units[unit ?? ""] ?? unit ?? ""
  }`.trim();
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

  const images = (property.media ?? [])
    .map(({ url, alt, order }: PropertyMedia) => ({
      url,
      alt: alt ?? property.title,
      order,
    }))
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

  const locationParts = [
    property.location.city,
    property.location.region,
    property.location.country,
  ].filter(Boolean);

  const locationLabel = locationParts.join(", ");
  const addressLine = property.location.address;

  const isAvailable = property.availabilityStatus === "available";
  const isAcceptingInquiries = ["available", "under_offer"].includes(
    property.availabilityStatus,
  );

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
      label: "Area",
    },
  ].filter(Boolean) as {
    key: string;
    icon: typeof BedDouble;
    value: string;
    label: string;
  }[];

  const typeLabel =
    propertyTypeLabels[property.propertyType] ?? propertyTypeLabels.other;
  const availabilityLabel =
    availabilityLabels[property.availabilityStatus] ??
    property.availabilityStatus;

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-16">
      <div className="page-container pt-5  sm:pt-6 ">
        {/* Breadcrumb / back */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/discover"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All properties
          </Link>
        </nav>

        {/* ── Title block: title left, price right ─────────────── */}
        <header className="mt-4 grid gap-4 border-b border-border pb-6 sm:mt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10 lg:pb-7">
          <div className="min-w-0">
            <h1 className="text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground sm:text-[1.75rem] lg:text-[2rem]">
              {property.title}
            </h1>
            <p className="mt-2 flex items-start gap-1.5 text-[13.5px] leading-6 text-muted-foreground">
              <MapPin className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                {addressLine && (
                  <span className="text-foreground/75">{addressLine}</span>
                )}
                {addressLine && locationLabel && (
                  <span className="text-border"> · </span>
                )}
                {locationLabel}
              </span>
            </p>

            {/* Compact meta row under title */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-muted-foreground">
              <span className="font-medium text-foreground">{typeLabel}</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span>{formatListingType(property.listingType)}</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span
                className={
                  isAvailable
                    ? "inline-flex items-center gap-1.5 font-medium text-[color:var(--success)]"
                    : "inline-flex items-center gap-1.5"
                }
              >
                <span
                  className={
                    isAvailable
                      ? "size-1.5 rounded-full bg-[color:var(--success)]"
                      : "size-1.5 rounded-full bg-muted-foreground/50"
                  }
                  aria-hidden="true"
                />
                {availabilityLabel}
              </span>
            </div>
          </div>

          {/* Price — anchored, not floating */}
          <div className="flex items-baseline gap-2 lg:flex-col lg:items-end lg:gap-0.5">
            <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted-foreground lg:order-2">
              {property.listingType === "sale"
                ? "Asking price"
                : "Rent / month"}
            </span>
            <span className="text-[1.625rem] font-semibold leading-none tracking-[-0.02em] text-foreground sm:text-[1.875rem] lg:order-1">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </header>

        {/* ── Gallery (client for lightbox + mobile paging) ────── */}
        <div className="mt-6 sm:mt-7">
          <PropertyGallery images={images} title={property.title} />
        </div>

        {/* ── Body: content + sidebar ──────────────────────────── */}
        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
          {/* Main column */}
          <div className="min-w-0">
            {/* Specs — inline data strip, adapts per breakpoint */}
            {specs.length > 0 && (
              <section
                aria-label="Property specifications"
                className="border-y border-border"
              >
                <dl className="grid grid-cols-3 divide-x divide-border">
                  {specs.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.key}
                        className="flex flex-col gap-1 py-4 px-1 first:pl-0 last:pr-0 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-5"
                      >
                        <Icon
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dd className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                            {spec.value}
                          </dd>
                          <dt className="text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">
                            {spec.label}
                          </dt>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </section>
            )}

            {/* About — editorial, no card */}
            <section className="mt-9 sm:mt-10">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                About this property
              </h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-foreground/85">
                {property.description}
              </p>
            </section>

            {/* Amenities — two-column, no border-top noise */}
            {property.amenities.length > 0 && (
              <section className="mt-9 sm:mt-10">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Features &amp; amenities
                  </h2>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {property.amenities.length}
                  </span>
                </div>
                <ul className="mt-3.5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-start gap-2.5 text-[14px] leading-6 text-foreground/85"
                    >
                      <CheckCircle2
                        className="mt-[5px] size-3.5 shrink-0 text-[color:var(--success)]"
                        aria-hidden="true"
                      />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar — visible at all breakpoints; sticky from lg up */}
          <aside className="lg:sticky lg:top-6">
            <div id="inquiry-anchor" className="space-y-6">
              {/* Facts: hairline-bounded definition list, no box */}
              <dl className="divide-y divide-border border-y border-border text-[13px]">
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">Property type</dt>
                  <dd className="text-right font-medium text-foreground">
                    {typeLabel}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">Listing</dt>
                  <dd className="text-right font-medium text-foreground">
                    {formatListingType(property.listingType)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd
                    className={
                      isAvailable
                        ? "text-right font-medium text-[color:var(--success)]"
                        : "text-right font-medium text-foreground"
                    }
                  >
                    {availabilityLabel}
                  </dd>
                </div>
              </dl>

              {/* Inquiry — heading + description, then the form's own mt-5 takes over */}
              <section
                aria-labelledby="inquiry-heading"
                className="border-t border-border pt-5"
              >
                <h2
                  id="inquiry-heading"
                  className="text-[15px] font-semibold tracking-[-0.01em] text-foreground"
                >
                  {isAcceptingInquiries
                    ? "Request more information"
                    : "Listing unavailable"}
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {isAcceptingInquiries
                    ? "Message the agency to ask a question or arrange a viewing."
                    : "This property is no longer accepting inquiries."}
                </p>

                {isAcceptingInquiries ? (
                  <PublicPropertyInquiryForm slug={property.slug} />
                ) : (
                  <div className="mt-4 rounded-md border border-border bg-muted/50 px-3.5 py-3 text-[13px] text-muted-foreground">
                    Try{" "}
                    <Link
                      href="/discover"
                      className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                    >
                      browsing similar properties
                    </Link>{" "}
                    instead.
                  </div>
                )}
              </section>

              {/* Cross-link — quiet, inline */}
              <Link
                href="/discover"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Explore more properties
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile/tablet sticky inquiry CTA — client for scroll reveal */}
      {isAcceptingInquiries && (
        <MobileInquiryBar
          slug={property.slug}
          price={formatPrice(property.price, property.currency)}
          listingType={property.listingType}
        />
      )}
    </main>
  );
}
