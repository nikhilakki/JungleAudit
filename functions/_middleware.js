/**
 * Cloudflare Pages middleware — SEO host consolidation + path redirects.
 *
 * Fixes Google Search Console exclusions:
 * - "Alternative page with proper canonical tag" — www / pages.dev returned 200
 *   with apex canonical. 301 them to https://jungleaudit.org.
 * - Soft-duplicate path URLs (/privacy, /app, …) that used to serve the SPA shell
 *   with homepage canonical.
 *
 * Domain-level redirects are not supported in public/_redirects, so host
 * consolidations run here.
 */

const APEX_HOST = "jungleaudit.org";
const APEX_ORIGIN = `https://${APEX_HOST}`;

const ALIAS_HOSTS = new Set(["www.jungleaudit.org", "jungleaudit.pages.dev"]);

const PATH_TO_HASH = {
  "/app": "/#/app",
  "/analyze": "/#/app",
  "/home": "/#/app",
  "/privacy": "/#/privacy",
  "/terms": "/#/terms",
  "/tos": "/#/terms",
  "/disclaimer": "/#/disclaimer",
};

/** Paths / prefixes that map to real static assets in public/ or the Vite build. */
function isStaticPath(pathname) {
  if (pathname === "/" || pathname === "") return true;
  if (pathname.startsWith("/how-much-have-i-spent-on-amazon")) return true;
  if (pathname.startsWith("/assets/")) return true;
  if (pathname.startsWith("/duckdb/")) return true;
  if (pathname.startsWith("/fonts/")) return true;
  // Any remaining file with an extension (favicon, robots.txt, images, wasm, …)
  if (/\.[a-zA-Z0-9]{1,12}$/.test(pathname)) return true;
  return false;
}

function redirect(location, status = 301) {
  return new Response(null, {
    status,
    headers: {
      Location: location,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  // 1) Host consolidation — primary GSC alternate-canonical fix.
  if (ALIAS_HOSTS.has(host)) {
    const target = new URL(url.pathname + url.search, APEX_ORIGIN);
    return redirect(target.toString(), 301);
  }

  // 2) Path-style SPA routes → hash routes (no soft-duplicate index.html).
  const path =
    url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname;
  const hashDest = PATH_TO_HASH[path];
  if (hashDest) {
    return redirect(`${APEX_ORIGIN}${hashDest}${url.search}`, 302);
  }

  // 3) Unknown extensionless paths would otherwise soft-serve index.html on
  //    some Pages setups (same document + homepage canonical). Return a hard
  //    404 so Google does not treat them as alternate pages.
  if (!isStaticPath(url.pathname)) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return context.next();
}
