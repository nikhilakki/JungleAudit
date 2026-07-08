import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import type { AppRoute } from "@/hooks/useHashRoute";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
  onNavigate: (route: AppRoute) => void;
};

export function LegalPageLayout({ title, children, onNavigate }: LegalPageLayoutProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-4">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        onClick={() => onNavigate("landing")}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to JungleAudit
      </button>
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
          JungleAudit
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          {title}.
        </h1>
      </header>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </article>
  );
}
