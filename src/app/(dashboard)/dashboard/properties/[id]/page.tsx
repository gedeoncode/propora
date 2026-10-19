import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { propertyService } from "@/features/properties/services/property.service";
import { PropertyMedia } from "@/features/properties/types/property";

type PropertyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  await requireRole(["admin", "manager", "agent", "staff"]);

  const { id } = await params;

  let property;

  try {
    property = await propertyService.getById(id);
  } catch {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/properties"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to properties
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            {property.title}
          </h1>

          <p className="text-sm text-muted-foreground">
            {property.location.city}, {property.location.country}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/properties/${property._id}/edit`}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Edit property
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-xl border bg-card">
            {property.media.length > 0 ? (
              <div className="grid gap-px bg-border sm:grid-cols-2">
                {property.media
                  .slice()
                  .sort((a: PropertyMedia, b: PropertyMedia) => a.order - b.order)
                  .map(
                    (media: PropertyMedia) => (
                    <div
                      key={`${media.url}-${media.order}`}
                      className="aspect-video bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={media.url}
                        alt={media.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    ),
                  )}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted px-6 text-center text-sm text-muted-foreground">
                No property images have been added yet.
              </div>
            )}
          </div>

          <section className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Property details</h2>
              <p className="text-sm text-muted-foreground">
                Core information about this property.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Property type
                </p>
                <p className="mt-1 text-sm">
                  {formatLabel(property.propertyType)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Listing type
                </p>
                <p className="mt-1 text-sm">
                  {formatLabel(property.listingType)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Price
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatPrice(property.price, property.currency)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Availability
                </p>
                <p className="mt-1 text-sm">
                  {formatLabel(property.availabilityStatus)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Publication
                </p>
                <p className="mt-1 text-sm">
                  {formatLabel(property.publicationStatus)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Published
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(property.publishedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Description</h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {property.description}
            </p>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Location</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Address
                </p>
                <p className="mt-1 text-sm">
                  {property.location.address || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  City
                </p>
                <p className="mt-1 text-sm">{property.location.city}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Region
                </p>
                <p className="mt-1 text-sm">
                  {property.location.region || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Country
                </p>
                <p className="mt-1 text-sm">{property.location.country}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Coordinates
                </p>
                <p className="mt-1 text-sm">
                  {property.location.latitude !== undefined &&
                  property.location.longitude !== undefined
                    ? `${property.location.latitude}, ${property.location.longitude}`
                    : "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Specifications</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Bedrooms
                </p>
                <p className="mt-1 text-sm">
                  {property.specifications?.bedrooms ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Bathrooms
                </p>
                <p className="mt-1 text-sm">
                  {property.specifications?.bathrooms ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Area
                </p>
                <p className="mt-1 text-sm">
                  {property.specifications?.area !== undefined
                    ? `${property.specifications.area} ${
                        property.specifications.areaUnit ?? ""
                      }`.trim()
                    : "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Amenities</h2>
            </div>

            {property.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border bg-muted px-3 py-1.5 text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No amenities have been added.
              </p>
            )}
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Property status</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Publication
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatLabel(property.publicationStatus)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Availability
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatLabel(property.availabilityStatus)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Record</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Created
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(property.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last updated
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(property.updatedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Slug
                </p>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {property.slug}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-dashed bg-muted/30 p-6">
            <h2 className="text-lg font-semibold">Management actions</h2>

            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Publishing, availability, archiving, media, and assignment
              controls will be available here.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}