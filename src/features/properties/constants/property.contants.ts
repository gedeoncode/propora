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

export const propertyTypeLabels: Record<
  (typeof PROPERTY_TYPES)[number],
  string
> = {
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

export const PAGE_SIZE = 12;

export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function parsePrice(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** Compute the set of pagination page numbers to render (with -1 as ellipsis). */
export function getPageNumbers(
  current: number,
  total: number,
): (number | -1)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | -1)[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push(-1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(-1);
  pages.push(total);
  return pages;
}
