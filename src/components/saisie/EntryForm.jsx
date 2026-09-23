import { useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { EntryGrid } from "@/components/saisie/EntryGrid";
import { SaveButton } from "@/components/saisie/SaveButton";
import { hasAmount } from "@/hooks/useJournalLines";
import { formatCurrency } from "@/lib/utils";
import { buildJournalPayload, saveJournalEntry } from "@/services/journalApi";

/** @param journal Return value of useJournalLines(), owned by the Saisie page so the PDF preview shares it. */
export function EntryForm({ journal }) {
  const { journalLines, totals, updateLine, addLine, removeLine, reset } = journal;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving || totals.isEmpty) return;

    const { debit: totalDebit, credit: totalCredit } = totals;
    // isBalanced compares integer cents, so 0.1 + 0.2 still equals 0.3.
    if (!totals.isBalanced) {
      toast({
        variant: "error",
        title: "Écriture non équilibrée",
        description: `Débit ${formatCurrency(totalDebit)} / Crédit ${formatCurrency(totalCredit)} : écart de ${formatCurrency(Math.abs(totals.difference))}. Enregistrement bloqué, le brouillon reste sauvegardé sur cet appareil.`,
      });
      return;
    }

    const incompleteIndex = journalLines.findIndex((line) => hasAmount(line) && (!line.date || !line.compte));
    if (incompleteIndex !== -1) {
      toast({
        variant: "error",
        title: "Ligne incomplète",
        description: `Ligne ${incompleteIndex + 1} : la date et le compte sont obligatoires.`,
      });
      return;
    }

    setSaving(true);
    try {
      const saved = await saveJournalEntry(buildJournalPayload(journalLines));
      toast({
        variant: "success",
        title: "Écriture enregistrée",
        description: `${saved.lines.length} ligne${saved.lines.length > 1 ? "s" : ""} · ${formatCurrency(totalDebit)}`,
      });
      reset();
    } catch {
      toast({ variant: "error", title: "Échec de l'enregistrement", description: "Veuillez réessayer." });
    } finally {
      setSaving(false);
    }
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

      <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col p-3">
        <EntryGrid
          lines={journalLines}
          totals={totals}
          onChange={updateLine}
          onAdd={addLine}
          onRemove={removeLine}
        />

        <div className="mt-3 flex flex-wrap items-center justify-end gap-3 border-t pt-3">
          <SaveButton isBalanced={totals.isBalanced} disabled={totals.isEmpty} saving={saving} />
        </div>
      </form>
    </section>
  );
}
