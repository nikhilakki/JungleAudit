import { runQuery } from "@/lib/duckdb";

export interface CurrencyInfo {
  code: string;
  source: "column" | "symbol" | "fallback";
}

const SYMBOL_TO_CODE: Record<string, string> = {
  "₹": "INR",
  $: "USD",
  "€": "EUR",
  "£": "GBP",
};

export function formatCurrency(amount: number, code: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString()}`;
  }
}

export async function detectCurrency(): Promise<CurrencyInfo> {
  try {
    const columnRows = await runQuery<{ currency: string; cnt: number }>(`
      SELECT
        upper(trim(currency)) AS currency,
        COUNT(*)::INTEGER AS cnt
      FROM canonical_all_orders
      WHERE currency IS NOT NULL AND trim(currency) <> ''
      GROUP BY 1
      ORDER BY cnt DESC
      LIMIT 1
    `);

    if (columnRows[0]?.currency) {
      return { code: columnRows[0].currency, source: "column" };
    }

    const symbolRows = await runQuery<{ sample: string }>(`
      SELECT price_text AS sample
      FROM canonical_all_orders
      WHERE price_text IS NOT NULL AND trim(price_text) <> ''
      LIMIT 50
    `);

    const counts = new Map<string, number>();
    for (const row of symbolRows) {
      const sample = String(row.sample ?? "");
      for (const [symbol, code] of Object.entries(SYMBOL_TO_CODE)) {
        if (sample.includes(symbol)) {
          counts.set(code, (counts.get(code) ?? 0) + 1);
        }
      }
    }

    const topSymbol = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topSymbol) {
      return { code: topSymbol[0], source: "symbol" };
    }
  } catch {
    // canonical_all_orders may not exist yet
  }

  return { code: "INR", source: "fallback" };
}