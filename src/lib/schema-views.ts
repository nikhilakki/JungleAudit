import type { AmazonFileType, CanonicalField, ColumnMapping } from "@/lib/schema";
import { quoteIdent } from "@/lib/schema";

const ORDER_CANONICAL_FIELDS: CanonicalField[] = [
  "order_id",
  "order_date",
  "asin",
  "product_title",
  "quantity",
  "price",
  "currency",
  "order_status",
  "payment_method",
];

const REFUND_CANONICAL_FIELDS: CanonicalField[] = [
  "order_id",
  "return_date",
  "refund_amount",
  "refund_status",
  "return_reason",
  "resolution",
  "quantity",
  "currency",
];

const RETURN_REQUEST_FIELDS: CanonicalField[] = [
  "order_id",
  "asin",
  "product_title",
  "return_reason",
];

const REPLACEMENT_FIELDS: CanonicalField[] = [
  "original_order_id",
  "replacement_order_id",
];

const CART_FIELDS: CanonicalField[] = [
  "asin",
  "product_title",
  "quantity",
  "cart_add_date",
  "prime_eligible",
  "one_click_buy",
  "gift_flag",
];

const BORROWED_FIELDS: CanonicalField[] = [
  "asin",
  "product_title",
  "order_date",
  "order_status",
  "content_type",
  "loan_program",
];

export const CANONICAL_FIELDS_BY_TYPE: Partial<
  Record<AmazonFileType, CanonicalField[]>
> = {
  order_history: ORDER_CANONICAL_FIELDS,
  digital_content_orders: ORDER_CANONICAL_FIELDS,
  refund_details: REFUND_CANONICAL_FIELDS,
  returns_status: REFUND_CANONICAL_FIELDS,
  digital_returns: REFUND_CANONICAL_FIELDS,
  orders_returns_v2: REFUND_CANONICAL_FIELDS,
  return_requests: RETURN_REQUEST_FIELDS,
  replacement_orders: REPLACEMENT_FIELDS,
  cart_history: CART_FIELDS,
  digital_borrowed_items: BORROWED_FIELDS,
};

function parseMoneySql(col: string, field: CanonicalField): string {
  return `TRY_CAST(
    replace(
      regexp_extract(CAST(${col} AS VARCHAR), '[-+]?[0-9,]*\\.?[0-9]+'),
      ',',
      ''
    ) AS DOUBLE
  ) AS ${field}`;
}

function sqlForField(
  mapping: ColumnMapping | undefined,
  field: CanonicalField,
): string {
  if (!mapping?.canonical) return `NULL::VARCHAR AS ${field}`;

  const col = quoteIdent(mapping.sourceColumn);

  switch (field) {
    case "order_date":
    case "return_date":
    case "cart_add_date":
    case "ship_date":
      return `COALESCE(
        TRY_CAST(${col} AS TIMESTAMP),
        TRY_STRPTIME(CAST(${col} AS VARCHAR), '%Y-%m-%d %H:%M:%S'),
        TRY_STRPTIME(CAST(${col} AS VARCHAR), '%d/%m/%Y'),
        TRY_STRPTIME(CAST(${col} AS VARCHAR), '%m/%d/%Y'),
        TRY_STRPTIME(CAST(${col} AS VARCHAR), '%Y-%m-%d')
      ) AS ${field}`;
    case "quantity":
      return `TRY_CAST(${col} AS INTEGER) AS ${field}`;
    case "price":
    case "refund_amount":
      return parseMoneySql(col, field);
    case "prime_eligible":
    case "one_click_buy":
    case "gift_flag":
      return `TRY_CAST(${col} AS BOOLEAN) AS ${field}`;
    default:
      return `CAST(${col} AS VARCHAR) AS ${field}`;
  }
}

function mappingByCanonical(
  mappings: ColumnMapping[],
): Map<CanonicalField, ColumnMapping> {
  const map = new Map<CanonicalField, ColumnMapping>();
  for (const mapping of mappings) {
    if (mapping.canonical) map.set(mapping.canonical, mapping);
  }
  return map;
}

function selectForFields(
  fields: CanonicalField[],
  map: Map<CanonicalField, ColumnMapping>,
): string[] {
  return fields.map((field) => sqlForField(map.get(field), field));
}

export function canonicalViewName(fileType: AmazonFileType): string {
  return `canonical_${fileType}`;
}

