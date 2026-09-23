import { useId, useState } from "react";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { inputClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CUSTOM_PRESET_LABEL,
  DATE_PRESETS,
  formatRange,
  getPresetRange,
  todayISO,
  validateCustomRange,
} from "@/lib/dateRange";
import { cn } from "@/lib/utils";

const DATE_FIELD_CLASS = cn(inputClassName, "h-8 px-2 text-xs");

/**
 * @param value    { startDate, endDate, presetLabel } — ISO dates, owned by the parent.
 * @param onChange Called with a new range object of the same shape.
 * @param minDate  Earliest selectable date (e.g. first day with data).
 */
export function DateRangePicker({ value, onChange, minDate }) {
  const id = useId();
  const today = todayISO();
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [draft, setDraft] = useState({ startDate: value.startDate, endDate: value.endDate });

  const error = showCustom ? validateCustomRange(draft, { today, minDate }) : null;
  const errorId = `${id}-error`;

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setShowCustom(value.presetLabel === CUSTOM_PRESET_LABEL);
      setDraft({ startDate: value.startDate, endDate: value.endDate });
    }
  };

  const handleSelectPreset = (preset) => {
    if (preset.id === "custom") {
      setShowCustom(true);
      return;
    }
    onChange(getPresetRange(preset.id));
    setOpen(false);
  };

  const handleApplyCustom = (event) => {
    event.preventDefault();
    if (error) return;
    onChange({ ...draft, presetLabel: CUSTOM_PRESET_LABEL });
    setOpen(false);
  };

  const isActive = (preset) =>
    showCustom ? preset.id === "custom" : preset.label === value.presetLabel;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>
            {value.presetLabel} : <span className="tabular-nums">{formatRange(value)}</span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72">
        <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">Période</p>
        <ul aria-label="Périodes prédéfinies">
          {DATE_PRESETS.map((preset) => {
            const active = isActive(preset);
            return (
              <li key={preset.id}>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none",
                    active && "font-medium text-primary"
                  )}
                >
                  {preset.label}
                  {active && <Check className="size-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>

        {showCustom && (
          <form onSubmit={handleApplyCustom} className="mt-1 space-y-3 border-t border-gray-200 px-2 pb-2 pt-3" noValidate>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`${id}-start`} className="text-xs">
                  Du
                </Label>
                <DateInput
                  id={`${id}-start`}
                  inputClassName={DATE_FIELD_CLASS}
                  value={draft.startDate}
                  min={minDate}
                  max={draft.endDate && draft.endDate < today ? draft.endDate : today}
                  onChange={(iso) => setDraft((d) => ({ ...d, startDate: iso }))}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-end`} className="text-xs">
                  Au
                </Label>
                <DateInput
                  id={`${id}-end`}
                  inputClassName={DATE_FIELD_CLASS}
                  value={draft.endDate}
                  min={draft.startDate || minDate}
                  max={today}
                  onChange={(iso) => setDraft((d) => ({ ...d, endDate: iso }))}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  required
                />
              </div>
            </div>

            {error && (
              <p id={errorId} role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="sm" className="w-full" disabled={Boolean(error)}>
              Appliquer
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
