import { GitHubIcon, XIcon } from "@/components/layout/SocialIcons";
import type { AppRoute } from "@/hooks/useHashRoute";
import { GITHUB_REPO_URL, X_PROFILE_URL } from "@/lib/social";

type SiteFooterProps = {
  onNavigate: (route: AppRoute) => void;
  onStartApp?: () => void;
};

export function SiteFooter({ onNavigate, onStartApp }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border py-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2.5">
            <img
              src="/jungleaudit-logo.webp"
              alt=""
              width={224}
              height={224}
              className="size-7 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <span className="font-display text-lg font-extrabold tracking-tight underline decoration-[1.5px] underline-offset-4">
              JungleAudit
            </span>
          </span>
          <p className="max-w-xs text-sm text-muted-foreground">
            JungleAudit — local-first Amazon spend analysis. Your exports never leave
            this device.
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm md:flex-col md:items-end md:gap-y-3"
            aria-label="Site"
          >
            <a
              href="#/"
              className="link-underline"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("landing");
              }}
            >
              Home
            </a>
            <a
              href="#/app"
              className="link-underline"
              onClick={(event) => {
                event.preventDefault();
                if (onStartApp) {
                  onStartApp();
                } else {
                  onNavigate("app");
                }
              }}
            >
              Analyzer
            </a>
            <a href="/how-much-have-i-spent-on-amazon/" className="link-underline">
              Spending Guide
            </a>
            <a
              href="#/disclaimer"
              className="link-underline"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("disclaimer");
              }}
            >
              Disclaimer
            </a>
            <a
              href="#/privacy"
              className="link-underline"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("privacy");
              }}
            >
              Privacy
            </a>
            <a
              href="#/terms"
              className="link-underline"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("terms");
              }}
            >
              Terms of Service
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-85"
              aria-label="JungleAudit on GitHub"
            >
              <GitHubIcon className="size-5" />
            </a>
            <a
              href={X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-85"
              aria-label="Nik Akki on X"
            >
              <XIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
