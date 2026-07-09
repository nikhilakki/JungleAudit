import { useEffect } from "react";
import type { AppRoute } from "@/hooks/useHashRoute";
import { ROUTE_META, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
): void {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSiteHead(route: AppRoute): void {
  useEffect(() => {
    const meta = ROUTE_META[route] ?? ROUTE_META.landing;
    // Fragments are invalid in canonical URLs and crawlers strip them — every
    // hash route is the same document, so they all canonicalize to the origin.
    const canonical = `${SITE_URL}/`;

    document.title = meta.title;

    upsertMeta('meta[name="description"]', { name: "description" }, meta.description);
    upsertMeta(
      'meta[name="robots"]',
      { name: "robots" },
      meta.index ? "index,follow,max-image-preview:large" : "noindex,follow",
    );

    upsertMeta('meta[property="og:title"]', { property: "og:title" }, meta.title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      meta.description,
    );
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, "website");
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonical);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, SITE_OG_IMAGE);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, meta.title);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      meta.description,
    );
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, SITE_OG_IMAGE);

    upsertLink("canonical", canonical);
  }, [route]);
}