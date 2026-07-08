import { Share2, Star, UserPlus } from "lucide-react";
import { GitHubIcon, XIcon } from "@/components/layout/SocialIcons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className={cn("border-primary/20 bg-accent/30", className)}>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Enjoying JungleAudit?</p>
            <p className="text-sm text-muted-foreground">
              Star the repo or follow @{X_HANDLE} on X — it helps more than you think.
            </p>
          </div>
          <SupportActions shareUrl={shareUrl} size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <section
      className={cn(
        "flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-10 text-center md:px-10",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Show support
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Help JungleAudit reach more people
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
          className="font-medium text-primary underline-offset-4 hover:underline"
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
  const linkClass = cn(buttonVariants({ variant: "outline", size }));

  return (
    <div className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
      <a
        href={getGitHubStarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <GitHubIcon className="size-4" />
        <Star className="size-4 text-amber-500" />
        Star on GitHub
      </a>
      <a
        href={getXFollowUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <XIcon className="size-3.5" />
        <UserPlus className="size-4" />
        Follow @{X_HANDLE}
      </a>
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <XIcon className="size-3.5" />
        <Share2 className="size-4" />
        Share on X
      </a>
    </div>
  );
}