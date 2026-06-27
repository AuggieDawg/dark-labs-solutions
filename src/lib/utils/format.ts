import { DARK_LABS_TIME_ZONE } from "@/lib/time/config";

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: DARK_LABS_TIME_ZONE,
  }).format(new Date(value));
}

export function formatTimestamp(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: DARK_LABS_TIME_ZONE,
    timeZoneName: "short",
  }).format(new Date(value));
}

export function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatCurrencyFromCents(
  value: number | null | undefined,
  currency = "USD",
) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value / 100);
}
