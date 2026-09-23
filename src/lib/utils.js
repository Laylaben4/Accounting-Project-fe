import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "MAD",
  minimumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatCompact(value) {
  return compactFormatter.format(value);
}

/** Parses user input like "1 234,56" or "1234.56" into integer cents to avoid float drift. */
export function toCents(raw) {
  if (raw === "" || raw == null) return 0;
  const normalized = String(raw).replace(/[\s\u00a0\u202f]/g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
