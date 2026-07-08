import { formatCurrency, type CurrencyInfo } from "@/lib/currency";
import type { SpendSummary as SpendSummaryData } from "@/lib/analytics/spend-trends";

interface SpendSummaryProps {
  summary: SpendSummaryData;
  currency: CurrencyInfo;
}

function formatDateRange(min: string | null, max: string | null): string | null {
  if (!min || !max) return null;
  const start = new Date(min);
  const end = new Date(max);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function SpendSummary({ summary, currency }: SpendSummaryProps) {
  const dateRange = formatDateRange(summary.min_date, summary.max_date);
  const currencyNote =
    currency.source === "fallback"
      ? "Currency inferred (amazon.in default)"
      : currency.source === "symbol"
        ? "Currency inferred from price symbols"
        : "Currency from export data";

  const aov =
    summary.order_count > 0 ? summary.total_spend / summary.order_count : null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Total spend</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {formatCurrency(summary.total_spend, currency.code)}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{currencyNote}</p>
      </div>

      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Orders</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {summary.order_count.toLocaleString()}
        </p>
        {dateRange ? (
          <p className="mt-3 text-sm text-muted-foreground">{dateRange}</p>
        ) : null}
        {summary.skipped_rows > 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {summary.skipped_rows.toLocaleString()} rows skipped (missing date/price or cancelled)
          </p>
        ) : null}
      </div>

      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Avg order value</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {aov !== null ? formatCurrency(aov, currency.code) : "—"}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Total spend divided by distinct orders
        </p>
      </div>
    </div>
  );
}
