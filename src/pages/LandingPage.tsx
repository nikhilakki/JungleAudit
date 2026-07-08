import {
  BarChart3,
  BookOpen,
  CreditCard,
  Lock,
  RotateCcw,
  Shield,
  Upload,
  Wallet,
} from "lucide-react";
import { Mascot } from "@/components/brand/Mascot";
import {
  FlowStepsVisual,
  LocalPrivacyDiagram,
  PaymentDonutMock,
  SpendTrendMock,
} from "@/components/landing/LandingVisuals";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { SupportProject } from "@/components/layout/SupportProject";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppRoute } from "@/hooks/useHashRoute";
import { trackEvent } from "@/lib/analytics/ga4";

const HERO_WIDTH = 1248;
const HERO_HEIGHT = 832;

const FEATURES = [
  {
    icon: Wallet,
    title: "Total spend & trends",
    description: "See lifetime spend, order counts, and monthly charts from your export.",
    visual: "trend" as const,
  },
  {
    icon: CreditCard,
    title: "Payment breakdown",
    description: "Understand how much went on each card, UPI, or gift balance.",
    visual: "payments" as const,
  },
  {
    icon: RotateCcw,
    title: "Refunds & net spend",
    description: "Subtract returns, spot top reasons, and track refund trends over time.",
    visual: "refunds" as const,
  },
  {
    icon: BookOpen,
    title: "Digital borrowing",
    description: "Kindle Unlimited and library loans — reading habits separate from purchases.",
    visual: "borrow" as const,
  },
] as const;

type LandingPageProps = {
  onNavigate: (route: AppRoute) => void;
};

function trackCta(action: string) {
  trackEvent("cta_click", { action, page: "landing" });
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="flex flex-col gap-20 pb-4">
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/80 via-card to-card p-6 md:p-10"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Mascot size="md" priority />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                JungleAudit
              </p>
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-semibold tracking-tight md:text-5xl"
            >
              Understand your Amazon spending — privately
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Upload your &quot;Request My Data&quot; export and get charts, totals, and
              refund insights in seconds. Everything runs in your browser. Nothing is
              uploaded to a server.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  trackCta("start_analyzing");
                  onNavigate("app");
                }}
              >
                <Upload className="size-4" />
                Start analyzing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackCta("privacy");
                  onNavigate("privacy");
                }}
              >
                <Shield className="size-4" />
                How privacy works
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-4 text-primary" />
                Local-only analysis
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="size-4 text-primary" />
                No account required
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="/landing-hero.webp"
              srcSet="/landing-hero-640.webp 640w, /landing-hero-960.webp 960w, /landing-hero.webp 1248w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="JungleAudit explorer mascot reviewing Amazon spend charts on a laptop"
              width={HERO_WIDTH}
              height={HERO_HEIGHT}
              decoding="async"
              fetchPriority="high"
              className="w-full rounded-xl border border-border/80 object-cover shadow-lg"
            />
            <Card className="absolute -bottom-4 -left-2 max-w-[220px] border-primary/20 bg-card/95 shadow-md backdrop-blur-sm md:-left-6">
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Sample trend
                </p>
                <SpendTrendMock className="mt-2 h-16" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading" className="flex flex-col gap-8">
        <div className="text-center">
          <h2
            id="how-it-works-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Three steps from Amazon export to actionable spend insights.
          </p>
        </div>
        <FlowStepsVisual />
      </section>

      <section aria-labelledby="features-heading" className="flex flex-col gap-8">
        <div>
          <h2
            id="features-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            What you can learn
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            JungleAudit maps your CSV columns automatically and surfaces insights based on
            which files you include.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto rounded-lg border border-border/60 bg-muted/30 p-4">
                    {feature.visual === "trend" ? (
                      <SpendTrendMock className="h-20" />
                    ) : null}
                    {feature.visual === "payments" ? (
                      <div className="flex items-center gap-4">
                        <div className="size-20 shrink-0">
                          <PaymentDonutMock />
                        </div>
                        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary" />
                            Card · 62%
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-destructive" />
                            UPI · 24%
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[oklch(0.6_0.12_250)]" />
                            Gift · 14%
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {feature.visual === "refunds" ? (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md bg-card px-2 py-3">
                          <p className="text-lg font-semibold text-foreground">$4.2k</p>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Gross
                          </p>
                        </div>
                        <div className="rounded-md bg-card px-2 py-3">
                          <p className="text-lg font-semibold text-destructive">−$380</p>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Refunded
                          </p>
                        </div>
                        <div className="rounded-md bg-primary/10 px-2 py-3">
                          <p className="text-lg font-semibold text-primary">$3.8k</p>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Net
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {feature.visual === "borrow" ? (
                      <div className="flex items-end justify-between gap-2 px-2">
                        {[12, 28, 18, 34, 22, 40].map((h, i) => (
                          <div
                            key={i}
                            className="w-full rounded-t bg-primary/50"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="size-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Your orders never leave your machine
            </h2>
            <p className="text-muted-foreground">
              JungleAudit uses DuckDB in a browser worker to query your files locally.
              There is no backend ingestion step. You can verify this yourself in
              DevTools → Network while uploading and analyzing.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>No account or email required</li>
              <li>No CSV upload to third-party analytics</li>
              <li>Open source — inspect the code on GitHub</li>
            </ul>
            <Button className="w-fit" variant="outline" onClick={() => onNavigate("app")}>
              Open the analyzer
            </Button>
          </div>
          <div className="flex justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
            <LocalPrivacyDiagram />
          </div>
        </div>
      </section>

      <LandingFaq />

      <SupportProject />

      <section
        aria-labelledby="cta-heading"
        className="flex flex-col items-center gap-6 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent px-6 py-12 text-center"
      >
        <Mascot size="lg" />
        <h2
          id="cta-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Ready to audit your Amazon spend?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Drop your export folder and explore trends in under a minute.
        </p>
        <Button
          size="lg"
          onClick={() => {
            trackCta("get_started");
            onNavigate("app");
          }}
        >
          Get started — it&apos;s free
        </Button>
      </section>
    </main>
  );
}