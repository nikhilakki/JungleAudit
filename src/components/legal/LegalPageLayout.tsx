import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppRoute } from "@/hooks/useHashRoute";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
  onNavigate: (route: AppRoute) => void;
};

export function LegalPageLayout({ title, children, onNavigate }: LegalPageLayoutProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit px-0 hover:bg-transparent"
        onClick={() => onNavigate("landing")}
      >
        <ArrowLeft className="size-4" />
        Back to JungleAudit
      </Button>
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          JungleAudit
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      </header>
      <div className="prose-legal flex flex-col gap-4 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </article>
  );
}