import { useRef, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, ShoppingCart, Upload } from "lucide-react";
import { FlowStepsVisual } from "@/components/landing/LandingVisuals";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { SupportProject } from "@/components/layout/SupportProject";
import { Button } from "@/components/ui/button";
import type { AppRoute } from "@/hooks/useHashRoute";
import { trackEvent } from "@/lib/analytics/ga4";
import { GITHUB_REPO_URL } from "@/lib/social";
import { cn } from "@/lib/utils";

const HERO_WIDTH = 1248;
const HERO_HEIGHT = 832;

type FeatureCard = {
  title: string;
  description: string;
  surface: string;
  ink: "black" | "white";
  ornament: "rings" | "crosshair" | "arcs" | "orbit";
};

const FEATURES: FeatureCard[] = [
  {
    title: "Total spend & trends",
    description: "See lifetime spend, order counts, and monthly charts from your export.",
    surface: "bg-pink",
    ink: "black",
    ornament: "rings",
  },
  {
    title: "Payment breakdown",
    description: "Understand how much went on each card, UPI, or gift balance.",
    surface: "bg-cobalt",
    ink: "white",
    ornament: "crosshair",
  },
  {
    title: "Refunds & net spend",
    description: "Subtract returns, spot top reasons, and track refund trends over time.",
    surface: "bg-cyan",
    ink: "black",
    ornament: "arcs",
  },
  {
    title: "Digital borrowing",
    description: "Kindle Unlimited and library loans — reading habits separate from purchases.",
    surface: "bg-tan",
    ink: "black",
    ornament: "orbit",
  },
];

const ROLES = [
  {
    icon: ShoppingCart,
    title: "Casual buyers",
    copy: "See what a year of everyday orders actually adds up to — totals, order counts, and monthly trends at a glance.",
  },
  {
    icon: BarChart3,
    title: "Power shoppers",
    copy: "Break spend down by payment method, compare refunds against gross spend, and spot your heaviest months.",
  },
  {
    icon: BookOpen,
    title: "Kindle readers",
    copy: "Separate Kindle Unlimited and library borrowing from purchases to see reading habits alongside spending.",
  },
] as const;

type LandingPageProps = {
  onNavigate: (route: AppRoute) => void;
};

function trackCta(action: string) {
  trackEvent("cta_click", { action, page: "landing" });
}

function Eyebrow({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        light && "text-white/90",
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", light ? "bg-white" : "bg-foreground")}
        aria-hidden="true"
      />
      {label}
    </p>
  );
}

function ConcentricCirclesMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 204 60"
      className={cn("h-10 w-auto text-foreground md:h-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {[30, 66, 102, 138, 174].map((cx) => (
        <circle key={cx} cx={cx} cy="30" r="27" />
      ))}
    </svg>
  );
}

function LogoLockup() {
  return (
    <a
      href="#/"
      className="flex items-center gap-2.5 text-foreground"
      aria-label="JungleAudit home"
    >
      <img
        src="/jungleaudit-logo.webp"
        alt=""
        width={224}
        height={224}
        className="size-9 rounded-full"
        aria-hidden="true"
      />
      <span className="font-display text-xl font-extrabold tracking-tight underline decoration-[1.5px] underline-offset-4">
        JungleAudit
      </span>
    </a>
  );
}

