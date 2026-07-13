import {
  canonicalViewName,
  ORDER_VIEW_TYPES,
  REFUND_VIEW_TYPES,
  type AmazonFileType,
  type FileSchemaInfo,
} from "@/lib/schema";

export interface SampleQuery {
  id: string;
  category: string;
  title: string;
  sql: string;
}

/** Sample queries tailored to the file types the user actually uploaded. */
export function buildSampleQueries(schemas: FileSchemaInfo[]): SampleQuery[] {
  const types = new Set<AmazonFileType>(schemas.map((s) => s.fileType));
  const hasOrders = ORDER_VIEW_TYPES.some((t) => types.has(t));
  const hasRefunds = REFUND_VIEW_TYPES.some((t) => types.has(t));
  const samples: SampleQuery[] = [];

  if (hasOrders) {
    samples.push(
      {
        id: "biggest-orders",
        category: "Spending",
        title: "Biggest orders",
        sql: `SELECT order_date::DATE AS day, product_title, ROUND(price, 2) AS price
FROM canonical_all_orders
WHERE price IS NOT NULL
ORDER BY price DESC
LIMIT 10`,
      },
      {
        id: "monthly-spend",
        category: "Spending",
        title: "Spend by month",
        sql: `SELECT strftime(order_date, '%Y-%m') AS month,
       ROUND(SUM(price), 2) AS total_spend,
       COUNT(*) AS orders
FROM canonical_all_orders
WHERE order_date IS NOT NULL AND price IS NOT NULL
GROUP BY month
ORDER BY month`,
      },
      {
        id: "top-products",
        category: "Spending",
        title: "Top products by lifetime spend",
        sql: `SELECT product_title,
       COUNT(*) AS times_ordered,
       ROUND(SUM(price), 2) AS total_spent
FROM canonical_all_orders
WHERE product_title IS NOT NULL AND price IS NOT NULL
GROUP BY product_title
ORDER BY total_spent DESC
LIMIT 15`,
      },
      {
        id: "day-of-week",
        category: "Spending",
        title: "Which weekday costs you most",
        sql: `SELECT dayname(order_date) AS day_of_week,
       ROUND(SUM(price), 2) AS total_spend,
       COUNT(*) AS orders
FROM canonical_all_orders
WHERE order_date IS NOT NULL AND price IS NOT NULL
GROUP BY day_of_week, dayofweek(order_date)
ORDER BY dayofweek(order_date)`,
      },
      {
        id: "repeat-buys",
        category: "Spending",
        title: "Things you keep buying",
        sql: `SELECT product_title,
       COUNT(*) AS times_ordered
FROM canonical_all_orders
WHERE product_title IS NOT NULL
GROUP BY product_title
HAVING COUNT(*) > 1
ORDER BY times_ordered DESC
LIMIT 15`,
      },
    );
  }

  if (types.has("order_history")) {
    samples.push({
      id: "payment-methods",
      category: "Spending",
      title: "Spend by payment method",
      sql: `SELECT COALESCE(payment_method, '(unknown)') AS payment_method,
       COUNT(*) AS orders,
       ROUND(SUM(price), 2) AS total_spend
FROM canonical_order_history
WHERE price IS NOT NULL
GROUP BY payment_method
ORDER BY total_spend DESC`,
    });
  }

  if (hasRefunds) {
    samples.push(
      {
        id: "refund-reasons",
        category: "Refunds",
        title: "Why you return things",
        sql: `SELECT COALESCE(return_reason, '(no reason given)') AS reason,
       COUNT(*) AS refunds,
       ROUND(SUM(refund_amount), 2) AS total_refunded
FROM canonical_all_refunds
GROUP BY reason
ORDER BY total_refunded DESC`,
      },
      {
        id: "monthly-refunds",
        category: "Refunds",
        title: "Refunds by month",
        sql: `SELECT strftime(refund_date, '%Y-%m') AS month,
       ROUND(SUM(refund_amount), 2) AS refunded,
       COUNT(*) AS refunds
FROM canonical_all_refunds
WHERE refund_date IS NOT NULL
GROUP BY month
ORDER BY month`,
      },
    );
  }

  if (types.has("cart_history") && hasOrders) {
    samples.push({
      id: "cart-never-bought",
      category: "Cart",
      title: "Cart items you never bought",
      sql: `SELECT c.product_title,
       MAX(c.cart_add_date)::DATE AS last_added
FROM canonical_cart_history c
LEFT JOIN canonical_all_orders o USING (asin)
WHERE o.asin IS NULL AND c.product_title IS NOT NULL
GROUP BY c.product_title
ORDER BY last_added DESC
LIMIT 15`,
    });
  }

  if (types.has("digital_borrowed_items")) {
    samples.push({
      id: "borrowing-programs",
      category: "Borrowing",
      title: "Borrowed items by program",
      sql: `SELECT COALESCE(loan_program, '(unknown)') AS program,
       COUNT(*) AS items
FROM canonical_digital_borrowed_items
GROUP BY program
ORDER BY items DESC`,
    });
  }

  const inspectTarget = hasOrders
    ? "canonical_all_orders"
    : firstCanonicalView(schemas) ?? schemas[0]?.rawTable;

  samples.push({
    id: "show-tables",
    category: "Explore",
    title: "List every table & view",
    sql: "SHOW TABLES",
  });

  if (inspectTarget) {
    samples.push(
      {
        id: "describe",
        category: "Explore",
        title: "What columns are available",
        sql: `DESCRIBE ${inspectTarget}`,
      },
      {
        id: "summarize",
        category: "Explore",
        title: "Instant stats for every column",
        sql: `SUMMARIZE ${inspectTarget}`,
      },
    );
  }

  return samples;
}

function firstCanonicalView(schemas: FileSchemaInfo[]): string | null {
  for (const schema of schemas) {
    if (schema.fileType === "unknown") continue;
    return canonicalViewName(schema.fileType);
  }
  return null;
}
