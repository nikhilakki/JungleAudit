import type { ReactNode } from "react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { AppRoute } from "@/hooks/useHashRoute";

type TermsPageProps = {
  onNavigate: (route: AppRoute) => void;
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <LegalPageLayout title="Terms of Service" onNavigate={onNavigate}>
      <p>Last updated: July 8, 2026</p>

      <SectionHeading>Agreement</SectionHeading>
      <p>
        By using JungleAudit, you agree to these Terms of Service. If you do not agree,
        do not use the site.
      </p>

      <SectionHeading>The service</SectionHeading>
      <p>
        JungleAudit is a free, browser-based tool for analyzing Amazon &quot;Request My
        Data&quot; exports. The software runs on your device. We may update, suspend, or
        discontinue the site at any time without notice.
      </p>

      <SectionHeading>Your responsibilities</SectionHeading>
      <ul className="list-disc space-y-2 rounded-3xl bg-muted p-6 pl-11 md:p-8 md:pl-13">
        <li>You must have the right to use the data files you upload.</li>
        <li>You use the tool and its output at your own risk.</li>
        <li>
          You will not attempt to misuse, reverse engineer, or disrupt the service in
          ways that harm others.
        </li>
      </ul>

      <SectionHeading>No professional advice</SectionHeading>
      <p>
        JungleAudit does not provide financial, tax, accounting, or legal advice. Outputs
        are informational only. Consult qualified professionals for decisions that depend
        on accurate financial or legal records.
      </p>

      <SectionHeading>Disclaimer of warranties</SectionHeading>
      <p>
        The site and software are provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of merchantability, fitness for a particular purpose, or
        non-infringement. We do not guarantee accuracy, availability, or error-free
        operation.
      </p>

      <SectionHeading>Limitation of liability</SectionHeading>
      <p>
        To the fullest extent permitted by law, JungleAudit and its contributors are not
        liable for any indirect, incidental, special, consequential, or punitive damages,
        or any loss of data, profits, or goodwill arising from your use of the site.
      </p>

      <SectionHeading>Open source</SectionHeading>
      <p>
        JungleAudit is open source. Use of the source code is also governed by the
        license in the{" "}
        <a
          href="https://github.com/nikhilakki/subprime"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          GitHub repository
        </a>
        .
      </p>

      <SectionHeading>Changes</SectionHeading>
      <p>
        We may revise these terms. Continued use after changes are posted constitutes
        acceptance of the updated terms. See also our{" "}
        <button
          type="button"
          className="link-underline"
          onClick={() => onNavigate("privacy")}
        >
          Privacy Policy
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="link-underline"
          onClick={() => onNavigate("disclaimer")}
        >
          Disclaimer
        </button>
        .
      </p>
    </LegalPageLayout>
  );
}
