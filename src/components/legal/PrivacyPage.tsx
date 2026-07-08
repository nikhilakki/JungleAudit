import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { AppRoute } from "@/hooks/useHashRoute";

type PrivacyPageProps = {
  onNavigate: (route: AppRoute) => void;
};

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <LegalPageLayout title="Privacy Policy" onNavigate={onNavigate}>
      <p>
        JungleAudit is built to run locally. When you use this site, your Amazon export
        files are read and analyzed entirely in your browser. We do not operate a backend
        that receives, stores, or processes your order data.
      </p>

      <h2 className="text-base font-semibold">What stays on your device</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Uploaded CSV files and derived analytics tables (in browser memory)</li>
        <li>Charts, filters, and summaries computed from your data</li>
        <li>No account sign-up and no cloud upload of your exports</li>
      </ul>

      <h2 className="text-base font-semibold">Limited network activity</h2>
      <p>
        Loading JungleAudit fetches static assets from the same website origin — for
        example HTML, JavaScript, styles, and the DuckDB WebAssembly engine. Those
        requests download the app; they do not transmit your personal order files.
      </p>
      <p>
        After the app is loaded, analyzing your CSVs does not require sending file
        contents to JungleAudit or any third-party analytics endpoint operated by this
        project.
      </p>

      <h2 className="text-base font-semibold">Verify it yourself (optional)</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Open your browser&apos;s developer tools (right-click → Inspect, or F12).</li>
        <li>Go to the <strong>Network</strong> tab.</li>
        <li>Reload the page and watch new requests appear.</li>
        <li>
          Upload your Amazon export and run analysis. You should not see requests that
          upload your CSV data to external domains.
        </li>
        <li>
          Filter by <strong>Fetch/XHR</strong> to focus on API-style calls. Expect
          same-origin asset loads only; no outbound payload containing your orders.
        </li>
      </ol>

      <h2 className="text-base font-semibold">Third-party hosting</h2>
      <p>
        If you access JungleAudit through a hosting provider (for example Vercel or
        GitHub Pages), that provider may log standard web server metadata such as IP
        address, user agent, and requested URLs for the static files. That logging is
        separate from your CSV analysis and does not include the contents of files you
        process locally.
      </p>

      <h2 className="text-base font-semibold">Contact</h2>
      <p>
        Questions about privacy can be directed via{" "}
        <a
          href="https://x.com/nik_akki"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          @nik_akki on X
        </a>{" "}
        or through the project repository on GitHub.
      </p>
    </LegalPageLayout>
  );
}