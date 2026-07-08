import type { ResolvedDateFilter } from "@/lib/analytics/date-filter";
import { buildDateSqlClause } from "@/lib/analytics/date-filter";
import { runQuery } from "@/lib/duckdb";

export interface PaymentBreakdownRow {
  payment_method: string;
  order_count: number;
  spend: number;
}

const ACTIVE_ORDER_FILTER = `
  order_date IS NOT NULL
  AND price IS NOT NULL
  AND payment_method IS NOT NULL
  AND trim(payment_method) <> ''
  AND lower(trim(payment_method)) NOT IN ('not applicable', 'not available')
  AND (order_status IS NULL OR lower(order_status) NOT LIKE '%cancel%')
`;

export async function fetchPaymentBreakdown(
  filter: ResolvedDateFilter,
): Promise<PaymentBreakdownRow[]> {
  const dateClause = buildDateSqlClause(filter);

  const rows = await runQuery<{
    payment_method: string;
    order_count: number | null;
    spend: number | null;
  }>(`
    SELECT
      trim(payment_method) AS payment_method,
      COUNT(DISTINCT order_id)::INTEGER AS order_count,
      SUM(COALESCE(price, 0) * COALESCE(quantity, 1)) AS spend
    FROM canonical_all_orders
    WHERE ${ACTIVE_ORDER_FILTER}${dateClause}
    GROUP BY 1
    ORDER BY spend DESC
    LIMIT 12
  `);

  return rows.map((row) => ({
    payment_method: row.payment_method,
    order_count: row.order_count ?? 0,
    spend: row.spend ?? 0,
  }));
}