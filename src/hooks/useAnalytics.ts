import { useEffect, useRef } from "react";
import type { AppRoute } from "@/hooks/useHashRoute";
import { initGa4, trackEvent, trackPageView } from "@/lib/analytics/ga4";

const DISCLAIMER_EVENT_KEY = "ja_ga_disclaimer";
import { ROUTE_META } from "@/lib/site";

type UseAnalyticsOptions = {
  route: AppRoute;
  /** GA4 loads only after the privacy disclaimer is acknowledged. */
  analyticsEnabled: boolean;
};

export function useAnalytics({ route, analyticsEnabled }: UseAnalyticsOptions): void {
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!analyticsEnabled) return;

    let cancelled = false;

    void (async () => {
      await initGa4();
      if (cancelled) return;

      const pendingDisclaimer = sessionStorage.getItem(DISCLAIMER_EVENT_KEY);
      if (pendingDisclaimer === "accepted") {
        trackEvent("disclaimer_accepted");
      } else if (pendingDisclaimer === "snoozed") {
        trackEvent("disclaimer_snoozed");
      }
      if (pendingDisclaimer) sessionStorage.removeItem(DISCLAIMER_EVENT_KEY);

      const meta = ROUTE_META[route] ?? ROUTE_META.landing;
      if (lastPathRef.current === meta.path) return;

      lastPathRef.current = meta.path;
      trackPageView(meta.path, meta.title);
    })();

    return () => {
      cancelled = true;
    };
  }, [analyticsEnabled, route]);
}