import { memo, useId } from "react";

const WIDTH = 600;
const HEIGHT = 160;
const PADDING = { top: 12, right: 16, bottom: 24, left: 16 };
const MAX_X_LABELS = 7;

/**
 * Dependency-free SVG area chart; enough for a KPI sparkline without shipping a charting library.
 * @param data [{ key, label, value }]
 */
export const AreaChart = memo(function AreaChart({ data, label }) {
  const gradientId = useId();
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.85;
  const span = max - min || 1;
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const baseline = PADDING.top + innerH;
  const labelStep = Math.ceil(data.length / MAX_X_LABELS);

  const points = data.map((d, i) => ({
    ...d,
    x: PADDING.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: PADDING.top + innerH - ((d.value - min) / span) * innerH,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points.at(-1).x},${baseline} L${points[0].x},${baseline} Z`;
  const last = points.at(-1);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="4.5" fill="var(--primary)" stroke="white" strokeWidth="2" />
      {points.map((p, i) =>
        i % labelStep === 0 ? (
          <text key={p.key} x={p.x} y={HEIGHT - 4} textAnchor="middle" className="fill-slate-400 text-[11px]">
            {p.label}
          </text>
        ) : null
      )}
    </svg>
  );
});
