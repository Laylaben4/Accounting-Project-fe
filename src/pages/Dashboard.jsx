import { Link } from "react-router-dom";
import { CalendarDays, Download, FilePen, Link2, Receipt, TrendingUp } from "lucide-react";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHLY_REVENUE, RECENT_ENTRIES } from "@/data/mockData";
import { formatCompact } from "@/lib/utils";

const PERIOD = "1 avr. 2026 – 30 sept. 2026";
const totalRevenue = MONTHLY_REVENUE.reduce((sum, month) => sum + month.value, 0);

const TASKS = [
  { icon: FilePen, label: "Brouillons à corriger", count: 3, to: "/saisie" },
  { icon: Link2, label: "Écritures non lettrées", count: 7, to: "/lettrage" },
  { icon: Receipt, label: "Déclaration TVA — échéance 20/10", count: 1, to: "/grand-livre" },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <span className="inline-flex h-8 items-center gap-2 rounded-md border bg-card px-3 text-xs font-medium">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              6 derniers mois : {PERIOD}
            </span>
            <Button variant="outline" size="sm">
              <Download aria-hidden="true" /> Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Chiffre d'affaires HT</CardTitle>
            <CardDescription>{PERIOD}</CardDescription>
          </CardHeader>
          <CardContent className="grid items-end gap-4 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="text-3xl font-bold tracking-tight tabular-nums">{formatCompact(totalRevenue)} MAD</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="size-3.5" aria-hidden="true" /> +12,4 % vs 6 mois précédents
              </p>
            </div>
            <div className="h-28">
              <AreaChart data={MONTHLY_REVENUE} label="Évolution mensuelle du chiffre d'affaires" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Résumé</CardTitle>
            <CardDescription>{PERIOD}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricTile label="Résultat net" value="412K" highlighted />
            <MetricTile label="Charges" value="929K" />
            <MetricTile label="TVA à payer" value="48,6K" />
            <MetricTile label="Trésorerie" value="263K" />
          </CardContent>
        </Card>

        <RecentEntries entries={RECENT_ENTRIES} />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>À traiter</CardTitle>
            <CardDescription>Actions en attente sur le dossier</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-3">
              {TASKS.map(({ icon: Icon, label, count, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-sm">{label}</span>
                    <span className="text-lg font-semibold tabular-nums">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
