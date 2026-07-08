import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { AppRoute } from "@/hooks/useHashRoute";

type DisclaimerPageProps = {
  onNavigate: (route: AppRoute) => void;
};

export function DisclaimerPage({ onNavigate }: DisclaimerPageProps) {
  return (
    <LegalPageLayout title="Disclaimer" onNavigate={onNavigate}>
      <p>
        JungleAudit is a personal finance analysis tool. It helps you explore Amazon
        order exports on your own device. It is not financial, tax, or legal advice.
      </p>
      <p>
        Spend totals, trends, and other metrics are derived from the files you upload.
        Amazon exports can be incomplete, duplicated, or formatted differently over time.
        Treat all figures as estimates for personal insight, not as official records.
      </p>
      <div className="rounded-3xl bg-muted p-6 md:p-8">
        <p>
          You are responsible for the files you choose to analyze and for how you use the
          results. JungleAudit is provided &quot;as is&quot; without warranties of any
          kind.
        </p>
      </div>
      <p>
        Your data stays on your device. JungleAudit does not send your CSV contents to
        any server. See the{" "}
        <button
          type="button"
          className="link-underline"
          onClick={() => onNavigate("privacy")}
        >
          Privacy Policy
        </button>{" "}
        for details on local processing and the limited network activity required to load
        the app itself.
      </p>
    </LegalPageLayout>
  );
}
