import { cn } from "@/lib/utils";
import type { DateFilterPreset, DateFilterState } from "@/lib/analytics/date-filter";

interface DateRangeFilterProps {
  value: DateFilterState;
  yearOptions: number[];
  onChange: (next: DateFilterState) => void;
}

const PRESETS: Array<{ id: DateFilterPreset; label: string }> = [
  { id: "all", label: "All" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "custom", label: "Custom" },
];

const fieldClass =
  "h-10 rounded-xl border border-border bg-card px-3.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

export function DateRangeFilter({
  value,
  yearOptions,
  onChange,
}: DateRangeFilterProps) {
  const setPreset = (preset: DateFilterPreset) => {
    onChange({ ...value, preset });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isActive = value.preset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setPreset(preset.id)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:text-foreground",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {value.preset === "week" ? (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Select week</span>
          <input
            type="week"
            className={cn(fieldClass, "w-full max-w-xs")}
            value={value.week ?? ""}
            onChange={(event) =>
              onChange({ ...value, week: event.target.value || null })
            }
          />
        </label>
      ) : null}

      {value.preset === "month" ? (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Select month</span>
          <input
            type="month"
            className={cn(fieldClass, "w-full max-w-xs")}
            value={value.month ?? ""}
            onChange={(event) =>
              onChange({ ...value, month: event.target.value || null })
            }
          />
        </label>
      ) : null}

      {value.preset === "year" ? (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Select year</span>
          <select
            className={cn(fieldClass, "w-full max-w-xs")}
            value={value.year ?? ""}
            onChange={(event) =>
              onChange({ ...value, year: event.target.value || null })
            }
          >
            <option value="" disabled>
              Choose a year
            </option>
            {yearOptions.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {value.preset === "custom" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Start date</span>
            <input
              type="date"
              className={fieldClass}
              value={value.startDate ?? ""}
              onChange={(event) =>
                onChange({ ...value, startDate: event.target.value || null })
              }
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">End date</span>
            <input
              type="date"
              className={fieldClass}
              value={value.endDate ?? ""}
              onChange={(event) =>
                onChange({ ...value, endDate: event.target.value || null })
              }
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
