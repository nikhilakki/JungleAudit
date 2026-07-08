export type AmazonFileType =
  | "order_history"
  | "digital_content_orders"
  | "cart_history"
  | "return_requests"
  | "returns_status"
  | "refund_details"
  | "digital_returns"
  | "replacement_orders"
  | "unknown";

export type CanonicalField =
  | "order_id"
  | "order_date"
  | "asin"
  | "product_title"
  | "quantity"
  | "price"
  | "currency"
  | "order_status"
  | "payment_method"
  | "ship_date"
  | "return_id"
  | "return_date"
  | "return_reason"
  | "refund_amount"
  | "refund_status"
  | "resolution"
  | "cart_add_date"
  | "prime_eligible"
  | "one_click_buy"
  | "gift_flag"
  | "original_order_id"
  | "replacement_order_id"
  | "seller";

export type MappingConfidence = "exact" | "fuzzy" | "unmapped";

export interface DetectedColumn {
  column_name: string;
  column_type: string;
}

export interface ColumnMapping {
  canonical: CanonicalField | null;
  sourceColumn: string;
  confidence: MappingConfidence;
}

export interface FileSchemaInfo {
  originalName: string;
  vfsName: string;
  fileType: AmazonFileType;
  rawTable: string;
  rowCount: number;
  columns: DetectedColumn[];
  mappings: ColumnMapping[];
  missingRequired: CanonicalField[];
}

export const ORDER_FILE_TYPES: AmazonFileType[] = [
  "order_history",
  "digital_content_orders",
];

export const FILE_NAME_PATTERNS: Record<
  Exclude<AmazonFileType, "unknown">,
  RegExp[]
> = {
  order_history: [/^order[\s_-]*history\.csv$/i],
  digital_content_orders: [/^digital[\s_-]*content[\s_-]*orders\.csv$/i],
  cart_history: [/^cart[\s_-]*history\.csv$/i],
  return_requests: [/^return[\s_-]*requests\.csv$/i],
  returns_status: [/^returns?[\s_-]*status\.csv$/i],
  refund_details: [/^refund[\s_-]*details\.csv$/i],
  digital_returns: [/^digital[\s_-]*returns\.csv$/i],
  replacement_orders: [/^replacement[\s_-]*orders\.csv$/i],
};

export const FILE_TYPE_LABELS: Record<AmazonFileType, string> = {
  order_history: "Order History",
  digital_content_orders: "Digital Content Orders",
  cart_history: "Cart History",
  return_requests: "Return Requests",
  returns_status: "Returns Status",
  refund_details: "Refund Details",
  digital_returns: "Digital Returns",
  replacement_orders: "Replacement Orders",
  unknown: "Unknown",
};

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

export const REQUIRED_FIELDS_BY_TYPE: Partial<
  Record<AmazonFileType, CanonicalField[]>
> = {
  order_history: ["order_date", "price"],
  digital_content_orders: ["order_date", "price"],
};

export const FIELD_ALIASES: Record<
  AmazonFileType,
  Partial<Record<CanonicalField, string[]>>
> = {
  order_history: {
    order_id: ["order id", "orderid", "order number", "order no"],
    order_date: ["order date", "purchase date", "date ordered"],
    asin: ["asin", "product asin"],
    product_title: [
      "product name",
      "title",
      "item name",
      "product title",
      "item description",
    ],
    quantity: ["quantity", "qty", "units"],
    price: [
      "price",
      "item price",
      "unit price",
      "amount",
      "order total",
      "fx transaction amount",
      "transaction amount",
    ],
    currency: ["currency", "currency code"],
    order_status: ["order status", "status"],
    payment_method: [
      "payment method",
      "payment instrument",
      "card",
      "payment type",
    ],
    ship_date: ["ship date", "shipment date", "delivery date"],
  },
  digital_content_orders: {
    order_id: ["order id", "orderid"],
    order_date: ["order date", "purchase date"],
    asin: ["asin"],
    product_title: ["title", "product name", "item name"],
    quantity: ["quantity", "qty"],
    price: [
      "price",
      "item price",
      "amount",
      "fx transaction amount",
      "transaction amount",
    ],
    currency: ["currency", "currency code"],
    order_status: ["order status", "status"],
    seller: ["seller", "sold by"],
    gift_flag: ["gift", "is gift", "gift flag"],
  },
  cart_history: {
    asin: ["asin"],
    quantity: ["quantity", "qty"],
    cart_add_date: [
      "cart add date",
      "date added to cart",
      "add to cart date",
      "cart-add date",
    ],
    prime_eligible: ["prime eligible", "prime-eligible", "prime"],
    one_click_buy: ["one click", "one-click", "1-click"],
    gift_flag: ["gift wrap", "gift-wrap", "gift"],
  },
  return_requests: {
    order_id: ["order id", "orderid"],
    return_id: ["return id", "return request id"],
    return_date: ["request date", "return date", "date requested"],
    asin: ["asin"],
    product_title: ["title", "product name"],
    return_reason: ["return reason", "reason"],
    quantity: ["quantity", "qty"],
  },
  returns_status: {
    order_id: ["order id", "orderid"],
    return_date: ["return date", "date returned"],
    refund_amount: ["amount", "refund amount", "return amount"],
    return_reason: ["reason", "return reason"],
    resolution: ["resolution", "return resolution"],
    order_status: ["return state", "status", "state"],
  },
  refund_details: {
    order_id: ["order id", "orderid"],
    return_id: ["return id", "order/return id"],
    return_date: ["return date"],
    refund_amount: ["refund amount", "amount"],
    refund_status: ["refund status", "return status", "status"],
    quantity: ["quantity", "qty"],
  },
  digital_returns: {
    asin: ["asin"],
    product_title: ["title", "product name"],
    return_date: ["return date", "date"],
    refund_amount: ["refund amount", "amount"],
    refund_status: ["return status", "status"],
  },
  replacement_orders: {
    original_order_id: [
      "original order id",
      "original order",
      "replaced order id",
    ],
    replacement_order_id: [
      "replacement order id",
      "replacement order",
      "new order id",
    ],
  },
  unknown: {},
};

