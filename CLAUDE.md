# JungleAudit

Local-first Amazon spend analyzer. Static Vite SPA; all analytics run in-browser.

## Stack

- Vite + React 18 + TypeScript (pnpm)
- `@duckdb/duckdb-wasm` MVP/EH bundles via same-origin assets in `src/lib/duckdb-bundle.ts` (not jsdelivr — cross-origin Worker blocked on localhost)
- Tailwind CSS 4, shadcn-style UI in `src/components/ui/`
- Observable Plot for charts (`src/components/charts/PlotChart.tsx`)

## Architecture

- **Ingestion:** Upload CSV → `registerFileBuffer` → `read_csv_auto` → `raw_*` tables
- **Schema:** `src/lib/schema.ts` maps detected columns to canonical fields (no hardcoded headers in analytics)
- **Views:** `canonical_order_history`, `canonical_digital_content_orders`, `canonical_all_orders`
- **Analytics:** SQL modules in `src/lib/analytics/` query canonical views only
- **Main thread:** `src/lib/duckdb.ts` communicates with worker via request/response messages

## Key files

| Path | Role |
|------|------|
| `src/lib/schema.ts` | File type detection, column aliases, canonical view SQL |
| `src/workers/duckdb.worker.ts` | DuckDB init, ingest, view creation, queries |
| `src/hooks/useDuckDB.ts` | React hook for upload lifecycle |
| `src/lib/analytics/spend-trends.ts` | Total spend + monthly trend SQL |

## Conventions

- Extend column mappings in `FIELD_ALIASES` inside `schema.ts`, not inline in SQL
- New analytics = new module under `src/lib/analytics/`
- Remaining work tracked in `TODO.md`, not here