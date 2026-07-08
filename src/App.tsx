import { lazy, Suspense, useCallback, useState } from "react";
import { PrivacyDisclaimerModal } from "@/components/legal/PrivacyDisclaimerModal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { useAnalytics } from "@/hooks/useAnalytics";
import { type AppRoute, useHashRoute } from "@/hooks/useHashRoute";
import { useSiteHead } from "@/hooks/useSiteHead";

import {
  isDisclaimerSnoozed,
  snoozeDisclaimerForWeek,
} from "@/lib/disclaimer-snooze";
import { LandingPage } from "@/pages/LandingPage";

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const DisclaimerPage = lazy(() =>
  import("@/components/legal/DisclaimerPage").then((m) => ({
    default: m.DisclaimerPage,
  })),
);
const PrivacyPage = lazy(() =>
  import("@/components/legal/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
  })),
);
const TermsPage = lazy(() =>
  import("@/components/legal/TermsPage").then((m) => ({ default: m.TermsPage })),
);

function RouteFallback({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}

export default function App() {
  const { route, navigate } = useHashRoute();
  const [disclaimerOpen, setDisclaimerOpen] = useState(() => !isDisclaimerSnoozed());
  const analyticsEnabled = !disclaimerOpen;

  useSiteHead(route);
  useAnalytics({ route, analyticsEnabled });

  const handleNavigate = useCallback(
    (next: AppRoute) => {
      if (next !== "app") {
        setDisclaimerOpen(false);
      }
      navigate(next);
    },
    [navigate],
  );

  const handleStartApp = useCallback(() => {
    navigate("app");
  }, [navigate]);

  return (
    <>
      <JsonLd route={route} />

      <PrivacyDisclaimerModal
        open={disclaimerOpen}
        onAccept={() => {
          sessionStorage.setItem("ja_ga_disclaimer", "accepted");
          setDisclaimerOpen(false);
        }}
        onSnoozeForWeek={() => {
          snoozeDisclaimerForWeek();
          sessionStorage.setItem("ja_ga_disclaimer", "snoozed");
          setDisclaimerOpen(false);
        }}
        onNavigate={handleNavigate}
      />

      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
        {route === "landing" ? <LandingPage onNavigate={navigate} /> : null}

        {route === "app" ? (
          <Suspense fallback={<RouteFallback label="Loading analyzer…" />}>
            <HomePage />
          </Suspense>
        ) : null}

        {route === "disclaimer" ? (
          <Suspense fallback={<RouteFallback label="Loading…" />}>
            <DisclaimerPage onNavigate={navigate} />
          </Suspense>
        ) : null}
        {route === "privacy" ? (
          <Suspense fallback={<RouteFallback label="Loading…" />}>
            <PrivacyPage onNavigate={navigate} />
          </Suspense>
        ) : null}
        {route === "terms" ? (
          <Suspense fallback={<RouteFallback label="Loading…" />}>
            <TermsPage onNavigate={navigate} />
          </Suspense>
        ) : null}

        <SiteFooter onNavigate={navigate} onStartApp={handleStartApp} />
      </div>
    </>
  );
}