import { cn } from "@/lib/utils";

export function MetricTile({ label, value, highlighted = false }) {
  return (
    <div className={cn("border-b-2 pb-3", highlighted ? "border-primary" : "border-transparent")}>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
