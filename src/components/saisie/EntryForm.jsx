import { useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntryGrid } from "@/components/saisie/EntryGrid";
import { SaveButton } from "@/components/saisie/SaveButton";
import { useJournalLines } from "@/hooks/useJournalLines";
import { formatCurrency } from "@/lib/utils";

export function EntryForm() {
  const { lines, totals, updateLine, addLine, removeLine, reset } = useJournalLines();
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (totals.isEmpty) return;
    const piece = lines[0].invoice || "sans numéro";
    setStatus(
      totals.isBalanced
        ? `Écriture ${piece} enregistrée (${lines.length} lignes).`
        : `Écriture ${piece} enregistrée en brouillon (écart de ${formatCurrency(Math.abs(totals.difference))}).`
    );
    reset();
  };

  return (
    <section
      aria-labelledby="entry-form-title"
      className="flex min-h-[420px] min-w-0 flex-col rounded-lg border bg-card shadow-sm md:min-h-0"
    >
      <div className="flex h-11 items-center justify-between gap-2 border-b px-4">
        <h2 id="entry-form-title" className="text-sm font-medium">
          Saisie de l'écriture
        </h2>
        {totals.isEmpty ? (
          <Badge variant="outline">Vide</Badge>
        ) : totals.isBalanced ? (
          <Badge variant="success">
            <CircleCheck className="size-3" aria-hidden="true" /> Équilibrée
          </Badge>
        ) : (
          <Badge variant="warning">
            <TriangleAlert className="size-3" aria-hidden="true" /> Écart {formatCurrency(Math.abs(totals.difference))}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col p-3">
        <EntryGrid
          lines={lines}
          totals={totals}
          onChange={updateLine}
          onAdd={addLine}
          onRemove={removeLine}
        />

        <div className="mt-3 flex flex-wrap items-center justify-end gap-3 border-t pt-3">
          <p role="status" aria-live="polite" className="mr-auto text-sm text-muted-foreground">
            {status}
          </p>
          <SaveButton isBalanced={totals.isBalanced} disabled={totals.isEmpty} />
        </div>
      </form>
    </section>
  );
}
