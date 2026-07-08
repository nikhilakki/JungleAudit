import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { AppRoute } from "@/hooks/useHashRoute";

type TermsPageProps = {
  onNavigate: (route: AppRoute) => void;
};

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <LegalPageLayout title="Terms of Service" onNavigate={onNavigate}>
      <p>Last updated: July 8, 2026</p>

      <h2 className="text-base font-semibold">Agreement</h2>
      <p>
        By using JungleAudit, you agree to these Terms of Service. If you do not agree,
        do not use the site.
      </p>

      <h2 className="text-base font-semibold">The service</h2>
      <p>
        JungleAudit is a free, browser-based tool for analyzing Amazon &quot;Request My
        Data&quot; exports. The software runs on your device. We may update, suspend, or
        discontinue the site at any time without notice.
      </p>

      <h2 className="text-base font-semibold">Your responsibilities</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>You must have the right to use the data files you upload.</li>
        <li>You use the tool and its output at your own risk.</li>
        <li>
          You will not attempt to misuse, reverse engineer, or disrupt the service in
          ways that harm others.
        </li>
      </ul>

      <h2 className="text-base font-semibold">No professional advice</h2>
      <p>
        JungleAudit does not provide financial, tax, accounting, or legal advice. Outputs
        are informational only. Consult qualified professionals for decisions that depend
        on accurate financial or legal records.
      </p>

      <h2 className="text-base font-semibold">Disclaimer of warranties</h2>
      <p>
        The site and software are provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of merchantability, fitness for a particular purpose, or
        non-infringement. We do not guarantee accuracy, availability, or error-free
        operation.
      </p>

      <h2 className="text-base font-semibold">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, JungleAudit and its contributors are not
        liable for any indirect, incidental, special, consequential, or punitive damages,
        or any loss of data, profits, or goodwill arising from your use of the site.
      </p>

      <h2 className="text-base font-semibold">Open source</h2>
      <p>
        JungleAudit is open source. Use of the source code is also governed by the
        license in the{" "}
        <a
          href="https://github.com/nikhilakki/subprime"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          GitHub repository
        </a>
        .
      </p>

      <h2 className="text-base font-semibold">Changes</h2>
      <p>
        We may revise these terms. Continued use after changes are posted constitutes
        acceptance of the updated terms. See also our{" "}
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => onNavigate("privacy")}
        >
          Privacy Policy
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => onNavigate("disclaimer")}
        >
          Disclaimer
        </button>
        .
      </p>
    </LegalPageLayout>
  );
}