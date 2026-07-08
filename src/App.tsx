import { Lock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { SpendSummary } from "@/components/dashboard/SpendSummary";
import { SpendTrendChart } from "@/components/dashboard/SpendTrendChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { SchemaPreview } from "@/components/upload/SchemaPreview";
import {
  DEFAULT_DATE_FILTER,
  dateFilterFromDataBounds,
  listYearOptions,
  resolveDateFilter,
  type DateFilterState,
} from "@/lib/analytics/date-filter";
import {
  fetchDataBounds,
  fetchSpendSummary,
  fetchSpendTrend,
  type PeriodSpend,
  type SpendSummary as SpendSummaryData,
} from "@/lib/analytics/spend-trends";
import { detectCurrency, type CurrencyInfo } from "@/lib/currency";
import { useDuckDB } from "@/hooks/useDuckDB";

export default function App() {
  const { status, error, schemas, hasOrderData, uploadFiles } = useDuckDB();
  const [summary, setSummary] = useState<SpendSummaryData | null>(null);
  const [trend, setTrend] = useState<PeriodSpend[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterState>(DEFAULT_DATE_FILTER);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [resolvedFilterLabel, setResolvedFilterLabel] = useState("All time");

  const loadAnalytics = useCallback(async (filterState: DateFilterState) => {
    setAnalyticsError(null);
    try {
      const bounds = await fetchDataBounds();
      const resolved = resolveDateFilter(filterState);
      setResolvedFilterLabel(resolved.label);
      setYearOptions(
        listYearOptions({ min: bounds.min_date, max: bounds.max_date }),
      );

      const [spendSummary, trendData, currencyInfo] = await Promise.all([
        fetchSpendSummary(resolved),
        fetchSpendTrend(resolved),
        detectCurrency(),
      ]);
      setSummary(spendSummary);
      setTrend(trendData);
      setCurrency(currencyInfo);
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    if (status === "ready" && hasOrderData) {
      void (async () => {
        const bounds = await fetchDataBounds();
        const seeded = {
          ...DEFAULT_DATE_FILTER,
          ...dateFilterFromDataBounds({
            min: bounds.min_date,
            max: bounds.max_date,
          }),
        };
        setDateFilter(seeded);
        await loadAnalytics(seeded);
      })();
    }
  }, [status, hasOrderData, loadAnalytics]);

  const handleDateFilterChange = useCallback(
    (next: DateFilterState) => {
      setDateFilter(next);
      void loadAnalytics(next);
    },
    [loadAnalytics],
  );

  const isBusy = status === "initializing" || status === "ingesting";

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          JungleAudit
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Your Amazon spending, analyzed locally
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Drop your Amazon &quot;Request My Data&quot; export. Analysis runs entirely in
          your browser.
        </p>
        <Alert className="flex items-start gap-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <AlertTitle>Privacy-first</AlertTitle>
            <AlertDescription>
              Your data never leaves this device. No uploads, no accounts, no server.
            </AlertDescription>
          </div>
        </Alert>
      </header>

      <FileDropzone
        disabled={isBusy}
        onFilesSelected={async (files) => {
          setSummary(null);
          setTrend([]);
          setCurrency(null);
          setDateFilter(DEFAULT_DATE_FILTER);
          await uploadFiles(files);
        }}
      />

      {isBusy ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {status === "initializing"
            ? "Starting analysis engine..."
            : "Importing files and inspecting schema..."}
        </div>
      ) : null}

      {error ? (
        <Alert className="border-destructive/40">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {schemas.length > 0 ? <SchemaPreview schemas={schemas} /> : null}

      {status === "ready" && !hasOrderData ? (
        <Alert>
          <AlertTitle>No order files detected</AlertTitle>
          <AlertDescription>
            Upload at least Order History.csv or Digital Content Orders.csv to see
            spend metrics.
          </AlertDescription>
        </Alert>
      ) : null}

      {analyticsError ? (
        <Alert className="border-destructive/40">
          <AlertTitle>Analytics error</AlertTitle>
          <AlertDescription>{analyticsError}</AlertDescription>
        </Alert>
      ) : null}

      {summary && currency ? (
        <section className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Date range</CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangeFilter
                value={dateFilter}
                yearOptions={yearOptions}
                onChange={handleDateFilterChange}
              />
            </CardContent>
          </Card>

          <SpendSummary summary={summary} currency={currency} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Spend trend</CardTitle>
              <p className="text-sm text-muted-foreground">{resolvedFilterLabel}</p>
            </CardHeader>
            <CardContent>
              <SpendTrendChart
                data={trend}
                currencyCode={currency.code}
                granularity={resolveDateFilter(dateFilter).granularity}
              />
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}