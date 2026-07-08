import { formatCurrency, type CurrencyInfo } from "@/lib/currency";
import type { RefundSummary } from "@/lib/analytics/returns";

interface NetSpendSummaryProps {
  grossSpend: number;
  refundSummary: RefundSummary | null;
  currency: CurrencyInfo;
  replacementCount: number;
}

export function NetSpendSummary({
  grossSpend,
  refundSummary,
  currency,
  replacementCount,
}: NetSpendSummaryProps) {
  const refunded = refundSummary?.total_refunded ?? 0;
  const net = grossSpend - refunded;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Gross spend</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {formatCurrency(grossSpend, currency.code)}
        </p>
      </div>

      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Refunded</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-destructive md:text-4xl">
          {formatCurrency(refunded, currency.code)}
        </p>
        {refundSummary ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {refundSummary.refund_count.toLocaleString()} refund events
            {refundSummary.return_rate_pct !== null
              ? ` · ${refundSummary.return_rate_pct}% of orders`
              : ""}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Upload returns/refund CSVs to see refunds
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-muted p-6 md:p-7">
        <p className="text-sm font-medium text-muted-foreground">Net spend</p>
        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          {formatCurrency(net, currency.code)}
        </p>
        {replacementCount > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {replacementCount.toLocaleString()} replacement orders on file
          </p>
        ) : null}
      </div>
    </div>
  );
}
