import type { ResolvedDateFilter } from "@/lib/analytics/date-filter";
import { buildDateSqlClause } from "@/lib/analytics/date-filter";
import { runQuery } from "@/lib/duckdb";

export interface RefundSummary {
  total_refunded: number;
  refund_count: number;
  return_rate_pct: number | null;
}

export interface RefundTrendPoint {
  period: string;
  refunded: number;
}

export interface ReturnReasonRow {
  reason: string;
  count: number;
  amount: number;
}

async function viewExists(name: string): Promise<boolean> {
  const rows = await runQuery<{ cnt: number }>(`
    SELECT COUNT(*)::INTEGER AS cnt
    FROM information_schema.tables
    WHERE table_name = '${name}'
  `);
  return (rows[0]?.cnt ?? 0) > 0;
}

export async function fetchRefundSummary(
  filter: ResolvedDateFilter,
  orderCount: number,
): Promise<RefundSummary | null> {
  if (!(await viewExists("canonical_all_refunds"))) return null;

  const dateClause = buildDateSqlClause(filter, "refund_date");

  const rows = await runQuery<{
    total_refunded: number | null;
    refund_count: number | null;
  }>(`
    SELECT
      SUM(refund_amount) AS total_refunded,
      COUNT(*)::INTEGER AS refund_count
    FROM canonical_all_refunds
    WHERE refund_amount IS NOT NULL
      AND refund_amount > 0
      AND refund_date IS NOT NULL${dateClause}
  `);

  const total = rows[0]?.total_refunded ?? 0;
  const count = rows[0]?.refund_count ?? 0;

  return {
    total_refunded: total,
    refund_count: count,
    return_rate_pct:
      orderCount > 0 ? Math.round((count / orderCount) * 1000) / 10 : null,
  };
}

export async function fetchRefundTrend(
  filter: ResolvedDateFilter,
): Promise<RefundTrendPoint[]> {
  if (!(await viewExists("canonical_all_refunds"))) return [];

  const dateClause = buildDateSqlClause(filter, "refund_date");
  const trunc = filter.granularity;

  const rows = await runQuery<{
    period: string;
    refunded: number | null;
  }>(`
    SELECT
      CAST(DATE_TRUNC('${trunc}', refund_date) AS VARCHAR) AS period,
      SUM(refund_amount) AS refunded
    FROM canonical_all_refunds
    WHERE refund_amount IS NOT NULL
      AND refund_amount > 0
      AND refund_date IS NOT NULL${dateClause}
    GROUP BY 1
    ORDER BY 1
  `);

  return rows.map((row) => ({
    period: row.period,
    refunded: row.refunded ?? 0,
  }));
}

export async function fetchReturnReasons(
  filter: ResolvedDateFilter,
): Promise<ReturnReasonRow[]> {
  if (!(await viewExists("canonical_all_refunds"))) return [];

  const dateClause = buildDateSqlClause(filter, "refund_date");

  const rows = await runQuery<{
    reason: string;
    count: number | null;
    amount: number | null;
  }>(`
    SELECT
      COALESCE(NULLIF(trim(return_reason), ''), 'Unknown') AS reason,
      COUNT(*)::INTEGER AS count,
      SUM(refund_amount) AS amount
    FROM canonical_all_refunds
    WHERE refund_amount IS NOT NULL
      AND refund_amount > 0
      AND refund_date IS NOT NULL${dateClause}
    GROUP BY 1
    ORDER BY amount DESC
    LIMIT 10
  `);

  return rows.map((row) => ({
    reason: row.reason,
    count: row.count ?? 0,
    amount: row.amount ?? 0,
  }));
}

export async function fetchReplacementCount(): Promise<number> {
  if (!(await viewExists("canonical_replacement_orders"))) return 0;

  const rows = await runQuery<{ count: number }>(`
    SELECT COUNT(*)::INTEGER AS count FROM canonical_replacement_orders
  `);
  return rows[0]?.count ?? 0;
}