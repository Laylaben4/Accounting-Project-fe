import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { EntryForm } from "@/components/saisie/EntryForm";
import { InvoiceViewer } from "@/components/saisie/InvoiceViewer";
import { SaisieToolbar } from "@/components/saisie/SaisieToolbar";
import { useJournalLines } from "@/hooks/useJournalLines";
import { cn } from "@/lib/utils";

export default function SaisieComptable() {
  const [swapped, setSwapped] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const journal = useJournalLines();

  // Keyed children let React move the real DOM nodes on swap (tab order follows the visual order).
  const viewer = <InvoiceViewer key="viewer" journalLines={journal.journalLines} />;
  const form = <EntryForm key="form" journal={journal} />;
  const panels = enlarged ? [form] : swapped ? [form, viewer] : [viewer, form];

  return (
    <>
      <PageHeader
        description="Saisissez les lignes de l'écriture à partir de la pièce justificative."
      />

      <SaisieToolbar
        swapped={swapped}
        enlarged={enlarged}
        onSwap={() => setSwapped((value) => !value)}
        onToggleEnlarge={() => setEnlarged((value) => !value)}
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-4 md:h-[calc(100vh-15rem)] md:min-h-[520px]",
          !enlarged && "md:grid-cols-2"
        )}
      >
        {panels}
      </div>
    </>
  );
}
