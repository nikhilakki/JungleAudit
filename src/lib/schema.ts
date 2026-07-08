export type AmazonFileType =
  | "order_history"
  | "digital_content_orders"
  | "cart_history"
  | "return_requests"
  | "returns_status"
  | "refund_details"
  | "digital_returns"
  | "replacement_orders"
  | "digital_borrowed_items"
  | "orders_returns_v2"
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
  | "seller"
  | "content_type"
  | "loan_program";

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
  digital_borrowed_items: [/^digital[\s_-]*borrowed[\s_-]*items\.csv$/i],
  orders_returns_v2: [/^your[\s_.-]*orders[\s_.-]*returns.*\.csv$/i],
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
  digital_borrowed_items: "Digital Borrowed Items",
  orders_returns_v2: "Orders Returns (v2)",
  unknown: "Unknown",
};

export const ANALYTICS_FILE_TYPES: AmazonFileType[] = [
  "order_history",
  "digital_content_orders",
  "cart_history",
  "return_requests",
  "returns_status",
  "refund_details",
  "digital_returns",
  "replacement_orders",
  "digital_borrowed_items",
  "orders_returns_v2",
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
    quantity: ["quantity", "qty", "units", "original quantity"],
    price: [
      "unit price",
      "price",
      "item price",
      "total amount",
      "shipment item subtotal",
      "amount",
      "order total",
      "fx transaction amount",
      "transaction amount",
    ],
    currency: ["currency", "currency code"],
    order_status: ["order status", "status"],
    payment_method: [
      "payment method type",
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
    quantity: [
      "quantity ordered",
      "original quantity",
      "affected item quantity",
      "quantity",
      "qty",
    ],
    price: [
      "transaction amount",
      "price",
      "item price",
      "fx transaction amount",
      "amount",
    ],
    currency: [
      "base currency code",
      "price currency code",
      "currency",
      "currency code",
    ],
    order_status: ["order status", "status"],
    seller: ["seller", "sold by"],
    gift_flag: ["gift", "is gift", "gift flag"],
  },
  cart_history: {
    asin: ["asin"],
    product_title: ["product name", "title"],
    quantity: ["order quantity", "quantity", "qty"],
    cart_add_date: [
      "date added to cart",
      "cart add date",
      "add to cart date",
      "cart-add date",
    ],
    prime_eligible: ["prime subscription", "prime eligible", "prime-eligible", "prime"],
    one_click_buy: ["one-click enabled", "one click", "one-click", "1-click"],
    gift_flag: ["gift wrapped", "gift wrap", "gift-wrap", "gift"],
  },
  return_requests: {
    order_id: ["order id", "orderid"],
    return_id: ["return id", "return request id"],
    return_date: ["request date", "return date", "date requested"],
    asin: ["asin"],
    product_title: ["title", "product name"],
    return_reason: ["return reason code", "return reason", "reason"],
    quantity: ["quantity", "qty"],
  },
  returns_status: {
    order_id: ["order id", "orderid"],
    return_date: ["date of return", "return date", "return creation date", "date returned"],
    refund_amount: ["return amount", "amount", "refund amount"],
    currency: ["return amount currency", "currency"],
    return_reason: ["return reason", "reason"],
    resolution: ["return resolution", "resolution"],
    refund_status: ["return receivable state", "return state", "status", "state"],
  },
  refund_details: {
    order_id: ["order id", "orderid"],
    return_id: ["return id", "order/return id"],
    return_date: ["refund date", "creation date", "return date"],
    refund_amount: ["refund amount", "amount"],
    refund_status: ["payment status", "refund status", "return status", "status"],
    return_reason: ["reversal reason", "reason"],
    quantity: ["order quantity", "quantity", "qty"],
    currency: ["currency"],
  },
  digital_returns: {
    order_id: ["order id", "orderid"],
    asin: ["asin"],
    product_title: ["title", "product name"],
    return_date: ["return date", "date"],
    refund_amount: [
      "transaction amount",
      "fx transaction amount",
      "amount refunded",
      "refund amount",
      "amount",
    ],
    refund_status: ["return status", "status"],
    return_reason: ["reason code", "reason"],
    quantity: ["quantity", "affected item quantity"],
  },
  digital_borrowed_items: {
    asin: ["asin"],
    product_title: ["product name", "title"],
    order_date: ["loan creation date", "loan acceptance date"],
    order_status: ["loan status"],
    content_type: ["content type"],
    loan_program: ["loan program"],
  },
  orders_returns_v2: {
    order_id: ["order id", "orderid"],
    return_date: ["request date", "return date"],
    refund_amount: ["refund amount", "amount"],
    currency: ["currency code", "currency"],
    refund_status: ["refund status", "status"],
    return_reason: ["reason for non-refund", "reason"],
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

export {
  buildAllOrdersViewSql,
  buildAllRefundsViewSql,
  buildCanonicalViewSql,
  canonicalViewName,
  ORDER_VIEW_TYPES,
  REFUND_VIEW_TYPES,
} from "@/lib/schema-views";

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