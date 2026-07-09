import { GITHUB_REPO_URL } from "@/lib/social";

export const SITE_NAME = "JungleAudit";

export const SITE_TAGLINE =
  "Local-first Amazon spend analyzer — private, free, and open source.";

export const SITE_DESCRIPTION =
  "Upload your Amazon Request My Data export and explore spend trends, refunds, and payment breakdowns entirely in your browser. No account, no server upload — your CSVs never leave your device.";

/** Public site URL (set at build time for Cloudflare Pages or custom domain). */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "https://jungleaudit.org";

// Must stay the purpose-built 1200×630 share card — index.html's static
// og:image:width/height/alt tags describe this file.
export const SITE_OG_IMAGE = `${SITE_URL}/og-image.webp`;

export const SITE_KEYWORDS = [
  "Amazon spend analyzer",
  "Amazon order history",
  "Request My Data",
  "personal finance",
  "local-first analytics",
  "privacy",
  "DuckDB",
  "CSV analyzer",
  "refund tracker",
  "Amazon export",
].join(", ");

export const SITE_AUTHOR = {
  name: "Nikhil Akki",
  url: "https://x.com/nik_akki",
};

export const LANDING_FAQ = [
  {
    question: "What is JungleAudit?",
    answer:
      "JungleAudit is a free, open-source web app that analyzes your Amazon spending from the CSV files in Amazon's Request My Data export. It runs entirely in your browser using DuckDB — your order files are never uploaded to a server.",
  },
  {
    question: "How do I get my Amazon data for JungleAudit?",
    answer:
      "Sign in to your Amazon account, submit a Request My Data (personal information) request for Order History and Digital Orders, confirm via email, then download the ZIP when ready. Unzip the CSVs and drop them into JungleAudit.",
  },
  {
    question: "Does JungleAudit upload my Amazon orders to the cloud?",
    answer:
      "No. JungleAudit reads your CSV files locally in a browser worker and queries them with DuckDB WASM. You can verify this in DevTools → Network while uploading and analyzing — no outbound requests contain your order data.",
  },
  {
    question: "What insights does JungleAudit provide?",
    answer:
      "Total spend and monthly trends, payment method breakdown, refunds and net spend, return reasons, Kindle Unlimited and library borrowing activity, and date-range filtering across charts — depending on which export files you include.",
  },
  {
    question: "Do I need an account to use JungleAudit?",
    answer:
      "No account or sign-up is required. Open the site, accept the privacy notice, upload your export, and explore charts immediately.",
  },
] as const;

export const SITE_LINKS = {
  github: GITHUB_REPO_URL,
  app: `${SITE_URL}/#/app`,
  privacy: `${SITE_URL}/#/privacy`,
  terms: `${SITE_URL}/#/terms`,
  disclaimer: `${SITE_URL}/#/disclaimer`,
} as const;

export type RouteMeta = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
};

export const ROUTE_META: Record<string, RouteMeta> = {
  landing: {
    title: `${SITE_NAME} — Understand your Amazon spending, privately`,
    description: SITE_DESCRIPTION,
    path: "/",
    index: true,
  },
  app: {
    title: `Analyzer — ${SITE_NAME}`,
    description:
      "Upload your Amazon Request My Data export and analyze spend, refunds, and payments locally in your browser.",
    path: "/app",
    index: false,
  },
  privacy: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description:
      "How JungleAudit handles your data: local-only CSV analysis, optional analytics, and no server upload of orders.",
    path: "/privacy",
    index: true,
  },
  terms: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: `Terms for using the ${SITE_NAME} local-first Amazon spend analyzer.`,
    path: "/terms",
    index: true,
  },
  disclaimer: {
    title: `Disclaimer — ${SITE_NAME}`,
    description: `Important disclaimers for using ${SITE_NAME} with your personal Amazon export data.`,
    path: "/disclaimer",
    index: true,
  },
};