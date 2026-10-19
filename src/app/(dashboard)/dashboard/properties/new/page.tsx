import Link from "next/link";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { propertyService } from "@/features/properties/services/property.service";
import { createPropertySchema } from "@/features/properties/schemas/property.schema";
import { uploadPropertyImage } from "@/lib/storage/cloudinary-upload";
import { logger } from "@/lib/logger";
import { ArrowLeft, CalendarDays, Home } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

const PROPERTY_IMAGE_FIELDS = 10;

function getText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getOptionalNumber(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value === "" ? undefined : Number(value);
}

function getOptionalText(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value === "" ? undefined : value;
}

async function createPropertyAction(formData: FormData) {
  "use server";
  const user = await requireRole(["admin", "manager", "agent", "staff"]);

  const mediaFiles = formData
    .getAll("media")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const rawInput = {
    title: getText(formData, "title"),
    description: getText(formData, "description"),
    propertyType: getText(formData, "propertyType"),
    listingType: getText(formData, "listingType"),
    availabilityStatus: getText(formData, "availabilityStatus") || "available",
    price: Number(getText(formData, "price")),
    currency: getText(formData, "currency") || "KES",
    location: {
      address: getOptionalText(formData, "address"),
      city: getText(formData, "city"),
      region: getOptionalText(formData, "region"),
      country: getText(formData, "country"),
      latitude: getOptionalNumber(formData, "latitude"),
      longitude: getOptionalNumber(formData, "longitude"),
    },
    specifications: {
      bedrooms: getOptionalNumber(formData, "bedrooms"),
      bathrooms: getOptionalNumber(formData, "bathrooms"),
      area: getOptionalNumber(formData, "area"),
      areaUnit: getOptionalText(formData, "areaUnit"),
    },
    amenities: getText(formData, "amenities")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    media: [],
    assignedAgentId: getOptionalText(formData, "assignedAgentId"),
  };

  const parsed = createPropertySchema.safeParse(rawInput);

  if (!parsed.success) {
    throw new Error("Please correct the property details and try again.");
  }

  if (mediaFiles.length > PROPERTY_IMAGE_FIELDS) {
    throw new Error(
      `You can upload a maximum of ${PROPERTY_IMAGE_FIELDS} property images.`,
    );
  }

  const uploadedMedia = [];

  for (let index = 0; index < mediaFiles.length; index += 1) {
    const file = mediaFiles[index];
    const uploaded = await uploadPropertyImage(file);

    uploadedMedia.push({
      url: uploaded.secureUrl,
      alt: file.name,
      order: index,
    });
  }

  const property = await propertyService.create(
    {
      ...parsed.data,
      media: uploadedMedia,
    },
    user.id,
  );

  redirect(`/dashboard/properties/${property._id.toString()}`);
}

export default async function NewPropertyPage() {
  await requireRole(["admin", "manager", "agent", "staff"]);

  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Properties
        </Link>
        <PageHeader
          icon={<Home className="size-5" aria-hidden="true" />}
          title="Add property"
          description="Create a property record. New properties start as drafts."
        />
      </div>

      <form action={createPropertyAction} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Basic information</h2>

          <div className="mt-5 grid gap-5">
            <label className="text-sm font-medium">
              Title
              <input
                name="title"
                required
                minLength={5}
                maxLength={160}
                className={inputClassName}
                placeholder="Modern 3-bedroom apartment"
              />
            </label>

            <label className="text-sm font-medium">
              Description
              <textarea
                name="description"
                required
                minLength={20}
                maxLength={10000}
                rows={6}
                className={inputClassName}
                placeholder="Describe the property..."
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium">
                Property type
                <select
                  name="propertyType"
                  required
                  defaultValue=""
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select property type
                  </option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="land">Land</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="text-sm font-medium">
                Listing type
                <select
                  name="listingType"
                  required
                  defaultValue=""
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select listing type
                  </option>
                  <option value="sale">For sale</option>
                  <option value="rent">For rent</option>
                  <option value="lease">For lease</option>
                </select>
              </label>
            </div>

            <label className="text-sm font-medium">
              Availability
              <select
                name="availabilityStatus"
                defaultValue="available"
                className={inputClassName}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Pricing</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium">
              Price
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-medium">
              Currency
              <input
                name="currency"
                defaultValue="KES"
                maxLength={3}
                className={inputClassName}
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Location</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium md:col-span-2">
              Address
              <input name="address" className={inputClassName} />
            </label>

            <label className="text-sm font-medium">
              City
              <input name="city" required className={inputClassName} />
            </label>

            <label className="text-sm font-medium">
              Region
              <input name="region" className={inputClassName} />
            </label>

            <label className="text-sm font-medium">
              Country
              <input
                name="country"
                required
                className={inputClassName}
                defaultValue="Kenya"
              />
            </label>

            <label className="text-sm font-medium">
              Latitude
              <input
                name="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-medium">
              Longitude
              <input
                name="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                className={inputClassName}
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Specifications</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium">
              Bedrooms
              <input
                name="bedrooms"
                type="number"
                min="0"
                step="1"
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-medium">
              Bathrooms
              <input
                name="bathrooms"
                type="number"
                min="0"
                step="1"
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-medium">
              Area
              <input
                name="area"
                type="number"
                min="0"
                step="0.01"
                className={inputClassName}
              />
            </label>

            <label className="text-sm font-medium">
              Area unit
              <select
                name="areaUnit"
                defaultValue=""
                className={inputClassName}
              >
                <option value="">Select unit</option>
                <option value="sqm">Square metres</option>
                <option value="sqft">Square feet</option>
                <option value="acre">Acres</option>
                <option value="hectare">Hectares</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Amenities</h2>

          <label className="mt-5 block text-sm font-medium">
            Amenities
            <input
              name="amenities"
              className={inputClassName}
              placeholder="Parking, swimming pool, security"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separate amenities with commas.
            </p>
          </label>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Property images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload up to {PROPERTY_IMAGE_FIELDS} JPEG, PNG, or WebP images.
            Maximum 10 MB per image.
          </p>

          <div className="mt-5 space-y-4">
            {Array.from({ length: PROPERTY_IMAGE_FIELDS }, (_, index) => (
              <label
                key={index}
                className="block rounded-lg border border-dashed border-border p-4 text-sm"
              >
                <span className="font-medium">
                  Image {index + 1}
                  {index === 0 ? " (primary)" : ""}
                </span>

                <input
                  name="media"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-2 block w-full text-sm"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/properties"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create property
          </button>
        </div>
      </form>
    </main>
  );
}