export function normalizeHeader(header: string): string {
  return header
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function detectFileType(filename: string): AmazonFileType {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  for (const [type, patterns] of Object.entries(FILE_NAME_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(base))) {
      return type as AmazonFileType;
    }
  }
  return "unknown";
}

export function toTableSlug(fileType: AmazonFileType): string {
  return fileType === "unknown" ? "unknown" : fileType;
}

export function toVfsName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function quoteIdent(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

/** Strip currency symbols/text; DuckDB regexp_replace rejects empty replacement in some builds. */
function parseMoneySql(col: string, field: CanonicalField): string {
  return `TRY_CAST(
    replace(
      regexp_extract(CAST(${col} AS VARCHAR), '[-+]?[0-9,]*\\.?[0-9]+'),
      ',',
      ''
    ) AS DOUBLE
  ) AS ${field}`;
}

function aliasMatches(header: string, alias: string): boolean {
  if (header === alias) return true;
  if (header.includes(alias) || alias.includes(header)) return true;
  const headerTokens = header.split(/[\s_/-]+/).filter(Boolean);
  const aliasTokens = alias.split(/[\s_/-]+/).filter(Boolean);
  return aliasTokens.every((token) => headerTokens.includes(token));
}

export function buildColumnMappings(
  fileType: AmazonFileType,
  columns: DetectedColumn[],
): ColumnMapping[] {
  const aliases = FIELD_ALIASES[fileType] ?? {};
  const usedCanonical = new Set<CanonicalField>();

  const mappings: ColumnMapping[] = columns.map((column) => {
    const normalized = normalizeHeader(column.column_name);
    let best: {
      canonical: CanonicalField;
      confidence: MappingConfidence;
    } | null = null;

    for (const [canonical, patterns] of Object.entries(aliases) as Array<
      [CanonicalField, string[]]
    >) {
      if (usedCanonical.has(canonical)) continue;
      for (const alias of patterns) {
        if (normalized === alias) {
          best = { canonical, confidence: "exact" };
          break;
        }
        if (!best && aliasMatches(normalized, alias)) {
          best = { canonical, confidence: "fuzzy" };
        }
      }
      if (best?.confidence === "exact") break;
    }

    if (best) {
      usedCanonical.add(best.canonical);
      return {
        canonical: best.canonical,
        sourceColumn: column.column_name,
        confidence: best.confidence,
      };
    }

    return {
      canonical: null,
      sourceColumn: column.column_name,
      confidence: "unmapped",
    };
  });

  return mappings;
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

export function buildCanonicalViewSql(
  fileType: AmazonFileType,
  rawTable: string,
  viewName: string,
  mappings: ColumnMapping[],
): string | null {
  if (!ORDER_FILE_TYPES.includes(fileType) && fileType !== "unknown") {
    return null;
  }

  if (!ORDER_FILE_TYPES.includes(fileType)) return null;

  const mappingByCanonical = new Map<CanonicalField, ColumnMapping>();
  for (const mapping of mappings) {
    if (mapping.canonical) {
      mappingByCanonical.set(mapping.canonical, mapping);
    }
  }

  const selectParts = ORDER_CANONICAL_FIELDS.map((field) =>
    sqlForField(mappingByCanonical.get(field), field),
  );

  const priceMapping = mappingByCanonical.get("price");
  if (priceMapping?.sourceColumn) {
    selectParts.push(
      `CAST(${quoteIdent(priceMapping.sourceColumn)} AS VARCHAR) AS price_text`,
    );
  } else {
    selectParts.push(`NULL::VARCHAR AS price_text`);
  }

  selectParts.push(`'${fileType}' AS source_file`);

  return `CREATE OR REPLACE VIEW ${viewName} AS
SELECT
  ${selectParts.join(",\n  ")}
FROM ${rawTable}`;
}

export function buildAllOrdersViewSql(viewNames: string[]): string | null {
  if (viewNames.length === 0) return null;
  if (viewNames.length === 1) {
    return `CREATE OR REPLACE VIEW canonical_all_orders AS SELECT * FROM ${viewNames[0]}`;
  }
  return `CREATE OR REPLACE VIEW canonical_all_orders AS\n${viewNames
    .map((name) => `SELECT * FROM ${name}`)
    .join("\nUNION ALL BY NAME\n")}`;
}

export function getMissingRequiredFields(
  fileType: AmazonFileType,
  mappings: ColumnMapping[],
): CanonicalField[] {
  const required = REQUIRED_FIELDS_BY_TYPE[fileType] ?? [];
  const mapped = new Set(
    mappings.filter((m) => m.canonical).map((m) => m.canonical),
  );
  return required.filter((field) => !mapped.has(field));
}