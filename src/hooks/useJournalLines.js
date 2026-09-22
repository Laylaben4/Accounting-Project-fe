import { useCallback, useMemo, useState } from "react";
import { toCents } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

function createLine(previous) {
  return {
    id: crypto.randomUUID(),
    date: previous?.date ?? today(),
    invoice: previous?.invoice ?? "",
    account: "",
    debit: "",
    credit: "",
    tva: previous?.tva ?? "20",
  };
}

export function useJournalLines() {
  const [lines, setLines] = useState(() => [createLine()]);

  const updateLine = useCallback((id, field, value) => {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  }, []);

  /** New lines inherit date, invoice number and TVA from the last line, like a spreadsheet fill-down. */
  const addLine = useCallback(() => {
    setLines((current) => [...current, createLine(current.at(-1))]);
  }, []);

  const removeLine = useCallback((id) => {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current));
  }, []);

  const reset = useCallback(() => setLines([createLine()]), []);

  const totals = useMemo(() => {
    const debit = lines.reduce((sum, line) => sum + toCents(line.debit), 0);
    const credit = lines.reduce((sum, line) => sum + toCents(line.credit), 0);
    return {
      debit: debit / 100,
      credit: credit / 100,
      difference: (debit - credit) / 100,
      isBalanced: debit === credit,
      isEmpty: debit === 0 && credit === 0,
    };
  }, [lines]);

  return { lines, totals, updateLine, addLine, removeLine, reset };
}
