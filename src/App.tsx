import { useCallback, useState } from "react";
import { DisclaimerPage } from "@/components/legal/DisclaimerPage";
import { PrivacyDisclaimerModal } from "@/components/legal/PrivacyDisclaimerModal";
import { PrivacyPage } from "@/components/legal/PrivacyPage";
import { TermsPage } from "@/components/legal/TermsPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { type AppRoute, useHashRoute } from "@/hooks/useHashRoute";
import {
  isDisclaimerSnoozed,
  snoozeDisclaimerForWeek,
} from "@/lib/disclaimer-snooze";
import { HomePage } from "@/pages/HomePage";
import { LandingPage } from "@/pages/LandingPage";

export default function App() {
  const { route, navigate } = useHashRoute();
  const [disclaimerOpen, setDisclaimerOpen] = useState(() => !isDisclaimerSnoozed());

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
      <PrivacyDisclaimerModal
        open={disclaimerOpen}
        onAccept={() => setDisclaimerOpen(false)}
        onSnoozeForWeek={() => {
          snoozeDisclaimerForWeek();
          setDisclaimerOpen(false);
        }}
        onNavigate={handleNavigate}
      />

      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
        {route === "landing" ? <LandingPage onNavigate={navigate} /> : null}

        <div className={route === "app" ? undefined : "hidden"} aria-hidden={route !== "app"}>
          <HomePage />
        </div>

        {route === "disclaimer" ? (
          <DisclaimerPage onNavigate={navigate} />
        ) : null}
        {route === "privacy" ? <PrivacyPage onNavigate={navigate} /> : null}
        {route === "terms" ? <TermsPage onNavigate={navigate} /> : null}

        <SiteFooter onNavigate={navigate} onStartApp={handleStartApp} />
      </div>
    </>
  );
}