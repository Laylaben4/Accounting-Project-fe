import { FileText } from "lucide-react";

export function InvoiceViewer() {
  return (
    <section
      aria-label="Invoice PDF Viewer"
      className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border bg-card shadow-sm md:min-h-0"
    >
      <div className="flex h-11 items-center gap-2 border-b px-4 text-sm font-medium">
        <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
        FA-2026-118.pdf
      </div>
      <div className="flex flex-1 items-center justify-center bg-slate-200 p-6">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FileText className="size-12" aria-hidden="true" strokeWidth={1.25} />
          <p className="text-lg font-semibold">Invoice PDF Viewer</p>
          <p className="text-xs">Aperçu du document justificatif</p>
        </div>
      </div>
    </section>
  );
}
