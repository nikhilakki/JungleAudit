import { Share2, Star, UserPlus } from "lucide-react";
import { GitHubIcon, XIcon } from "@/components/layout/SocialIcons";
import {
  getGitHubStarUrl,
  getXFollowUrl,
  getXShareUrl,
  X_HANDLE,
} from "@/lib/social";
import { cn } from "@/lib/utils";

type SupportProjectProps = {
  variant?: "full" | "compact";
  className?: string;
};

export function SupportProject({ variant = "full", className }: SupportProjectProps) {
  const shareUrl = getXShareUrl();

  if (variant === "compact") {
    return (
      <section
        className={cn(
          "flex flex-col gap-5 rounded-3xl bg-muted p-6 sm:flex-row sm:items-center sm:justify-between md:p-8",
          className,
        )}
      >
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-lg font-extrabold tracking-tight">
            Enjoying JungleAudit?
          </p>
          <p className="text-sm text-muted-foreground">
            Star the repo or follow @{X_HANDLE} on X — it helps more than you think.
          </p>
        </div>
        <SupportActions shareUrl={shareUrl} size="sm" />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-8 rounded-3xl bg-muted px-6 py-14 text-center md:px-10 md:py-16",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
          Show support
        </p>
        <h2 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl">
          Help JungleAudit reach more people.
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground">
          JungleAudit is free and open source. A GitHub star, a follow, or a share on X
          helps others discover private, local-first spend analysis.
        </p>
      </div>
      <SupportActions shareUrl={shareUrl} size="default" />
      <p className="text-xs text-muted-foreground">
        Built by{" "}
        <a
          href={getXFollowUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-xs"
        >
          Nikhil Akki
        </a>
      </p>
    </section>
  );
}

function SupportActions({
  shareUrl,
  size,
}: {
  shareUrl: string;
  size: "default" | "sm";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors";
  const sizing =
    size === "sm" ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm";
  const pillClass = cn(
    base,
    sizing,
    "bg-primary text-primary-foreground hover:opacity-90",
  );
  const outlineClass = cn(
    base,
    sizing,
    "border border-border bg-card text-foreground hover:bg-accent",
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
      <a
        href={getGitHubStarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={pillClass}
      >
        <GitHubIcon className="size-4" />
        <Star className="size-4 text-amber-400" />
        Star on GitHub
      </a>
      <a
        href={getXFollowUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={outlineClass}
      >
        <XIcon className="size-3.5" />
        <UserPlus className="size-4" />
        Follow @{X_HANDLE}
      </a>
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={outlineClass}
      >
        <XIcon className="size-3.5" />
        <Share2 className="size-4" />
        Share on X
      </a>
    </div>
  );
}
