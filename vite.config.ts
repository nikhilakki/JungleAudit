import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function seoSitemapPlugin(siteUrl: string): Plugin {
  const routes = ["/", "/#/privacy", "/#/terms", "/#/disclaimer"];

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
  process.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "https://jungleaudit.pages.dev";

export default defineConfig({
  plugins: [react(), tailwindcss(), seoSitemapPlugin(siteUrl)],
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
});