export function buildCanonicalViewSql(
  fileType: AmazonFileType,
  rawTable: string,
  viewName: string,
  mappings: ColumnMapping[],
): string | null {
  const fields = CANONICAL_FIELDS_BY_TYPE[fileType];
  if (!fields) return null;

  const map = mappingByCanonical(mappings);
  const selectParts = selectForFields(fields, map);

  if (fileType === "order_history") {
    const priceMapping = map.get("price");
    if (priceMapping?.sourceColumn) {
      selectParts.push(
        `CAST(${quoteIdent(priceMapping.sourceColumn)} AS VARCHAR) AS price_text`,
      );
    } else {
      selectParts.push(`NULL::VARCHAR AS price_text`);
    }
  }

  if (fileType === "digital_content_orders") {
    const componentCol = mappings.find(
      (m) => normalizeHeaderLocal(m.sourceColumn) === "component type",
    )?.sourceColumn;
    const priceCol = map.get("price")?.sourceColumn;
    const txCol = mappings.find(
      (m) => normalizeHeaderLocal(m.sourceColumn) === "transaction amount",
    )?.sourceColumn;
    const fxCol = mappings.find(
      (m) => normalizeHeaderLocal(m.sourceColumn) === "fx transaction amount",
    )?.sourceColumn;

    if (priceCol || txCol || fxCol) {
      const parts: string[] = [];
      if (txCol) parts.push(parseMoneySql(quoteIdent(txCol), "price").replace(" AS price", ""));
      if (priceCol) parts.push(parseMoneySql(quoteIdent(priceCol), "price").replace(" AS price", ""));
      if (fxCol) parts.push(parseMoneySql(quoteIdent(fxCol), "price").replace(" AS price", ""));
      const priceIdx = selectParts.findIndex((p) => p.endsWith("AS price"));
      if (priceIdx >= 0) {
        selectParts[priceIdx] = `COALESCE(${parts.join(", ")}) AS price`;
      }
    }

    const currencyCol = map.get("currency")?.sourceColumn;
    if (currencyCol) {
      const currencyIdx = selectParts.findIndex((p) => p.endsWith("AS currency"));
      if (currencyIdx >= 0) {
        selectParts[currencyIdx] = `CAST(${quoteIdent(currencyCol)} AS VARCHAR) AS currency`;
      }
    }

    selectParts.push(`NULL::VARCHAR AS price_text`);
    selectParts.push(`'digital_content_orders' AS source_file`);

    const whereClause = componentCol
      ? `WHERE lower(trim(CAST(${quoteIdent(componentCol)} AS VARCHAR))) = 'price amount'`
      : "";

    return `CREATE OR REPLACE VIEW ${viewName} AS
SELECT
  ${selectParts.join(",\n  ")}
FROM ${rawTable}
${whereClause}`;
  }

  if (fileType === "digital_returns") {
    const refundIdx = selectParts.findIndex((p) => p.endsWith("AS refund_amount"));
    if (refundIdx >= 0) {
      const expr = selectParts[refundIdx].replace(" AS refund_amount", "");
      selectParts[refundIdx] = `ABS(${expr}) AS refund_amount`;
    }
  }

  if (fileType === "digital_borrowed_items") {
    selectParts.push(`NULL::VARCHAR AS currency`);
    selectParts.push(`NULL::DOUBLE AS price`);
    selectParts.push(`1 AS quantity`);
  }

  selectParts.push(`'${fileType}' AS source_file`);

  return `CREATE OR REPLACE VIEW ${viewName} AS
SELECT
  ${selectParts.join(",\n  ")}
FROM ${rawTable}`;
}

export const ORDER_VIEW_TYPES: AmazonFileType[] = [
  "order_history",
  "digital_content_orders",
];

export const REFUND_VIEW_TYPES: AmazonFileType[] = [
  "refund_details",
  "returns_status",
  "digital_returns",
  "orders_returns_v2",
];

export function buildAllOrdersViewSql(viewNames: string[]): string | null {
  if (viewNames.length === 0) return null;
  if (viewNames.length === 1) {
    return `CREATE OR REPLACE VIEW canonical_all_orders AS SELECT * FROM ${viewNames[0]}`;
  }
  return `CREATE OR REPLACE VIEW canonical_all_orders AS\n${viewNames
    .map((name) => `SELECT * FROM ${name}`)
    .join("\nUNION ALL BY NAME\n")}`;
}

export function buildAllRefundsViewSql(viewNames: string[]): string | null {
  if (viewNames.length === 0) return null;

  const normalized = viewNames.map(
    (name) => `SELECT
      order_id,
      return_date AS refund_date,
      refund_amount,
      refund_status,
      return_reason,
      resolution,
      quantity,
      currency,
      source_file
    FROM ${name}
    WHERE refund_amount IS NOT NULL AND refund_amount > 0`,
  );

  if (normalized.length === 1) {
    return `CREATE OR REPLACE VIEW canonical_all_refunds AS ${normalized[0]}`;
  }

  return `CREATE OR REPLACE VIEW canonical_all_refunds AS\n${normalized.join("\nUNION ALL BY NAME\n")}`;
}

function normalizeHeaderLocal(header: string): string {
  return header
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}