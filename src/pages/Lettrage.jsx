import { useMemo, useState } from "react";
import { Link2, Unlink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LEDGER_ENTRIES } from "@/data/mockData";
import { ACCOUNT_LABELS } from "@/data/planComptable";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const THIRD_PARTY_ACCOUNTS = ["3421", "4411"];

function letterAt(index) {
  let n = index;
  let code = "";
  do {
    code = String.fromCharCode(65 + (n % 26)) + code;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return code;
}

/** First free code in the sequence A…Z, AA, AB…, so codes released by délettrage get reused. */
function nextLetter(used) {
  let index = 0;
  while (used.has(letterAt(index))) index += 1;
  return letterAt(index);
}

export default function Lettrage() {
  const [account, setAccount] = useState(THIRD_PARTY_ACCOUNTS[0]);
  const [selected, setSelected] = useState(() => new Set());
  const [letters, setLetters] = useState({});

  const entries = useMemo(() => LEDGER_ENTRIES.filter((entry) => entry.account === account), [account]);

  const selection = useMemo(() => {
    const picked = entries.filter((entry) => selected.has(entry.id));
    const debit = picked.reduce((sum, entry) => sum + entry.debit, 0);
    const credit = picked.reduce((sum, entry) => sum + entry.credit, 0);
    return { count: picked.length, debit, credit, canMatch: picked.length >= 2 && debit === credit };
  }, [entries, selected]);

  const toggle = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAccountChange = (value) => {
    setAccount(value);
    setSelected(new Set());
  };

  const handleMatch = () => {
    const code = nextLetter(new Set(Object.values(letters)));
    setLetters((current) => {
      const next = { ...current };
      selected.forEach((id) => (next[id] = code));
      return next;
    });
    setSelected(new Set());
  };

  const handleUnmatch = (code) => {
    setLetters((current) => Object.fromEntries(Object.entries(current).filter(([, value]) => value !== code)));
  };

  return (
    <>
      <PageHeader
        description="Rapprochez factures et règlements dont les montants se compensent."
      />

      <Card className="mb-4 flex flex-wrap items-end gap-4 p-4">
        <div className="w-full space-y-1.5 sm:w-72">
          <Label htmlFor="lettrage-account">Compte de tiers</Label>
          <Select id="lettrage-account" value={account} onChange={(e) => handleAccountChange(e.target.value)}>
            {THIRD_PARTY_ACCOUNTS.map((code) => (
              <option key={code} value={code}>
                {code} — {ACCOUNT_LABELS[code]}
              </option>
            ))}
          </Select>
        </div>

        <dl className="flex gap-6 text-sm" aria-live="polite">
          <div>
            <dt className="text-xs text-muted-foreground">Sélection</dt>
            <dd className="font-semibold tabular-nums">{selection.count} ligne(s)</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Débit</dt>
            <dd className="font-semibold tabular-nums">{formatCurrency(selection.debit)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Crédit</dt>
            <dd className="font-semibold tabular-nums">{formatCurrency(selection.credit)}</dd>
          </div>
        </dl>

        <Button className="ml-auto" onClick={handleMatch} disabled={!selection.canMatch}>
          <Link2 aria-hidden="true" /> Lettrer la sélection
        </Button>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Écritures du compte {account}</caption>
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" className="w-12 px-4 py-2.5">
                <span className="sr-only">Sélection</span>
              </th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Date</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Pièce</th>
              <th scope="col" className="px-4 py-2.5 font-semibold">Libellé</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">Débit</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">Crédit</th>
              <th scope="col" className="px-4 py-2.5 text-center font-semibold">Lettre</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const letter = letters[entry.id];
              const isSelected = selected.has(entry.id);
              return (
                <tr
                  key={entry.id}
                  className={cn("border-b last:border-0", isSelected && "bg-primary/5", letter && "text-muted-foreground")}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--primary)]"
                      checked={isSelected}
                      disabled={Boolean(letter)}
                      onChange={() => toggle(entry.id)}
                      aria-label={`Sélectionner ${entry.piece} — ${entry.label}`}
                    />
                  </td>
                  <td className="px-4 py-2">{formatDate(entry.date)}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs">{entry.piece}</td>
                  <td className="px-4 py-2">{entry.label}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{entry.debit ? formatCurrency(entry.debit) : ""}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{entry.credit ? formatCurrency(entry.credit) : ""}</td>
                  <td className="px-4 py-2 text-center">
                    {letter ? (
                      <button
                        type="button"
                        onClick={() => handleUnmatch(letter)}
                        className="group relative inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        title="Délettrer"
                      >
                        <Badge variant="success">{letter}</Badge>
                        <Unlink className="size-3.5 opacity-0 group-hover:opacity-100" aria-hidden="true" />
                        <span className="sr-only">Délettrer {letter}</span>
                      </button>
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
