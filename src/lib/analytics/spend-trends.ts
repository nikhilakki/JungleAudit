import type { ResolvedDateFilter } from "@/lib/analytics/date-filter";
import { buildDateSqlClause } from "@/lib/analytics/date-filter";
import { runQuery } from "@/lib/duckdb";

export interface SpendSummary {
  total_spend: number;
  order_count: number;
  min_date: string | null;
  max_date: string | null;
  skipped_rows: number;
}

export interface PeriodSpend {
  period: string;
  spend: number;
}

const ACTIVE_ORDER_FILTER = `
  order_date IS NOT NULL
  AND price IS NOT NULL
  AND (order_status IS NULL OR lower(order_status) NOT LIKE '%cancel%')
`;

export async function fetchDataBounds(): Promise<{
  min_date: string | null;
  max_date: string | null;
}> {
  const rows = await runQuery<{
    min_date: string | null;
    max_date: string | null;
  }>(`
    SELECT
      CAST(MIN(order_date) AS VARCHAR) AS min_date,
      CAST(MAX(order_date) AS VARCHAR) AS max_date
    FROM canonical_all_orders
    WHERE ${ACTIVE_ORDER_FILTER}
  `);

  return {
    min_date: rows[0]?.min_date ?? null,
    max_date: rows[0]?.max_date ?? null,
  };
}

export async function fetchSpendSummary(
  filter: ResolvedDateFilter,
): Promise<SpendSummary> {
  const dateClause = buildDateSqlClause(filter);

  const rows = await runQuery<{
    total_spend: number | null;
    order_count: number | null;
    min_date: string | null;
    max_date: string | null;
    skipped_rows: number | null;
  }>(`
    WITH base AS (
      SELECT * FROM canonical_all_orders
      WHERE TRUE${dateClause}
    ),
    valid AS (
      SELECT * FROM base WHERE ${ACTIVE_ORDER_FILTER}
    ),
    invalid AS (
      SELECT COUNT(*)::INTEGER AS skipped_rows
      FROM base
      WHERE NOT (${ACTIVE_ORDER_FILTER})
    )
    SELECT
      COALESCE(SUM(COALESCE(price, 0) * COALESCE(quantity, 1)), 0) AS total_spend,
      COUNT(DISTINCT order_id)::INTEGER AS order_count,
      CAST(MIN(order_date) AS VARCHAR) AS min_date,
      CAST(MAX(order_date) AS VARCHAR) AS max_date,
      (SELECT skipped_rows FROM invalid) AS skipped_rows
    FROM valid
  `);

  const row = rows[0];
  return {
    total_spend: row?.total_spend ?? 0,
    order_count: row?.order_count ?? 0,
    min_date: row?.min_date ?? null,
    max_date: row?.max_date ?? null,
    skipped_rows: row?.skipped_rows ?? 0,
  };
}

export async function fetchSpendTrend(
  filter: ResolvedDateFilter,
): Promise<PeriodSpend[]> {
  const dateClause = buildDateSqlClause(filter);
  const trunc = filter.granularity;

  const rows = await runQuery<{
    period: string;
    spend: number | null;
  }>(`
    SELECT
      CAST(DATE_TRUNC('${trunc}', order_date) AS VARCHAR) AS period,
      SUM(COALESCE(price, 0) * COALESCE(quantity, 1)) AS spend
    FROM canonical_all_orders
    WHERE ${ACTIVE_ORDER_FILTER}${dateClause}
    GROUP BY 1
    ORDER BY 1
  `);

  return rows.map((row) => ({
    period: row.period,
    spend: row.spend ?? 0,
  }));
}