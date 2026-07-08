import type { DuckDBBundles } from "@duckdb/duckdb-wasm";

const R2_ASSET_BASE = import.meta.env.VITE_DUCKDB_ASSET_BASE?.replace(/\/$/, "");

function r2Bundles(base: string): DuckDBBundles {
  return {
    mvp: {
      mainModule: `${base}/duckdb/duckdb-mvp.wasm`,
      mainWorker: `${base}/duckdb/duckdb-browser-mvp.worker.js`,
    },
    eh: {
      mainModule: `${base}/duckdb/duckdb-eh.wasm`,
      mainWorker: `${base}/duckdb/duckdb-browser-eh.worker.js`,
    },
  };
}

/** Local same-origin bundles in dev; R2 CDN in production (Cloudflare Pages 25 MiB limit). */
export async function loadManualDuckDBBundles(): Promise<DuckDBBundles> {
  if (R2_ASSET_BASE) {
    return r2Bundles(R2_ASSET_BASE);
  }
  const { LOCAL_DUCKDB_BUNDLES } = await import("./duckdb-bundle.local");
  return LOCAL_DUCKDB_BUNDLES;
}