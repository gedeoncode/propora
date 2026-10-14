import { PROPERTY_TYPES } from "../types/property";

export const listingTypeLabels = {
  sale: "For sale",
  rent: "For rent",
} as const;

export function humanizeStatus(status: string): string {
  return status
    .split("_") 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const propertyTypeLabels: Record<(typeof PROPERTY_TYPES)[number], string> = {
  apartment: "Apartment",
  house: "House",
  townhouse: "Townhouse",
  villa: "Villa",
  land: "Land",
  office: "Office",
  retail: "Retail",
  warehouse: "Warehouse",
  other: "Other",
};

export function formatPrice(price: number, currency: string): string {
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

export function formatArea(area: number, unit: string | undefined): string {
  const labels: Record<string, string> = {
    sqm: "m²",
    sqft: "sq ft",
    acre: "acres",
    hectare: "hectares",
  };
  return `${area.toLocaleString("en-KE")} ${labels[unit ?? ""] ?? unit ?? ""}`.trim();
}

export function buildHref(
  params: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {},
): string {
  const query = new URLSearchParams();
  const merged = { ...params, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== "") {
      query.set(key, value);
    }
  }

  const qs = query.toString();
  return qs ? `/discover?${qs}` : "/discover";
}