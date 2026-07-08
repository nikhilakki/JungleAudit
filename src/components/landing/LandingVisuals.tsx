import { cn } from "@/lib/utils";

export function SpendTrendMock({ className }: { className?: string }) {
  const bars = [42, 68, 55, 82, 61, 94, 73, 88];
  return (
    <svg
      viewBox="0 0 240 120"
      className={cn("w-full text-primary", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={12 + i * 28}
          y={110 - h}
          width={18}
          height={h}
          rx={4}
          fill="url(#barGrad)"
        />
      ))}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
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
      <circle cx="60" cy="60" r="44" fill="none" stroke="oklch(0.9 0.01 106)" strokeWidth="14" />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="oklch(0.45 0.14 145)"
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
        stroke="oklch(0.55 0.2 25)"
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
        stroke="oklch(0.6 0.12 250)"
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
      <rect x="8" y="24" width="120" height="88" rx="12" fill="var(--card)" stroke="var(--border)" />
      <text x="68" y="52" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        Your device
      </text>
      <rect x="28" y="62" width="80" height="10" rx="3" fill="oklch(0.45 0.14 145 / 0.35)" />
      <rect x="28" y="78" width="56" height="10" rx="3" fill="oklch(0.45 0.14 145 / 0.2)" />
      <rect x="28" y="94" width="64" height="10" rx="3" fill="oklch(0.45 0.14 145 / 0.25)" />

      <path
        d="M140 68 H175"
        stroke="oklch(0.55 0.2 25)"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <text x="157" y="58" textAnchor="middle" fontSize="9" fill="oklch(0.55 0.2 25)">
        blocked
      </text>

      <rect x="192" y="24" width="120" height="88" rx="12" fill="var(--muted)" stroke="var(--border)" strokeDasharray="4 3" opacity="0.65" />
      <text x="252" y="52" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        Cloud upload
      </text>
      <text x="252" y="78" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
        never happens
      </text>
    </svg>
  );
}

export function FlowStepsVisual() {
  const steps = [
    { label: "Request data", sub: "Amazon export" },
    { label: "Drop CSVs", sub: "In browser" },
    { label: "See insights", sub: "Charts & totals" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, i) => (
        <div key={step.label} className="relative flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-lg font-semibold text-primary">
            {i + 1}
          </div>
          <p className="font-medium">{step.label}</p>
          <p className="text-sm text-muted-foreground">{step.sub}</p>
          {i < steps.length - 1 ? (
            <div
              className="absolute top-6 hidden h-0.5 w-full bg-gradient-to-r from-primary/40 to-primary/10 sm:block"
              style={{ left: "58%", width: "84%" }}
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}