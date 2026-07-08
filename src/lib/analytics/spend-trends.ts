import { runQuery } from "@/lib/duckdb";

export interface SpendSummary {
  total_spend: number;
  order_count: number;
  min_date: string | null;
  max_date: string | null;
  skipped_rows: number;
}

export interface MonthlySpend {
  month: string;
  spend: number;
}

const ACTIVE_ORDER_FILTER = `
  order_date IS NOT NULL
  AND price IS NOT NULL
  AND (order_status IS NULL OR lower(order_status) NOT LIKE '%cancel%')
`;

export async function fetchSpendSummary(): Promise<SpendSummary> {
  const rows = await runQuery<{
    total_spend: number | null;
    order_count: number | null;
    min_date: string | null;
    max_date: string | null;
    skipped_rows: number | null;
  }>(`
    WITH base AS (
      SELECT * FROM canonical_all_orders
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

export async function fetchMonthlyTrend(): Promise<MonthlySpend[]> {
  const rows = await runQuery<{
    month: string;
    spend: number | null;
  }>(`
    SELECT
      CAST(DATE_TRUNC('month', order_date) AS VARCHAR) AS month,
      SUM(COALESCE(price, 0) * COALESCE(quantity, 1)) AS spend
    FROM canonical_all_orders
    WHERE ${ACTIVE_ORDER_FILTER}
    GROUP BY 1
    ORDER BY 1
  `);

  return rows.map((row) => ({
    month: row.month,
    spend: row.spend ?? 0,
  }));
}