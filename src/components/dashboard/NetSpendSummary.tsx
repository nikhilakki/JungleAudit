import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle>Gross spend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">
            {formatCurrency(grossSpend, currency.code)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refunded</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">
            {formatCurrency(refunded, currency.code)}
          </p>
          {refundSummary ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {refundSummary.refund_count.toLocaleString()} refund events
              {refundSummary.return_rate_pct !== null
                ? ` · ${refundSummary.return_rate_pct}% of orders`
                : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Upload returns/refund CSVs to see refunds
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net spend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">
            {formatCurrency(net, currency.code)}
          </p>
          {replacementCount > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {replacementCount.toLocaleString()} replacement orders on file
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}