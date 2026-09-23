import { addDays, parseISODate, todayISO } from "@/lib/dateRange";

/** Amounts are in MAD. */
export const LEDGER_ENTRIES = [
  { id: 1, date: "2026-01-05", piece: "FA-2026-001", account: "3421", label: "Facture client Atlas SARL", debit: 24000, credit: 0 },
  { id: 2, date: "2026-01-05", piece: "FA-2026-001", account: "7111", label: "Facture client Atlas SARL", debit: 0, credit: 20000 },
  { id: 3, date: "2026-01-05", piece: "FA-2026-001", account: "4455", label: "TVA facturée 20 %", debit: 0, credit: 4000 },
  { id: 4, date: "2026-01-12", piece: "FF-0342", account: "6111", label: "Achat marchandises Sud Import", debit: 12500, credit: 0 },
  { id: 5, date: "2026-01-12", piece: "FF-0342", account: "3455", label: "TVA récupérable 20 %", debit: 2500, credit: 0 },
  { id: 6, date: "2026-01-12", piece: "FF-0342", account: "4411", label: "Fournisseur Sud Import", debit: 0, credit: 15000 },
  { id: 7, date: "2026-01-20", piece: "BQ-0107", account: "5141", label: "Règlement Atlas SARL", debit: 24000, credit: 0 },
  { id: 8, date: "2026-01-20", piece: "BQ-0107", account: "3421", label: "Règlement Atlas SARL", debit: 0, credit: 24000 },
  { id: 9, date: "2026-02-03", piece: "FA-2026-002", account: "3421", label: "Facture client Rif Distribution", debit: 11400, credit: 0 },
  { id: 10, date: "2026-02-03", piece: "FA-2026-002", account: "7121", label: "Prestation Rif Distribution", debit: 0, credit: 10000 },
  { id: 11, date: "2026-02-03", piece: "FA-2026-002", account: "4455", label: "TVA facturée 14 %", debit: 0, credit: 1400 },
  { id: 12, date: "2026-02-10", piece: "BQ-0112", account: "4411", label: "Règlement Sud Import", debit: 15000, credit: 0 },
  { id: 13, date: "2026-02-10", piece: "BQ-0112", account: "5141", label: "Règlement Sud Import", debit: 0, credit: 15000 },
  { id: 14, date: "2026-02-28", piece: "OD-0021", account: "6131", label: "Loyer bureaux février", debit: 8000, credit: 0 },
  { id: 15, date: "2026-02-28", piece: "OD-0021", account: "5141", label: "Loyer bureaux février", debit: 0, credit: 8000 },
  { id: 16, date: "2026-03-08", piece: "FA-2026-003", account: "3421", label: "Facture client Oasis Tech", debit: 36000, credit: 0 },
  { id: 17, date: "2026-03-08", piece: "FA-2026-003", account: "7111", label: "Facture client Oasis Tech", debit: 0, credit: 30000 },
  { id: 18, date: "2026-03-08", piece: "FA-2026-003", account: "4455", label: "TVA facturée 20 %", debit: 0, credit: 6000 },
  { id: 19, date: "2026-03-15", piece: "BQ-0131", account: "5141", label: "Acompte Oasis Tech", debit: 18000, credit: 0 },
  { id: 20, date: "2026-03-15", piece: "BQ-0131", account: "3421", label: "Acompte Oasis Tech", debit: 0, credit: 18000 },
];

export const DATA_START_DATE = "2025-01-01";

/** Seeded PRNG so the mock series is identical on every load. */
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDailyFinancials() {
  const random = mulberry32(2026);
  const end = todayISO();
  const days = [];
  for (let iso = DATA_START_DATE, index = 0; iso <= end; iso = addDays(iso, 1), index += 1) {
    const date = parseISODate(iso);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const trend = 1 + index / 1200;
    const seasonality = 1 + 0.12 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
    const revenue = Math.round((isWeekend ? 1500 : 9500) * trend * seasonality * (0.7 + random() * 0.6));
    days.push({
      date: iso,
      revenue,
      charges: Math.round(revenue * (0.62 + random() * 0.16)),
      invoices: isWeekend ? Number(random() < 0.3) : 1 + Math.floor(random() * 3),
    });
  }
  return days;
}

/** One row per calendar day, amounts HT in MAD. */
export const DAILY_FINANCIALS = buildDailyFinancials();

export const RECENT_ENTRIES = [
  { id: "EC-1042", date: "2026-09-21", piece: "FA-2026-118", label: "Vente Oasis Tech", amount: 36000, status: "validated" },
  { id: "EC-1041", date: "2026-09-20", piece: "FF-0391", label: "Achat fournitures bureau", amount: 2450, status: "draft" },
  { id: "EC-1040", date: "2026-09-19", piece: "BQ-0214", label: "Règlement Rif Distribution", amount: 11400, status: "validated" },
  { id: "EC-1039", date: "2026-09-18", piece: "OD-0047", label: "Loyer bureaux septembre", amount: 8000, status: "validated" },
  { id: "EC-1038", date: "2026-09-17", piece: "FF-0389", label: "Maintenance serveurs", amount: 5700, status: "draft" },
];
