import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const DUCKDB_WORKER_FILES = [
  "duckdb-browser-eh.worker.js",
  "duckdb-browser-mvp.worker.js",
] as const;

function stripLocalDuckdbAssetsPlugin(useR2Assets: boolean): Plugin {
  return {
    name: "strip-local-duckdb-assets",
    closeBundle() {
      if (!useR2Assets) return;

      const assetsDir = path.resolve("dist/assets");
      if (!fs.existsSync(assetsDir)) return;

      for (const file of fs.readdirSync(assetsDir)) {
        if (
          file.endsWith(".wasm") ||
          file.includes("duckdb-bundle.local") ||
          file.includes("duckdb-browser-eh.worker") ||
          file.includes("duckdb-browser-mvp.worker")
        ) {
          fs.unlinkSync(path.join(assetsDir, file));
        }
      }
    },
  };
}

/** Copy DuckDB worker scripts to dist/duckdb/ — WASM stays on R2, workers must be same-origin. */
function copyDuckdbWorkersPlugin(useR2Assets: boolean): Plugin {
  return {
    name: "copy-duckdb-workers",
    closeBundle() {
      if (!useR2Assets) return;

      const srcDir = path.resolve(
        "node_modules/@duckdb/duckdb-wasm/dist",
      );
      const destDir = path.resolve("dist/duckdb");
      fs.mkdirSync(destDir, { recursive: true });

      for (const file of DUCKDB_WORKER_FILES) {
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
      }
    },
  };
}

function seoSitemapPlugin(siteUrl: string): Plugin {
  // Hash routes (/#/privacy) are invalid in sitemaps — crawlers strip fragments,
  // so every hash URL deduplicates to "/". Only real paths belong here.
  const routes = ["/"];

  return {
    name: "seo-sitemap",
    closeBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = routes
        .map(
          (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.6"}</priority>
  </url>`,
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

      fs.mkdirSync(path.resolve("dist"), { recursive: true });
      fs.writeFileSync(path.resolve("dist/sitemap.xml"), xml);
    },
  };
}

const siteUrl =
  process.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "https://jungleaudit.org";
const useR2Assets = Boolean(process.env.VITE_DUCKDB_ASSET_BASE?.trim());

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoSitemapPlugin(siteUrl),
    stripLocalDuckdbAssetsPlugin(useR2Assets),
    copyDuckdbWorkersPlugin(useR2Assets),
  ],
  assetsInclude: ["**/*.wasm"],
  optimizeDeps: {
    exclude: ["@duckdb/duckdb-wasm"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    format: "es",
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "charts",
              test: /node_modules[\\/](chart\.js|react-chartjs-2|chartjs-plugin-zoom)/,
            },
            {
              name: "duckdb",
              test: /node_modules[\\/]@duckdb[\\/]|duckdb-bundle/,
            },
          ],
        },
      },
    },
  },
});