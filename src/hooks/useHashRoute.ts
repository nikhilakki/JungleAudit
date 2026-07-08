import { useCallback, useEffect, useState } from "react";

export type AppRoute = "landing" | "app" | "disclaimer" | "privacy" | "terms";

function parseHash(hash: string): AppRoute {
  const path = hash.replace(/^#\/?/, "").toLowerCase();
  if (path === "app" || path === "analyze" || path === "home") return "app";
  if (path === "disclaimer") return "disclaimer";
  if (path === "privacy") return "privacy";
  if (path === "terms" || path === "tos") return "terms";
  if (path === "landing") return "landing";
  return "landing";
}

function routeToHash(route: AppRoute): string {
  if (route === "landing") return "#/";
  if (route === "app") return "#/app";
  return `#/${route}`;
}

export function useHashRoute() {
  const [route, setRouteState] = useState<AppRoute>(() =>
    parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => setRouteState(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: AppRoute) => {
    const hash = routeToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setRouteState(next);
  }, []);

  return { route, navigate };
}