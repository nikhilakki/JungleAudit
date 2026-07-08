import type { ResolvedDateFilter } from "@/lib/analytics/date-filter";
import { buildDateSqlClause } from "@/lib/analytics/date-filter";
import { runQuery } from "@/lib/duckdb";

export interface BorrowingSummary {
  total_borrows: number;
  active_borrows: number;
  top_program: string | null;
}

export interface BorrowingByTypeRow {
  content_type: string;
  count: number;
}

export interface BorrowingTrendPoint {
  period: string;
  count: number;
}

async function viewExists(name: string): Promise<boolean> {
  const rows = await runQuery<{ cnt: number }>(`
    SELECT COUNT(*)::INTEGER AS cnt
    FROM information_schema.tables
    WHERE table_name = '${name}'
  `);
  return (rows[0]?.cnt ?? 0) > 0;
}

export async function fetchBorrowingSummary(): Promise<BorrowingSummary | null> {
  if (!(await viewExists("canonical_digital_borrowed_items"))) return null;

  const rows = await runQuery<{
    total_borrows: number | null;
    active_borrows: number | null;
    top_program: string | null;
  }>(`
    WITH base AS (
      SELECT * FROM canonical_digital_borrowed_items
      WHERE order_date IS NOT NULL
    ),
    programs AS (
      SELECT loan_program, COUNT(*)::INTEGER AS cnt
      FROM base
      WHERE loan_program IS NOT NULL AND trim(loan_program) <> ''
      GROUP BY 1
      ORDER BY cnt DESC
      LIMIT 1
    )
    SELECT
      (SELECT COUNT(*)::INTEGER FROM base) AS total_borrows,
      (SELECT COUNT(*)::INTEGER FROM base WHERE lower(order_status) = 'borrowed') AS active_borrows,
      (SELECT loan_program FROM programs) AS top_program
  `);

  const row = rows[0];
  if (!row?.total_borrows) return null;

  return {
    total_borrows: row.total_borrows,
    active_borrows: row.active_borrows ?? 0,
    top_program: row.top_program,
  };
}

export async function fetchBorrowingByType(): Promise<BorrowingByTypeRow[]> {
  if (!(await viewExists("canonical_digital_borrowed_items"))) return [];

  const rows = await runQuery<{
    content_type: string;
    count: number | null;
  }>(`
    SELECT
      COALESCE(NULLIF(trim(content_type), ''), 'Unknown') AS content_type,
      COUNT(*)::INTEGER AS count
    FROM canonical_digital_borrowed_items
    GROUP BY 1
    ORDER BY count DESC
  `);

  return rows.map((row) => ({
    content_type: row.content_type,
    count: row.count ?? 0,
  }));
}

export async function fetchBorrowingTrend(
  filter: ResolvedDateFilter,
): Promise<BorrowingTrendPoint[]> {
  if (!(await viewExists("canonical_digital_borrowed_items"))) return [];

  const dateClause = buildDateSqlClause(filter, "order_date");
  const trunc = filter.granularity;

  const rows = await runQuery<{
    period: string;
    count: number | null;
  }>(`
    SELECT
      CAST(DATE_TRUNC('${trunc}', order_date) AS VARCHAR) AS period,
      COUNT(*)::INTEGER AS count
    FROM canonical_digital_borrowed_items
    WHERE order_date IS NOT NULL${dateClause}
    GROUP BY 1
    ORDER BY 1
  `);

  return rows.map((row) => ({
    period: row.period,
    count: row.count ?? 0,
  }));
}