import { Lock, Network } from "lucide-react";
import { useId, useState } from "react";
import type { AppRoute } from "@/hooks/useHashRoute";

type PrivacyDisclaimerModalProps = {
  open: boolean;
  onAccept: () => void;
  onSnoozeForWeek: () => void;
  onNavigate: (route: AppRoute) => void;
};

export function PrivacyDisclaimerModal({
  open,
  onAccept,
  onSnoozeForWeek,
  onNavigate,
}: PrivacyDisclaimerModalProps) {
  const [showNetworkTip, setShowNetworkTip] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 flex max-h-[min(90svh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-card"
      >
        <div className="flex items-start gap-4 px-6 pb-4 pt-7 md:px-8">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Lock className="size-5" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2
              id={titleId}
              className="font-display text-xl font-extrabold leading-[1.1] tracking-tight md:text-2xl"
            >
              Your data stays on this device.
            </h2>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              JungleAudit runs entirely in your browser. Your Amazon export files are
              never uploaded to our servers.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-4 text-sm leading-relaxed md:px-8">
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>CSV analysis happens locally using DuckDB in a browser worker.</li>
            <li>No accounts, tracking pixels, or server-side storage of your orders.</li>
            <li>
              The site only loads its own static files (JS, WASM) — not your personal
              data.
            </li>
          </ul>

          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-2xl bg-muted px-4 py-3 text-left text-sm transition-opacity hover:opacity-80"
            onClick={() => setShowNetworkTip((prev) => !prev)}
          >
            <span className="flex items-center gap-2 font-medium">
              <Network className="size-4" aria-hidden="true" />
              Optional: verify with Inspect / Network tab
            </span>
            <span className="text-xs text-muted-foreground">
              {showNetworkTip ? "Hide" : "Show"}
            </span>
          </button>

          {showNetworkTip ? (
            <ol className="list-decimal space-y-2 rounded-2xl bg-muted px-5 py-4 pl-10 text-muted-foreground">
              <li>Right-click the page → Inspect (or press F12).</li>
              <li>Open the Network tab and reload the page.</li>
              <li>Upload your export and run analysis.</li>
              <li>
                Confirm there are no requests sending your CSV contents to external
                domains. Same-origin asset loads for the app engine are expected.
              </li>
            </ol>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Full details in our{" "}
            <button
              type="button"
              className="link-underline text-xs"
              onClick={() => onNavigate("privacy")}
            >
              Privacy Policy
            </button>
            ,{" "}
            <button
              type="button"
              className="link-underline text-xs"
              onClick={() => onNavigate("disclaimer")}
            >
              Disclaimer
            </button>
            , and{" "}
            <button
              type="button"
              className="link-underline text-xs"
              onClick={() => onNavigate("terms")}
            >
              Terms of Service
            </button>
            .
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2.5 px-6 pb-7 pt-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:w-auto"
            onClick={onSnoozeForWeek}
          >
            Don&apos;t show this for a week
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            onClick={onAccept}
          >
            I understand — continue
          </button>
        </div>
      </div>
    </div>
  );
}
