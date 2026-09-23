/** All dates travel as local "YYYY-MM-DD" strings, which compare correctly as plain strings. */

export const CUSTOM_PRESET_LABEL = "Personnalisé";

export const DATE_PRESETS = [
  { id: "this-month", label: "Ce mois" },
  { id: "last-month", label: "Le mois dernier" },
  { id: "this-quarter", label: "Ce trimestre" },
  { id: "last-6-months", label: "6 derniers mois" },
  { id: "this-year", label: "Cette année" },
  { id: "custom", label: CUSTOM_PRESET_LABEL },
];

export const DEFAULT_PRESET_ID = "last-6-months";

const pad = (n) => String(n).padStart(2, "0");

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(iso, days) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function daysBetween(startIso, endIso) {
  return Math.round((parseISODate(endIso) - parseISODate(startIso)) / 86_400_000);
}

/** Presets ending in the current period stop at today: future dates are never part of a range. */
export function getPresetRange(presetId, today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const endToday = toISODate(today);
  const preset = DATE_PRESETS.find((p) => p.id === presetId);

  const ranges = {
    "this-month": [new Date(year, month, 1), endToday],
    "last-month": [new Date(year, month - 1, 1), toISODate(new Date(year, month, 0))],
    "this-quarter": [new Date(year, month - (month % 3), 1), endToday],
    "last-6-months": [new Date(year, month - 5, 1), endToday],
    "this-year": [new Date(year, 0, 1), endToday],
  };

  const [start, endDate] = ranges[presetId];
  return { startDate: toISODate(start), endDate, presetLabel: preset.label };
}

/** The window of equal length immediately before `range`, used for period-over-period comparison. */
export function getPreviousRange({ startDate, endDate }) {
  const length = daysBetween(startDate, endDate) + 1;
  const previousEnd = addDays(startDate, -1);
  return { startDate: addDays(previousEnd, -(length - 1)), endDate: previousEnd };
}

export function validateCustomRange({ startDate, endDate }, { today = todayISO(), minDate } = {}) {
  if (!startDate || !endDate) return "Veuillez renseigner les deux dates.";
  if (startDate > today || endDate > today) return "Les dates futures ne sont pas autorisées.";
  if (minDate && startDate < minDate) return `Aucune donnée avant le ${formatShortDate(minDate)}.`;
  if (startDate > endDate) return "La date de début doit précéder ou égaler la date de fin.";
  return null;
}

const longFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function formatRange({ startDate, endDate }) {
  return `${longFormatter.format(parseISODate(startDate))} – ${longFormatter.format(parseISODate(endDate))}`;
}

/** 2026-04-01 -> 01/04/2026 */
export function formatShortDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

/** 2026-04-01 -> 01-04-2026, safe for filenames. */
export function formatFileDate(iso) {
  return formatShortDate(iso).replaceAll("/", "-");
}
