import {
  ANALYTICS_FILE_TYPES,
  FILE_TYPE_LABELS,
  type AmazonFileType,
  type FileSchemaInfo,
} from "@/lib/schema";

export interface DataInsight {
  id: string;
  title: string;
  description: string;
  fileTypes: AmazonFileType[];
}

export const DATA_INSIGHTS: DataInsight[] = [
  {
    id: "spend",
    title: "Spend & trends",
    description: "Total spend, order count, and time-series charts.",
    fileTypes: ["order_history", "digital_content_orders"],
  },
  {
    id: "payments",
    title: "Payment methods",
    description: "Breakdown by card, UPI, gift certificate, and other instruments.",
    fileTypes: ["order_history"],
  },
  {
    id: "refunds",
    title: "Refunds & returns",
    description: "Refund totals, return reasons, and net spend after refunds.",
    fileTypes: [
      "refund_details",
      "returns_status",
      "digital_returns",
      "orders_returns_v2",
      "return_requests",
    ],
  },
  {
    id: "replacements",
    title: "Replacement orders",
    description: "Orders replaced instead of refunded.",
    fileTypes: ["replacement_orders"],
  },
  {
    id: "borrowing",
    title: "Digital borrowing",
    description: "Kindle Unlimited and library loans over time.",
    fileTypes: ["digital_borrowed_items"],
  },
  {
    id: "cart",
    title: "Cart history",
    description: "Items saved to cart (conversion analysis when paired with orders).",
    fileTypes: ["cart_history"],
  },
];

export function getAvailableInsights(schemas: FileSchemaInfo[]): DataInsight[] {
  const present = new Set(
    schemas
      .map((s) => s.fileType)
      .filter((t) => ANALYTICS_FILE_TYPES.includes(t)),
  );

  return DATA_INSIGHTS.filter((insight) =>
    insight.fileTypes.some((type) => present.has(type)),
  );
}

export function getIngestedFileSummary(schemas: FileSchemaInfo[]) {
  return schemas
    .filter((s) => s.fileType !== "unknown")
    .map((s) => ({
      label: FILE_TYPE_LABELS[s.fileType],
      rows: s.rowCount,
      fileType: s.fileType,
    }));
}

export const DATA_FOLDER_GUIDE: Array<{
  file: string;
  fileType: AmazonFileType | "skip";
  use: string;
}> = [
  {
    file: "Your Amazon Orders/Order History.csv",
    fileType: "order_history",
    use: "Core retail spend — unit prices, payment methods, order dates.",
  },
  {
    file: "Your Amazon Orders/Digital Content Orders.csv",
    fileType: "digital_content_orders",
    use: "Audible, Kindle, Prime Video — Price Amount rows only (tax excluded).",
  },
  {
    file: "Your Amazon Orders/Cart History.csv",
    fileType: "cart_history",
    use: "Saved-for-later items; cart-to-purchase funnel when combined with orders.",
  },
  {
    file: "Your Amazon Orders/Digital Borrowed Items.csv",
    fileType: "digital_borrowed_items",
    use: "Kindle Unlimited / library loans — reading habits, not purchases.",
  },
  {
    file: "Your Amazon Orders/Digital Returns.csv",
    fileType: "digital_returns",
    use: "Refunds on digital content (books, subscriptions).",
  },
  {
    file: "Your Returns & Refunds/Refund Details.csv",
    fileType: "refund_details",
    use: "Refund amounts, dates, and reversal reasons for physical orders.",
  },
  {
    file: "Your Returns & Refunds/Returns Status.csv",
    fileType: "returns_status",
    use: "Return amounts, resolutions (Refund vs Replacement), and reasons.",
  },
  {
    file: "Your Returns & Refunds/Return Requests.csv",
    fileType: "return_requests",
    use: "Return reason codes at request time.",
  },
  {
    file: "Your Returns & Refunds/Replacement Orders.csv",
    fileType: "replacement_orders",
    use: "Maps original order IDs to replacement shipments.",
  },
  {
    file: "Additional Data/Your Orders.Returns.2/Your Orders.Returns.2.csv",
    fileType: "orders_returns_v2",
    use: "Alternate returns export — merged into refund analytics.",
  },
  {
    file: "Whole Foods Orders/Communication Preferences.csv",
    fileType: "skip",
    use: "Phone number only — no spend analytics.",
  },
  {
    file: "Additional Data/Retail.TransactionalInvoicing.*.pdf",
    fileType: "skip",
    use: "PDF invoices — not ingested in MVP (CSV-only pipeline).",
  },
];