import { Lock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { SupportProject } from "@/components/layout/SupportProject";
import { BorrowingCharts } from "@/components/dashboard/BorrowingCharts";
import { DataCoveragePanel } from "@/components/dashboard/DataCoveragePanel";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { NetSpendSummary } from "@/components/dashboard/NetSpendSummary";
import { PaymentBreakdownChart } from "@/components/dashboard/PaymentBreakdownChart";
import { RefundTrendChart } from "@/components/dashboard/RefundTrendChart";
import { ReturnReasonsChart } from "@/components/dashboard/ReturnReasonsChart";
import { SpendSummary } from "@/components/dashboard/SpendSummary";
import { SpendTrendChart } from "@/components/dashboard/SpendTrendChart";
import { SqlConsole } from "@/components/dashboard/SqlConsole";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { SchemaPreview } from "@/components/upload/SchemaPreview";
import {
  fetchBorrowingByType,
  fetchBorrowingSummary,
  fetchBorrowingTrend,
  type BorrowingSummary,
} from "@/lib/analytics/borrowing";
import {
  DEFAULT_DATE_FILTER,
  dateFilterFromDataBounds,
  listYearOptions,
  resolveDateFilter,
  type DateFilterState,
} from "@/lib/analytics/date-filter";
import {
  fetchPaymentBreakdown,
  type PaymentBreakdownRow,
} from "@/lib/analytics/payments";
import {
  fetchRefundSummary,
  fetchRefundTrend,
  fetchReplacementCount,
  fetchReturnReasons,
  type RefundSummary,
  type RefundTrendPoint,
  type ReturnReasonRow,
} from "@/lib/analytics/returns";
import {
  fetchDataBounds,
  fetchSpendSummary,
  fetchSpendTrend,
  type PeriodSpend,
  type SpendSummary as SpendSummaryData,
} from "@/lib/analytics/spend-trends";
import { getAvailableInsights } from "@/lib/data-insights";
import { detectCurrency, type CurrencyInfo } from "@/lib/currency";
import { useDuckDB } from "@/hooks/useDuckDB";

interface ChartPanelProps {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}

/** Finsage gray panel with a white sub-card holding the chart. */
function ChartPanel({ title, meta, children }: ChartPanelProps) {
  return (
    <section className="rounded-3xl bg-muted p-5 md:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-extrabold tracking-tight">{title}</h2>
        {meta}
      </div>
      <div className="rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] md:p-5">
        {children}
      </div>
    </section>
  );
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      {children}
    </span>
  );
}

