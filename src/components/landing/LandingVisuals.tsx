import { cn } from "@/lib/utils";

export function SpendTrendMock({ className }: { className?: string }) {
  const bars = [42, 68, 55, 82, 61, 94, 73, 88];
  return (
    <svg
      viewBox="0 0 240 120"
      className={cn("w-full text-foreground", className)}
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={12 + i * 28}
          y={110 - h}
          width={18}
          height={h}
          rx={4}
          fill="currentColor"
          opacity={0.14}
        />
      ))}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={bars
          .map((h, i) => `${21 + i * 28},${110 - h - 6}`)
          .join(" ")}
      />
    </svg>
  );
}

export function PaymentDonutMock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("size-full", className)} aria-hidden="true">
      <circle cx="60" cy="60" r="44" fill="none" stroke="var(--muted)" strokeWidth="14" />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="var(--cobalt)"
        strokeWidth="14"
        strokeDasharray="138 138"
        strokeDashoffset="34"
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="var(--pink)"
        strokeWidth="14"
        strokeDasharray="138 138"
        strokeDashoffset="96"
        transform="rotate(38 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="var(--tan)"
        strokeWidth="14"
        strokeDasharray="138 138"
        strokeDashoffset="118"
        transform="rotate(128 60 60)"
      />
    </svg>
  );
}

export function LocalPrivacyDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 140"
      className={cn("w-full max-w-md", className)}
      aria-hidden="true"
    >
      <rect x="8" y="24" width="120" height="88" rx="16" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
      <text x="68" y="52" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        Your device
      </text>
      <rect x="28" y="62" width="80" height="10" rx="5" fill="var(--cobalt)" opacity="0.55" />
      <rect x="28" y="78" width="56" height="10" rx="5" fill="var(--cobalt)" opacity="0.3" />
      <rect x="28" y="94" width="64" height="10" rx="5" fill="var(--cobalt)" opacity="0.4" />

      <path
        d="M140 68 H175"
        stroke="var(--destructive)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x="157" y="58" textAnchor="middle" fontSize="9" fill="var(--destructive)">
        blocked
      </text>

      <rect x="192" y="24" width="120" height="88" rx="16" fill="var(--muted)" stroke="var(--border)" strokeDasharray="4 3" opacity="0.65" />
      <text x="252" y="52" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        Cloud upload
      </text>
      <text x="252" y="78" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
        never happens
      </text>
    </svg>
  );
}

const FLOW_STEPS = [
  {
    title: "Upload CSVs",
    sub: "Drop the files from your Amazon export",
    status: "Complete",
  },
  {
    title: "Auto-map schema",
    sub: "Columns are matched to canonical fields",
    status: "Processing",
  },
  {
    title: "Explore insights",
    sub: "Charts, totals, refunds, and trends",
    status: "Waiting",
  },
] as const;

export function FlowStepsVisual() {
  return (
    <div className="rounded-3xl bg-muted p-6 md:p-8">
      <ol className="flex flex-col">
        {FLOW_STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex flex-col items-center" aria-hidden="true">
              <span className="mt-6 size-2 shrink-0 rounded-full bg-foreground" />
              {i < FLOW_STEPS.length - 1 ? (
                <span className="mt-2 w-px flex-1 bg-border" />
              ) : null}
            </div>
            <div
              className={cn(
                "flex-1 rounded-2xl bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
                i < FLOW_STEPS.length - 1 && "mb-4",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{step.title}</p>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/70">
                  {step.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{step.sub}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
