import { GitHubIcon, XIcon } from "@/components/layout/SocialIcons";
import type { AppRoute } from "@/hooks/useHashRoute";
import { GITHUB_REPO_URL, X_PROFILE_URL } from "@/lib/social";

type SiteFooterProps = {
  onNavigate: (route: AppRoute) => void;
  onStartApp?: () => void;
};

export function SiteFooter({ onNavigate, onStartApp }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border pt-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
          aria-label="Site"
        >
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => onNavigate("landing")}
          >
            Home
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => (onStartApp ? onStartApp() : onNavigate("app"))}
          >
            Analyzer
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => onNavigate("disclaimer")}
          >
            Disclaimer
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => onNavigate("privacy")}
          >
            Privacy
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => onNavigate("terms")}
          >
            Terms of Service
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="JungleAudit on GitHub"
          >
            <GitHubIcon className="size-5" />
          </a>
          <a
            href={X_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Nik Akki on X"
          >
            <XIcon className="size-4" />
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        JungleAudit — local-first Amazon spend analysis. Your exports never leave this
        device.
      </p>
    </footer>
  );
}