export function HomePage() {
  const { status, error, schemas, hasOrderData, uploadFiles, resetData } =
    useDuckDB();
  const [summary, setSummary] = useState<SpendSummaryData | null>(null);
  const [trend, setTrend] = useState<PeriodSpend[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterState>(DEFAULT_DATE_FILTER);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [resolvedFilterLabel, setResolvedFilterLabel] = useState("All time");

  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdownRow[]>([]);
  const [refundSummary, setRefundSummary] = useState<RefundSummary | null>(null);
  const [refundTrend, setRefundTrend] = useState<RefundTrendPoint[]>([]);
  const [returnReasons, setReturnReasons] = useState<ReturnReasonRow[]>([]);
  const [replacementCount, setReplacementCount] = useState(0);
  const [borrowingSummary, setBorrowingSummary] = useState<BorrowingSummary | null>(
    null,
  );
  const [borrowingByType, setBorrowingByType] = useState<
    Awaited<ReturnType<typeof fetchBorrowingByType>>
  >([]);
  const [borrowingTrend, setBorrowingTrend] = useState<
    Awaited<ReturnType<typeof fetchBorrowingTrend>>
  >([]);

  const insights = useMemo(() => getAvailableInsights(schemas), [schemas]);
  const insightIds = useMemo(() => new Set(insights.map((i) => i.id)), [insights]);

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

      const [
        payments,
        refunds,
        refundSeries,
        reasons,
        replacements,
        borrowSummary,
        borrowTypes,
        borrowTrend,
      ] = await Promise.all([
        fetchPaymentBreakdown(resolved),
        fetchRefundSummary(resolved, spendSummary.order_count),
        fetchRefundTrend(resolved),
        fetchReturnReasons(resolved),
        fetchReplacementCount(),
        fetchBorrowingSummary(),
        fetchBorrowingByType(),
        fetchBorrowingTrend(resolved),
      ]);

      setPaymentBreakdown(payments);
      setRefundSummary(refunds);
      setRefundTrend(refundSeries);
      setReturnReasons(reasons);
      setReplacementCount(replacements);
      setBorrowingSummary(borrowSummary);
      setBorrowingByType(borrowTypes);
      setBorrowingTrend(borrowTrend);
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
    <div className="flex flex-col gap-10 md:gap-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
        <Mascot size="lg" className="sm:mt-2" />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
            Analyzer
          </p>
          <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl">
            Your Amazon Spending. Analyzed Locally.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Drop your Amazon &quot;Request My Data&quot; export. Analysis runs entirely in
            your browser.
          </p>
          <Alert className="flex items-start gap-3 rounded-2xl border-0 bg-accent p-5 shadow-none">
            <Lock className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
            <div className="flex flex-col gap-1">
              <AlertTitle className="font-semibold">Privacy-first</AlertTitle>
              <AlertDescription>
                Your data never leaves this device. No uploads, no accounts, no server.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </header>

      <FileDropzone
        disabled={isBusy}
        onFilesSelected={async (files) => {
          setSummary(null);
          setTrend([]);
          setCurrency(null);
          setPaymentBreakdown([]);
          setRefundSummary(null);
          setDateFilter(DEFAULT_DATE_FILTER);
          await uploadFiles(files);
        }}
      />

      {isBusy ? (
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-5 py-4 text-sm text-muted-foreground">
          <div className="relative shrink-0">
            <Mascot size="sm" decorative className="opacity-80" />
            <Loader2 className="absolute -bottom-1 -right-1 size-4 animate-spin rounded-full bg-muted text-primary" />
          </div>
          <p>
            {status === "initializing"
              ? "Starting analysis engine..."
              : "Importing files and inspecting schema..."}
          </p>
        </div>
      ) : null}

      {error ? (
        <Alert className="rounded-2xl border-0 bg-destructive/10 p-5 shadow-none">
          <AlertTitle className="font-semibold text-destructive">
            Something went wrong
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {status === "ready" && !hasOrderData ? (
        <Alert className="rounded-2xl border-0 bg-muted p-5 shadow-none">
          <AlertTitle className="font-semibold">No order files detected</AlertTitle>
          <AlertDescription>
            Upload at least Order History.csv or Digital Content Orders.csv to see spend
            metrics. Returns, cart, and borrowing files add more insights when included.
          </AlertDescription>
        </Alert>
      ) : null}

      {analyticsError ? (
        <Alert className="rounded-2xl border-0 bg-destructive/10 p-5 shadow-none">
          <AlertTitle className="font-semibold text-destructive">
            Analytics error
          </AlertTitle>
          <AlertDescription>{analyticsError}</AlertDescription>
        </Alert>
      ) : null}

      {summary && currency ? (
        <section className="flex flex-col gap-8 md:gap-10">
          {schemas.length > 0 ? <DataCoveragePanel schemas={schemas} /> : null}

          <section className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <span
                className="size-1.5 rounded-full bg-foreground"
                aria-hidden="true"
              />
              Date range
            </h2>
            <DateRangeFilter
              value={dateFilter}
              yearOptions={yearOptions}
              onChange={handleDateFilterChange}
            />
          </section>

          <SpendSummary summary={summary} currency={currency} />

          {insightIds.has("refunds") ? (
            <NetSpendSummary
              grossSpend={summary.total_spend}
              refundSummary={refundSummary}
              currency={currency}
              replacementCount={replacementCount}
            />
          ) : null}

          <ChartPanel
            title="Spend trend"
            meta={<MetaChip>{resolvedFilterLabel}</MetaChip>}
          >
            <SpendTrendChart
              data={trend}
              currencyCode={currency.code}
              granularity={resolveDateFilter(dateFilter).granularity}
            />
          </ChartPanel>

          {insightIds.has("payments") && paymentBreakdown.length > 0 ? (
            <ChartPanel title="Payment methods">
              <PaymentBreakdownChart
                data={paymentBreakdown}
                currencyCode={currency.code}
              />
            </ChartPanel>
          ) : null}

          {insightIds.has("refunds") ? (
            <>
              <ChartPanel title="Refund trend">
                <RefundTrendChart
                  data={refundTrend}
                  currencyCode={currency.code}
                  granularity={resolveDateFilter(dateFilter).granularity}
                />
              </ChartPanel>

              {returnReasons.length > 0 ? (
                <ChartPanel title="Top return reasons">
                  <ReturnReasonsChart
                    data={returnReasons}
                    currencyCode={currency.code}
                  />
                </ChartPanel>
              ) : null}
            </>
          ) : null}

          {insightIds.has("borrowing") && borrowingSummary ? (
            <ChartPanel
              title="Digital borrowing"
              meta={
                <MetaChip>
                  {borrowingSummary.total_borrows.toLocaleString()} total
                  {borrowingSummary.active_borrows > 0
                    ? ` · ${borrowingSummary.active_borrows} active`
                    : ""}
                  {borrowingSummary.top_program
                    ? ` · ${borrowingSummary.top_program}`
                    : ""}
                </MetaChip>
              }
            >
              <BorrowingCharts
                byType={borrowingByType}
                trend={borrowingTrend}
                granularity={resolveDateFilter(dateFilter).granularity}
              />
            </ChartPanel>
          ) : null}
        </section>
      ) : schemas.length > 0 ? (
        <DataCoveragePanel schemas={schemas} />
      ) : null}

      {schemas.length > 0 ? (
        <SqlConsole schemas={schemas} busy={isBusy} onResetData={resetData} />
      ) : null}

      {schemas.length > 0 ? <SchemaPreview schemas={schemas} /> : null}

      <SupportProject variant="compact" />
    </div>
  );
}
