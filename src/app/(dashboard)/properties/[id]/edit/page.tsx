import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { propertyService } from "@/features/properties/services/property.service";
import {
  updatePropertySchema,
} from "@/features/properties/schemas/property.schema";
import {
  PROPERTY_TYPES,
  LISTING_TYPES,
  PROPERTY_AVAILABILITY_STATUSES,
} from "@/features/properties/types/property";

type PropertyEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value || undefined;
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unable to update the property.";
}

export default async function PropertyEditPage({
  params,
  searchParams,
}: PropertyEditPageProps) {
  await requireRole(["admin", "manager", "agent", "staff"]);

  const { id } = await params;
  const { error } = await searchParams;

  let property;

  try {
    property = await propertyService.getById(id);
  } catch {
    notFound();
  }

  if (property.publicationStatus === "archived") {
    redirect(`/properties/${property._id}`);
  }

  async function updatePropertyAction(formData: FormData) {
    "use server";

    await requireRole(["admin", "manager", "agent", "staff"]);
    await connectToDatabase();

    const rawInput = {
      title: getString(formData, "title"),
      description: getString(formData, "description"),
      propertyType: getString(formData, "propertyType"),
      listingType: getString(formData, "listingType"),
      availabilityStatus: getString(formData, "availabilityStatus"),
      price: Number(getString(formData, "price")),
      currency: getString(formData, "currency"),
      location: {
        address: getOptionalString(formData, "address"),
        city: getString(formData, "city"),
        region: getOptionalString(formData, "region"),
        country: getString(formData, "country"),
        latitude: getOptionalNumber(formData, "latitude"),
        longitude: getOptionalNumber(formData, "longitude"),
      },
      specifications: {
        bedrooms: getOptionalNumber(formData, "bedrooms"),
        bathrooms: getOptionalNumber(formData, "bathrooms"),
        area: getOptionalNumber(formData, "area"),
        areaUnit: getOptionalString(formData, "areaUnit"),
      },
    };

    const parsed = updatePropertySchema.safeParse(rawInput);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check the form.";
      redirect(
        `/properties/${id}/edit?error=${encodeURIComponent(message)}`,
      );
    }

    try {
      await propertyService.update(id, parsed.data);
    } catch (updateError) {
      redirect(
        `/properties/${id}/edit?error=${encodeURIComponent(
          getErrorMessage(updateError),
        )}`,
      );
    }

    redirect(`/properties/${id}`);
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 ">
      <div className="space-y-1">
        <Link
          href={`/properties/${property._id}`}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Back to property
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          Edit property
        </h1>

        <p className="text-sm text-muted-foreground">
          Update the property information below.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form action={updatePropertyAction} className="space-y-6">
        <section className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Basic information</h2>
            <p className="text-sm text-muted-foreground">
              Core information used to identify and describe the property.
            </p>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                minLength={5}
                maxLength={160}
                defaultValue={property.title}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={20}
                maxLength={10_000}
                rows={7}
                defaultValue={property.description}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="propertyType" className="text-sm font-medium">
                  Property type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  required
                  defaultValue={property.propertyType}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/[-_]/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="listingType" className="text-sm font-medium">
                  Listing type
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  required
                  defaultValue={property.listingType}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {LISTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/[-_]/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Pricing & availability</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={property.price}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <input
                id="currency"
                name="currency"
                required
                maxLength={3}
                defaultValue={property.currency}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm uppercase"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="availabilityStatus"
                className="text-sm font-medium"
              >
                Availability
              </label>
              <select
                id="availabilityStatus"
                name="availabilityStatus"
                required
                defaultValue={property.availabilityStatus}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {PROPERTY_AVAILABILITY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/[-_]/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Location</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <input
                id="address"
                name="address"
                defaultValue={property.location.address ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <input
                id="city"
                name="city"
                required
                defaultValue={property.location.city}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="region" className="text-sm font-medium">
                Region
              </label>
              <input
                id="region"
                name="region"
                defaultValue={property.location.region ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <input
                id="country"
                name="country"
                required
                defaultValue={property.location.country}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div />

            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                defaultValue={property.location.latitude ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                defaultValue={property.location.longitude ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Specifications</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">
                Bedrooms
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                step="1"
                defaultValue={property.specifications?.bedrooms ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bathrooms" className="text-sm font-medium">
                Bathrooms
              </label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                defaultValue={property.specifications?.bathrooms ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="area" className="text-sm font-medium">
                Area
              </label>
              <input
                id="area"
                name="area"
                type="number"
                min="0"
                step="0.01"
                defaultValue={property.specifications?.area ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="areaUnit" className="text-sm font-medium">
                Area unit
              </label>
              <select
                id="areaUnit"
                name="areaUnit"
                defaultValue={property.specifications?.areaUnit ?? ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select unit</option>
                <option value="sqm">sqm</option>
                <option value="sqft">sqft</option>
                <option value="acre">acre</option>
                <option value="hectare">hectare</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/properties/${property._id}`}
            className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save changes
          </button>
        </div>
      </form>
    </main>
  );
}