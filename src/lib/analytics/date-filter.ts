export type DateFilterPreset = "all" | "week" | "month" | "year" | "custom";

export type TrendGranularity = "day" | "week" | "month" | "year";

export interface DateFilterState {
  preset: DateFilterPreset;
  week: string | null;
  month: string | null;
  year: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ResolvedDateFilter {
  start: string | null;
  end: string | null;
  granularity: TrendGranularity;
  label: string;
}

export const DEFAULT_DATE_FILTER: DateFilterState = {
  preset: "all",
  week: null,
  month: null,
  year: null,
  startDate: null,
  endDate: null,
};

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDataDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isoWeekValue(date: Date): string {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function monthValue(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isoWeekRange(weekValue: string): { start: string; end: string } | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekValue);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  const monday = new Date(mondayWeek1);
  monday.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return { start: formatIsoDate(monday), end: formatIsoDate(sunday) };
}

function monthRange(monthValue: string): { start: string; end: string } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(monthValue);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start: formatIsoDate(start), end: formatIsoDate(end) };
}

function yearRange(yearValue: string): { start: string; end: string } | null {
  if (!/^\d{4}$/.test(yearValue)) return null;
  return { start: `${yearValue}-01-01`, end: `${yearValue}-12-31` };
}

function daySpan(start: string, end: string): number {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  const endMs = Date.parse(`${end}T00:00:00Z`);
  return Math.max(1, Math.round((endMs - startMs) / 86400000) + 1);
}

function granularityForRange(
  preset: DateFilterPreset,
  start: string | null,
  end: string | null,
): TrendGranularity {
  if (preset === "year") return "month";
  if (preset === "month") return "day";
  if (preset === "week") return "day";
  if (start && end) {
    const span = daySpan(start, end);
    if (span <= 31) return "day";
    if (span <= 120) return "week";
    if (span <= 730) return "month";
    return "year";
  }
  return "month";
}

export function dateFilterFromDataBounds(bounds: {
  min: string | null;
  max: string | null;
}): Partial<DateFilterState> {
  const maxDate = parseDataDate(bounds.max);
  if (!maxDate) return {};

  return {
    week: isoWeekValue(maxDate),
    month: monthValue(maxDate),
    year: String(maxDate.getFullYear()),
    startDate: bounds.min?.slice(0, 10) ?? null,
    endDate: bounds.max?.slice(0, 10) ?? null,
  };
}

export function listYearOptions(bounds: {
  min: string | null;
  max: string | null;
}): number[] {
  const minDate = parseDataDate(bounds.min);
  const maxDate = parseDataDate(bounds.max);
  if (!minDate || !maxDate) return [];

  const years: number[] = [];
  for (let year = maxDate.getFullYear(); year >= minDate.getFullYear(); year -= 1) {
    years.push(year);
  }
  return years;
}

export function resolveDateFilter(state: DateFilterState): ResolvedDateFilter {
  if (state.preset === "all") {
    return {
      start: null,
      end: null,
      granularity: "month",
      label: "All time",
    };
  }

  if (state.preset === "week" && state.week) {
    const range = isoWeekRange(state.week);
    if (range) {
      return {
        start: range.start,
        end: range.end,
        granularity: "day",
        label: `Week ${state.week}`,
      };
    }
  }

  if (state.preset === "month" && state.month) {
    const range = monthRange(state.month);
    if (range) {
      const [year, month] = state.month.split("-");
      const monthLabel = new Date(Number(year), Number(month) - 1, 1).toLocaleString(
        undefined,
        { month: "long", year: "numeric" },
      );
      return {
        start: range.start,
        end: range.end,
        granularity: "day",
        label: monthLabel,
      };
    }
  }

  if (state.preset === "year" && state.year) {
    const range = yearRange(state.year);
    if (range) {
      return {
        start: range.start,
        end: range.end,
        granularity: "month",
        label: state.year,
      };
    }
  }

  if (state.preset === "custom" && state.startDate && state.endDate) {
    const start = state.startDate <= state.endDate ? state.startDate : state.endDate;
    const end = state.startDate <= state.endDate ? state.endDate : state.startDate;
    return {
      start,
      end,
      granularity: granularityForRange("custom", start, end),
      label: `${start} – ${end}`,
    };
  }

  return {
    start: null,
    end: null,
    granularity: "month",
    label: "All time",
  };
}

export function buildDateSqlClause(
  filter: ResolvedDateFilter,
  column = "order_date",
): string {
  const parts: string[] = [];
  if (filter.start) {
    parts.push(`${column} >= TIMESTAMP '${filter.start} 00:00:00'`);
  }
  if (filter.end) {
    const endExclusive = formatIsoDate(
      new Date(Date.parse(`${filter.end}T00:00:00Z`) + 86400000),
    );
    parts.push(`${column} < TIMESTAMP '${endExclusive} 00:00:00'`);
  }
  return parts.length > 0 ? ` AND ${parts.join(" AND ")}` : "";
}