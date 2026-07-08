import { Lock, Network } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} dismissible={false}>
      <DialogHeader>
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <DialogTitle>Your data stays on this device</DialogTitle>
            <DialogDescription>
              JungleAudit runs entirely in your browser. Your Amazon export files are
              never uploaded to our servers.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="flex flex-col gap-4">
        <ul className="list-disc space-y-2 pl-5">
          <li>CSV analysis happens locally using DuckDB in a browser worker.</li>
          <li>No accounts, tracking pixels, or server-side storage of your orders.</li>
          <li>
            The site only loads its own static files (JS, WASM) — not your personal
            data.
          </li>
        </ul>

        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/70"
          onClick={() => setShowNetworkTip((prev) => !prev)}
        >
          <span className="flex items-center gap-2 font-medium">
            <Network className="size-4 text-primary" />
            Optional: verify with Inspect / Network tab
          </span>
          <span className="text-xs text-muted-foreground">
            {showNetworkTip ? "Hide" : "Show"}
          </span>
        </button>

        {showNetworkTip ? (
          <ol className="list-decimal space-y-2 rounded-lg border border-border bg-muted/30 px-4 py-3 pl-8 text-muted-foreground">
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
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => onNavigate("privacy")}
          >
            Privacy Policy
          </button>
          ,{" "}
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => onNavigate("disclaimer")}
          >
            Disclaimer
          </button>
          , and{" "}
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => onNavigate("terms")}
          >
            Terms of Service
          </button>
          .
        </p>
      </DialogContent>

      <DialogFooter className="sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground sm:w-auto"
          onClick={onSnoozeForWeek}
        >
          Don&apos;t show this for a week
        </Button>
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={onAccept}>
          I understand — continue
        </Button>
      </DialogFooter>
    </Dialog>
  );
}