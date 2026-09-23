import { downloadBlob } from "@/lib/download";

function escapeCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCSV(header, rows) {
  return [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
}

export function downloadFile(content, filename, type = "text/csv;charset=utf-8") {
  // BOM so Excel opens the UTF-8 file with accents intact.
  downloadBlob(new Blob(["\uFEFF", content], { type }), filename);
}
