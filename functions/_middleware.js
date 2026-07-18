/**
 * Cloudflare Pages middleware — SEO host consolidation + path redirects.
 *
 * Fixes Google Search Console exclusions:
 * - "Alternative page with proper canonical tag" — www / pages.dev returned 200
 *   with apex canonical. 301 them to https://jungleaudit.org.
 * - Soft-duplicate path URLs (/privacy, /app, …) served the SPA shell with
 *   homepage canonical via the old catch-all rewrite.
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
    const target = new URL(url.pathname + url.search + url.hash, APEX_ORIGIN);
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

  return context.next();
}
