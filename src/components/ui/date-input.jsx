import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

/** "2026-09-23" -> "23/09/2026" */
export function isoToFr(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

/** "23/09/2026" -> "2026-09-23", or "" when incomplete or not a real calendar date. */
export function frToIso(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return "";
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? `${match[3]}-${match[2]}-${match[1]}` : "";
}

function maskDate(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * French date field (JJ/MM/AAAA). Native <input type="date"> renders its placeholder in the browser's
 * locale (e.g. mm/dd/yyyy), so the text is typed here and the native picker is only used as a popup.
 * `value` / `onChange` use ISO "YYYY-MM-DD"; incomplete input reports "".
 */
export function DateInput({ value, onChange, min, max, className, inputClassName, "aria-invalid": ariaInvalid, ...props }) {
  const pickerRef = useRef(null);
  const [text, setText] = useState(() => isoToFr(value));
  const [syncedValue, setSyncedValue] = useState(value);

  // Adopt external changes (reset, restored draft) without clobbering a partially typed date.
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (value !== frToIso(text)) setText(isoToFr(value));
  }

  const handleTextChange = (event) => {
    const next = maskDate(event.target.value);
    setText(next);
    onChange(frToIso(next));
  };

  const handlePickerChange = (event) => {
    setText(isoToFr(event.target.value));
    onChange(event.target.value);
  };

  const isMalformed = text.length === 10 && !frToIso(text);

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="JJ/MM/AAAA"
        maxLength={10}
        value={text}
        onChange={handleTextChange}
        aria-invalid={ariaInvalid || isMalformed || undefined}
        className={cn(inputClassName, "min-w-0 flex-1 pr-8 tabular-nums")}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => pickerRef.current?.showPicker?.()}
        className="absolute right-1 inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-gray-100 hover:text-foreground"
        aria-hidden="true"
      >
        <CalendarDays className="size-3.5" />
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        min={min}
        max={max}
        onChange={handlePickerChange}
        className="pointer-events-none absolute bottom-0 right-0 size-px opacity-0"
      />
    </div>
  );
}
