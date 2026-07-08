<div align="center">

<img src="public/jungleaudit-mascot.webp" alt="JungleAudit mascot" width="140" />

# JungleAudit

**Local-first Amazon spend analyzer — private, free, and open source.**

Drop your Amazon *Request My Data* export into the browser and explore spend trends, refunds, and payment breakdowns. Your CSVs never leave your device.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-2d6a4f?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![DuckDB](https://img.shields.io/badge/DuckDB--Wasm-in--browser-yellow?style=flat-square)](https://duckdb.org/)

<br />

[Features](#features) · [Privacy](#privacy) · [Request your Amazon data](#request-your-amazon-data) · [Quick start](#quick-start) · [Development](#development) · [Contributing](#contributing)

</div>

---

## Features

| Insight | What you get |
| --- | --- |
| **Spend & trends** | Total spend, order count, average order value, and time-series charts |
| **Payment methods** | Breakdown by card, UPI, gift certificate, and other instruments |
| **Refunds & net spend** | Gross vs refunded vs net, return rate, refund trends, top return reasons |
| **Digital borrowing** | Kindle Unlimited and library loan activity over time |
| **Date filtering** | Year picker and custom ranges across all charts |
| **Schema-aware ingest** | Auto-detects Amazon export file types and maps columns — no hardcoded headers in analytics |

No account. No upload step. No backend.

## Privacy

JungleAudit is built around a simple guarantee: **your order data stays on your machine.**

- Analysis runs entirely in the browser via DuckDB in a Web Worker
- CSV files are read locally — nothing is sent to a JungleAudit server
- Optional GA4 on the hosted site (aggregate traffic only — never your order data); disabled when self-hosting without a measurement ID
- Open source — inspect the pipeline yourself, or watch the Network tab while you analyze

## Request your Amazon data

JungleAudit reads the CSV files from Amazon’s **Request My Data** export (formerly “Download your data”). You must request this from the **same Amazon marketplace** where you shop — a US export won’t include orders from [amazon.in](https://www.amazon.in), for example.

### How to request

1. Open your country’s **Request your personal information** help article (table below) or go straight to **Request portal**.
2. Sign in to the Amazon account whose orders you want to analyze.
3. Select the data categories you need (at minimum **Order History** and **Digital Orders**; add returns/refunds if you want those charts).
4. Submit the request and click the confirmation link Amazon emails you.
5. When processing finishes (often within a few days), download the ZIP from the secure link in your email.
6. Unzip and drag the CSV files (or the whole folder) into JungleAudit.

Amazon’s own walkthrough matches this flow — for example, [India’s help article](https://www.amazon.in/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) links to [Request My Data](https://www.amazon.in/gp/privacycentral/dsar/preview.html).

### Country links

Help articles explain the process; **Request portal** is where you submit the export. Most marketplaces use one of two portal paths:

- `…/hz/privacy-central/data-requests/preview.html` — Americas, Europe, Japan, Singapore, Turkey
- `…/gp/privacycentral/dsar/preview.html` — India, UAE, Saudi Arabia, Egypt

| Country / region | Marketplace | Help article | Request portal |
| --- | --- | --- | --- |
| United States | [amazon.com](https://www.amazon.com) | [Request your personal information](https://www.amazon.com/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.com/hz/privacy-central/data-requests/preview.html) |
| United Kingdom | [amazon.co.uk](https://www.amazon.co.uk) | [Request your personal information](https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.co.uk/hz/privacy-central/data-requests/preview.html) |
| Canada | [amazon.ca](https://www.amazon.ca) | [Request your personal information](https://www.amazon.ca/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.ca/hz/privacy-central/data-requests/preview.html) |
| Germany | [amazon.de](https://www.amazon.de) | [Request your personal information](https://www.amazon.de/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.de/-/en/hz/privacy-central/data-requests/preview.html) |
| France | [amazon.fr](https://www.amazon.fr) | [Request your personal information](https://www.amazon.fr/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.fr/-/en/hz/privacy-central/data-requests/preview.html) |
| Spain | [amazon.es](https://www.amazon.es) | [Request your personal information](https://www.amazon.es/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.es/-/en/hz/privacy-central/data-requests/preview.html) |
| Italy | [amazon.it](https://www.amazon.it) | [Request your personal information](https://www.amazon.it/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.it/-/en/hz/privacy-central/data-requests/preview.html) |
| Netherlands | [amazon.nl](https://www.amazon.nl) | [Request your personal information](https://www.amazon.nl/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.nl/-/en/hz/privacy-central/data-requests/preview.html) |
| Belgium | [amazon.com.be](https://www.amazon.com.be) | [Request your personal information](https://www.amazon.com.be/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.com.be/-/en/hz/privacy-central/data-requests/preview.html) |
| Sweden | [amazon.se](https://www.amazon.se) | [Request your personal information](https://www.amazon.se/-/en/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.se/-/en/hz/privacy-central/data-requests/preview.html) |
| Poland | [amazon.pl](https://www.amazon.pl) | [Request your personal information](https://www.amazon.pl/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Request your data](https://www.amazon.pl/hz/privacy-central/data-requests/preview.html) |
| India | [amazon.in](https://www.amazon.in) | [Request your personal information](https://www.amazon.in/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) | [Request My Data](https://www.amazon.in/gp/privacycentral/dsar/preview.html) |
| Japan | [amazon.co.jp](https://www.amazon.co.jp) | [Security and Privacy](https://www.amazon.co.jp/-/en/gp/help/customer/display.html?nodeId=GRFTMVHP4HXMESSP) *(no dedicated help page; use portal)* | [Request your data](https://www.amazon.co.jp/hz/privacy-central/data-requests/preview.html) |
| Australia | [amazon.com.au](https://www.amazon.com.au) | [Security and Privacy](https://www.amazon.com.au/gp/help/customer/display.html?nodeId=GRFTMVHP4HXMESSP) | [Request your data](https://www.amazon.com.au/hz/privacy-central/data-requests/preview.html) |
| Singapore | [amazon.sg](https://www.amazon.sg) | [Security and Privacy](https://www.amazon.sg/gp/help/customer/display.html?nodeId=GRFTMVHP4HXMESSP) | [Request your data](https://www.amazon.sg/hz/privacy-central/data-requests/preview.html) |
| Mexico | [amazon.com.mx](https://www.amazon.com.mx) | [Solicita tu información personal](https://www.amazon.com.mx/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Solicitar mis datos](https://www.amazon.com.mx/hz/privacy-central/data-requests/preview.html) |
| Brazil | [amazon.com.br](https://www.amazon.com.br) | [Solicitar suas informações pessoais](https://www.amazon.com.br/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS) | [Solicitar seus dados](https://www.amazon.com.br/hz/privacy-central/data-requests/preview.html) |
| Turkey | [amazon.com.tr](https://www.amazon.com.tr) | [Kişisel bilgilerinizi talep etme](https://www.amazon.com.tr/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) | [Verilerinizi talep edin](https://www.amazon.com.tr/hz/privacy-central/data-requests/preview.html) |
| United Arab Emirates | [amazon.ae](https://www.amazon.ae) | [Request your personal information](https://www.amazon.ae/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) | [Request My Data](https://www.amazon.ae/gp/privacycentral/dsar/preview.html) |
| Saudi Arabia | [amazon.sa](https://www.amazon.sa) | [Request your personal information](https://www.amazon.sa/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) | [Request My Data](https://www.amazon.sa/-/en/gp/privacycentral/dsar/preview.html) |
| Egypt | [amazon.eg](https://www.amazon.eg) | [Request your personal information](https://www.amazon.eg/gp/help/customer/display.html?nodeId=G5NBVNN2RHXD5BUW) | [Request My Data](https://www.amazon.eg/gp/privacycentral/dsar/preview.html) |

If your country isn’t listed, sign in on your local Amazon site and search Help for **“Request your personal information”** or **“Request My Data”**, or try `https://www.amazon.<tld>/hz/privacy-central/data-requests/preview.html` after replacing `<tld>` with your marketplace domain.

## Quick start

### Use it locally

```bash
git clone https://github.com/nikhilakki/subprime.git
cd subprime
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`), accept the privacy notice, and go to **Analyzer**.

### Use your export

1. Request your data from Amazon — see [Request your Amazon data](#request-your-amazon-data) for country-specific help and portal links.
2. Download and unzip the export when Amazon emails you the download link.
3. Drag the CSV files (or the whole folder) into JungleAudit.

**Minimum for spend charts:** `Order History.csv` and/or `Digital Content Orders.csv`.

**Optional — unlocks more insights:** returns, refunds, cart history, digital borrowing, and replacement order files. See `src/lib/data-insights.ts` for the full file guide.

## How it works

```
CSV upload → DuckDB-Wasm ingest → canonical SQL views → analytics modules → charts
```

1. Files are registered in-browser and loaded with `read_csv_auto`
2. `src/lib/schema.ts` detects file types and maps columns to canonical fields
3. Views like `canonical_all_orders` and `canonical_all_refunds` unify disparate exports
4. SQL in `src/lib/analytics/` powers the dashboard — no hardcoded column names in chart code

## Development

```bash
pnpm install    # install dependencies
pnpm dev        # local dev server
pnpm build      # production static build → dist/
pnpm preview    # serve the production build locally
pnpm lint       # oxlint
```

### Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [@duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — SQL analytics in a Web Worker
- [Chart.js](https://www.chartjs.org/) — spend, refund, and payment visualizations
- [Tailwind CSS](https://tailwindcss.com/) 4 — UI styling

### Project layout

| Path | Role |
| --- | --- |
| `src/lib/schema.ts` | File type detection, column aliases, canonical view SQL |
| `src/workers/duckdb.worker.ts` | DuckDB init, ingest, views, queries |
| `src/hooks/useDuckDB.ts` | Upload lifecycle hook |
| `src/lib/analytics/` | One module per insight (spend, payments, returns, borrowing) |

Roadmap items live in [`TODO.md`](TODO.md).

## Contributing

Contributions are welcome — issues, docs, column mappings, and new analytics modules.

1. Fork the repo and create a branch
2. Match existing patterns: extend `FIELD_ALIASES` in `schema.ts`, add analytics under `src/lib/analytics/`
3. Run `pnpm build` and `pnpm lint` before opening a PR

Bug reports and export format edge cases are especially helpful — Amazon changes CSV headers over time and across regions.

## Author & support

Built by **[Nikhil Akki](https://x.com/nik_akki)**.

If JungleAudit helped you understand your spending:

- ⭐ [Star the repo](https://github.com/nikhilakki/subprime) on GitHub
- 𝕏 [Follow @nik_akki](https://x.com/intent/follow?screen_name=nik_akki) on X

## License

[MIT](LICENSE) © 2026 Nikhil Akki