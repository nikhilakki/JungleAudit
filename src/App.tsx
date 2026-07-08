import { Lock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { SpendSummary } from "@/components/dashboard/SpendSummary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { SchemaPreview } from "@/components/upload/SchemaPreview";
import {
  fetchMonthlyTrend,
  fetchSpendSummary,
  type MonthlySpend,
  type SpendSummary as SpendSummaryData,
} from "@/lib/analytics/spend-trends";
import { detectCurrency, type CurrencyInfo } from "@/lib/currency";
import { useDuckDB } from "@/hooks/useDuckDB";

export default function App() {
  const { status, error, schemas, hasOrderData, uploadFiles } = useDuckDB();
  const [summary, setSummary] = useState<SpendSummaryData | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlySpend[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsError(null);
    try {
      const [spendSummary, trend, currencyInfo] = await Promise.all([
        fetchSpendSummary(),
        fetchMonthlyTrend(),
        detectCurrency(),
      ]);
      setSummary(spendSummary);
      setMonthlyTrend(trend);
      setCurrency(currencyInfo);
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    if (status === "ready" && hasOrderData) {
      void loadAnalytics();
    }
  }, [status, hasOrderData, loadAnalytics]);

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
          setMonthlyTrend([]);
          setCurrency(null);
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
          <SpendSummary summary={summary} currency={currency} />
          <Card>
            <CardHeader>
              <CardTitle>Monthly spend trend</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={monthlyTrend} currencyCode={currency.code} />
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}