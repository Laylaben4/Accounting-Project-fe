import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FilePen, Link2, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DAILY_FINANCIALS, DATA_START_DATE, RECENT_ENTRIES } from "@/data/mockData";
import { downloadFile, toCSV } from "@/lib/csv";
import { DEFAULT_PRESET_ID, formatFileDate, formatRange, getPresetRange, getPreviousRange } from "@/lib/dateRange";
import { bucketize, filterByRange, GRANULARITY_LABELS, percentChange, summarize } from "@/lib/financials";
import { cn, formatCompact } from "@/lib/utils";

const TASKS = [
  { icon: FilePen, label: "Brouillons à corriger", count: 3, to: "/saisie" },
  { icon: Link2, label: "Écritures non lettrées", count: 7, to: "/lettrage" },
  { icon: Receipt, label: "Déclaration TVA — échéance 20/10", count: 1, to: "/grand-livre" },
];

const GRANULARITY_CHART_LABELS = { day: "jour", week: "semaine", month: "mois" };

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

function useDashboardData(range) {
  return useMemo(() => {
    const days = filterByRange(DAILY_FINANCIALS, range);
    const summary = summarize(days);
    const previous = summarize(filterByRange(DAILY_FINANCIALS, getPreviousRange(range)));
    const { granularity, buckets } = bucketize(days, range);
    return {
      summary,
      revenueChange: percentChange(summary.revenue, previous.revenue),
      granularity,
      buckets,
      chartData: buckets.map((bucket) => ({ key: bucket.key, label: bucket.label, value: bucket.revenue })),
    };
  }, [range]);
}

function RevenueTrend({ change }) {
  if (change === null) {
    return <p className="mt-1 text-xs text-muted-foreground">Pas de période précédente à comparer</p>;
  }
  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", up ? "text-success" : "text-destructive")}>
      <Icon className="size-3.5" aria-hidden="true" />
      {percentFormatter.format(change)} % vs période précédente
    </p>
  );
}

export default function Dashboard() {
  const [activeDateRange, setActiveDateRange] = useState(() => getPresetRange(DEFAULT_PRESET_ID));
  const { summary, revenueChange, granularity, buckets, chartData } = useDashboardData(activeDateRange);
  const periodLabel = formatRange(activeDateRange);

  const handleExport = () => {
    const header = [GRANULARITY_LABELS[granularity], "Chiffre d'affaires HT (MAD)", "Charges (MAD)", "Résultat (MAD)"];
    const rows = buckets.map((bucket) => [
      bucket.exportLabel,
      bucket.revenue,
      bucket.charges,
      bucket.revenue - bucket.charges,
    ]);
    rows.push(["Total", summary.revenue, summary.charges, summary.netResult]);

    const { startDate, endDate } = activeDateRange;
    downloadFile(
      toCSV(header, rows),
      `export_chiffre_daffaires_${formatFileDate(startDate)}_${formatFileDate(endDate)}.csv`
    );
  };

  return (
    <>
      <PageHeader
        actions={
          <>
            <DateRangePicker value={activeDateRange} onChange={setActiveDateRange} minDate={DATA_START_DATE} />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download aria-hidden="true" /> Exporter
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Chiffre d'affaires HT</CardTitle>
            <CardDescription>{periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className="grid items-end gap-4 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="text-3xl font-bold tracking-tight tabular-nums">{formatCompact(summary.revenue)} MAD</p>
              <RevenueTrend change={revenueChange} />
            </div>
            <div className="h-28">
              <AreaChart
                data={chartData}
                label={`Chiffre d'affaires HT par ${GRANULARITY_CHART_LABELS[granularity]}, ${periodLabel}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm">Résumé</CardTitle>
            <CardDescription>{periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricTile label="Résultat net" value={formatCompact(summary.netResult)} highlighted />
            <MetricTile label="Charges" value={formatCompact(summary.charges)} />
            <MetricTile label="TVA à payer" value={formatCompact(summary.vatDue)} />
            <MetricTile label="Factures émises" value={summary.invoices} />
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