function CardOrnament({
  variant,
  className,
}: {
  variant: FeatureCard["ornament"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn(
        "pointer-events-none absolute -bottom-10 -right-10 size-44 opacity-80",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {variant === "rings" ? (
        <>
          <circle cx="80" cy="80" r="72" />
          <circle cx="80" cy="80" r="52" />
          <circle cx="80" cy="80" r="32" />
        </>
      ) : null}
      {variant === "crosshair" ? (
        <>
          <circle cx="80" cy="80" r="64" />
          <path d="M80 2v156M2 80h156" />
          <circle cx="80" cy="80" r="12" />
        </>
      ) : null}
      {variant === "arcs" ? (
        <>
          <path d="M8 152A144 144 0 0 1 152 8" />
          <path d="M44 152A108 108 0 0 1 152 44" />
          <path d="M80 152a72 72 0 0 1 72-72" />
        </>
      ) : null}
      {variant === "orbit" ? (
        <>
          <circle cx="84" cy="84" r="60" />
          <circle cx="84" cy="84" r="26" />
          <circle cx="132" cy="40" r="11" />
          <path d="M24 144l34-34" />
        </>
      ) : null}
    </svg>
  );
}

type SqlToken = { text: string; tone?: "kw" | "fn" | "comment" };

type InsightPreview = {
  key: string;
  tab: string;
  question: string;
  lines: SqlToken[][];
  result: string;
};

const kw = (text: string): SqlToken => ({ text, tone: "kw" });
const fn = (text: string): SqlToken => ({ text, tone: "fn" });
const t = (text: string): SqlToken => ({ text });

const INSIGHT_PREVIEWS: InsightPreview[] = [
  {
    key: "spend",
    tab: "Spend",
    question: "How much did I spend last year?",
    lines: [
      [{ text: "-- runs locally in your browser", tone: "comment" }],
      [kw("SELECT"), t(" "), fn("strftime"), t("(order_date, "), fn("'%Y-%m'"), t(") "), kw("AS"), t(" month,")],
      [t("       "), fn("sum"), t("(total) "), kw("AS"), t(" spend")],
      [kw("FROM"), t(" "), fn("canonical_all_orders")],
      [kw("GROUP BY"), t(" 1 "), kw("ORDER BY"), t(" 1;")],
    ],
    result: "▸ 148 rows · 0 bytes sent to any server",
  },
  {
    key: "payments",
    tab: "Payments",
    question: "Which payment method costs me the most?",
    lines: [
      [{ text: "-- cards, UPI, and gift balances, ranked", tone: "comment" }],
      [kw("SELECT"), t(" payment_method,")],
      [t("       "), fn("count"), t("(*) "), kw("AS"), t(" orders,")],
      [t("       "), fn("sum"), t("(total) "), kw("AS"), t(" spend")],
      [kw("FROM"), t(" "), fn("canonical_order_history")],
      [kw("GROUP BY"), t(" 1 "), kw("ORDER BY"), t(" spend "), kw("DESC"), t(";")],
    ],
    result: "▸ 6 rows · 0 bytes sent to any server",
  },
  {
    key: "refunds",
    tab: "Refunds",
    question: "How much did I actually get back?",
    lines: [
      [{ text: "-- returns subtracted from gross spend", tone: "comment" }],
      [kw("SELECT"), t(" "), fn("sum"), t("(refund_amount) "), kw("AS"), t(" refunded,")],
      [t("       "), fn("sum"), t("(total) - "), fn("sum"), t("(refund_amount) "), kw("AS"), t(" net_spend")],
      [kw("FROM"), t(" "), fn("canonical_all_orders"), t(";")],
    ],
    result: "▸ 1 row · 0 bytes sent to any server",
  },
  {
    key: "borrowing",
    tab: "Borrowing",
    question: "How many books did I borrow this year?",
    lines: [
      [{ text: "-- Kindle Unlimited & Prime Reading loans", tone: "comment" }],
      [kw("SELECT"), t(" "), fn("strftime"), t("(order_date, "), fn("'%Y'"), t(") "), kw("AS"), t(" year,")],
      [t("       "), fn("count"), t("(*) "), kw("AS"), t(" titles_borrowed")],
      [kw("FROM"), t(" "), fn("canonical_digital_content_orders")],
      [kw("WHERE"), t(" price = 0 "), kw("GROUP BY"), t(" 1 "), kw("ORDER BY"), t(" 1 "), kw("DESC"), t(";")],
    ],
    result: "▸ 4 rows · 0 bytes sent to any server",
  },
];

const TOKEN_CLASSES: Record<NonNullable<SqlToken["tone"]>, string> = {
  kw: "text-[#e8a33d]",
  fn: "text-[#4ade80]",
  comment: "text-white/40",
};

function InsightPreviewTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const preview = INSIGHT_PREVIEWS[activeIndex];

  const selectTab = (index: number) => {
    setActiveIndex(index);
    trackEvent("preview_tab", {
      tab: INSIGHT_PREVIEWS[index].key,
      page: "landing",
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next =
      (activeIndex + delta + INSIGHT_PREVIEWS.length) % INSIGHT_PREVIEWS.length;
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Insight previews"
        className="mt-8 flex flex-wrap gap-2"
        onKeyDown={handleKeyDown}
      >
        {INSIGHT_PREVIEWS.map((item, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={item.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`insight-tab-${item.key}`}
              aria-selected={active}
              aria-controls="insight-preview-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => selectTab(index)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:text-foreground",
              )}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="insight-preview-panel"
        aria-labelledby={`insight-tab-${preview.key}`}
        className="mt-6 overflow-hidden rounded-2xl bg-black text-white"
      >
        <div className="flex items-center justify-between gap-4 bg-[#2a2a2a] px-5 py-3.5">
          <p className="text-sm font-bold md:text-base">{preview.question}</p>
          <div className="flex shrink-0 gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
        </div>
        <pre className="min-h-56 overflow-x-auto p-6 font-mono text-sm leading-7 text-white/85">
          <code>
            {preview.lines.map((line, lineIndex) => (
              <span key={`${preview.key}-${lineIndex}`} className="block">
                {line.map((token, tokenIndex) => (
                  <span
                    key={tokenIndex}
                    className={token.tone ? TOKEN_CLASSES[token.tone] : undefined}
                  >
                    {token.text}
                  </span>
                ))}
              </span>
            ))}
            <span className="mt-4 block text-white/50">{preview.result}</span>
          </code>
        </pre>
      </div>
    </>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="flex w-full flex-col gap-16 pb-16 md:gap-24">
      {/* 1 — HERO */}
      <section
        aria-labelledby="hero-heading"
        className="hero-gradient grain w-full overflow-hidden"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8">
          <div className="flex items-start justify-between gap-6 pt-6 md:pt-8">
            <LogoLockup />
            <nav
              aria-label="Landing"
              className="hidden text-sm sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-5 sm:gap-y-2 md:flex-col md:items-end md:gap-2"
            >
              <a
                href="#/app"
                className="link-underline"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate("app");
                }}
              >
                Analyzer
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
                Terms
              </a>
              <a href="#faq" className="link-underline">
                FAQ
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                GitHub
              </a>
            </nav>
          </div>

          <div className="flex flex-col items-center gap-6 py-24 text-center md:py-32">
            <ConcentricCirclesMotif />
            <p className="text-sm font-medium text-foreground/80 md:text-base">
              Local-first Amazon spend analytics — nothing leaves your browser.
            </p>
            <h1
              id="hero-heading"
              className="max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Understand Your Amazon Spending. Privately.
            </h1>
            <p className="mx-auto max-w-xl text-base text-foreground/70 md:text-lg">
              Upload your &quot;Request My Data&quot; export and get charts, totals, and
              refund insights in seconds. Everything runs in your browser. Nothing is
              uploaded to a server.
            </p>

            <div className="mx-auto mt-2 w-full max-w-xl rounded-2xl border border-foreground/15 bg-card/70 p-5 text-left backdrop-blur">
              <p className="px-1 pb-4 text-muted-foreground">
                Drop your Request My Data export…
              </p>
              <Button
                size="lg"
                className="h-12 w-full rounded-full text-base"
                onClick={() => {
                  trackCta("start_analyzing");
                  onNavigate("app");
                }}
              >
                <Upload className="size-4" />
                Start analyzing
              </Button>
            </div>
            <p className="text-sm text-foreground/70">
              Local-only analysis · No account required
            </p>
          </div>
        </div>
      </section>

      {/* 2 — HOW IT WORKS */}
      <section
        aria-labelledby="how-it-works-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow label="How it works" />
            <h2
              id="how-it-works-heading"
              className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
            >
              From Export to Insights. In Three Steps.
            </h2>
            <p className="max-w-md text-muted-foreground">
              Three steps from Amazon export to actionable spend insights — request your
              data, drop the CSVs, and explore charts and totals.
            </p>
            <button
              type="button"
              className="group inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
              onClick={() => onNavigate("app")}
            >
              Open the analyzer
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-muted-foreground">Works with</p>
              <ul className="flex flex-wrap gap-2">
                {["Order History", "Digital Orders", "Returns", "Payments"].map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground/70"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <FlowStepsVisual />
        </div>
      </section>

      {/* 3 — BIG STATEMENT + CODE WINDOW */}
      <section
        aria-labelledby="statement-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="grid items-end gap-6 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <h2
            id="statement-heading"
            className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
          >
            Instant Spend Insights. In Seconds.
          </h2>
          <p className="text-sm text-muted-foreground md:max-w-xs md:justify-self-end md:text-base">
            JungleAudit maps your CSV columns automatically and surfaces insights based on
            which files you include.
          </p>
        </div>

        <InsightPreviewTabs />
      </section>

      {/* 4 — FEATURES */}
      <section
        aria-labelledby="features-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="flex flex-col gap-5">
          <Eyebrow label="What you can learn" />
          <h2
            id="features-heading"
            className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
          >
            Every Rupee, Every Refund, Every Read.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "grain flex min-h-[380px] flex-col overflow-hidden rounded-3xl p-6 md:p-8",
                feature.surface,
                feature.ink === "white" ? "text-white" : "text-black",
              )}
            >
              <CardOrnament variant={feature.ornament} />
              <div className="relative z-10 flex flex-1 flex-col">
                <h3 className="font-display text-2xl font-extrabold leading-[1.1] tracking-tight md:text-3xl">
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed md:text-base",
                    feature.ink === "white" ? "text-white/80" : "text-black/70",
                  )}
                >
                  {feature.description}
                </p>
                <button
                  type="button"
                  className="group mt-auto inline-flex items-center gap-1.5 self-start font-semibold underline-offset-4 hover:underline"
                  onClick={() => onNavigate("app")}
                >
                  Open the analyzer
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5 — PRIVACY */}
      <section
        aria-labelledby="privacy-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="grid overflow-hidden rounded-3xl md:grid-cols-2">
          <img
            src="/landing-hero.webp"
            srcSet="/landing-hero-640.webp 640w, /landing-hero-960.webp 960w, /landing-hero.webp 1248w"
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Abstract visualization of local, private analytics"
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            decoding="async"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="bg-cobalt grain overflow-hidden p-8 text-white md:p-12">
            <CardOrnament variant="rings" className="text-white opacity-60" />
            <div className="relative z-10 flex h-full flex-col items-start gap-5">
              <Eyebrow label="Private by design" light />
              <h2
                id="privacy-heading"
                className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl"
              >
                Your Orders Never Leave Your Machine.
              </h2>
              <p className="text-sm leading-relaxed text-white/80 md:text-base">
                JungleAudit uses DuckDB in a browser worker to query your files locally.
                There is no backend ingestion step. You can verify this yourself in
                DevTools → Network while uploading and analyzing.
              </p>
              <ul className="flex flex-col gap-2.5 text-sm text-white/90 md:text-base">
                {[
                  "No account or email required",
                  "No CSV upload to third-party analytics",
                  "Open source — inspect the code on GitHub",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="group mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-white underline-offset-4 hover:underline"
                onClick={() => {
                  trackCta("privacy");
                  onNavigate("privacy");
                }}
              >
                How privacy works
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — ROLES */}
      <section
        aria-labelledby="roles-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2
            id="roles-heading"
            className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
          >
            Built for Every Kind of Shopper.
          </h2>
          <p className="text-muted-foreground">
            Whether you order weekly, track every refund, or binge Kindle Unlimited,
            JungleAudit shows where the money goes.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.title} className="flex flex-col gap-4 border-t border-border pt-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{role.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{role.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7 — FAQ */}
      <LandingFaq />

      {/* 8 — SUPPORT */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <SupportProject />
      </div>

      {/* 9 — CTA */}
      <section
        aria-labelledby="cta-heading"
        className="mx-auto w-full max-w-6xl px-4 md:px-8"
      >
        <div className="grain relative overflow-hidden rounded-3xl bg-black px-6 py-20 text-center text-white md:py-28">
          <div
            className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle,#4b52d6_0%,transparent_70%)] opacity-60 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-[radial-gradient(circle,#8a3a52_0%,transparent_70%)] opacity-60 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2
              id="cta-heading"
              className="max-w-2xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
            >
              Audit Smarter. Keep Your Data Local.
            </h2>
            <p className="max-w-md text-white/70">
              Drop your export folder and explore trends in under a minute.
            </p>
            <Button
              size="lg"
              className="h-12 rounded-full bg-white px-8 text-base text-black"
              onClick={() => {
                trackCta("get_started");
                onNavigate("app");
              }}
            >
              Get started — it&apos;s free
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
