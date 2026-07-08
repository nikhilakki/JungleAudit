import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
  xl: "size-28",
} as const;

const sizePx = {
  sm: 40,
  md: 56,
  lg: 80,
  xl: 112,
} as const;

type MascotSize = keyof typeof sizeClasses;

interface MascotProps {
  size?: MascotSize;
  className?: string;
  alt?: string;
  decorative?: boolean;
  /** Set on above-the-fold mascots (e.g. hero) to avoid lazy-load delay. */
  priority?: boolean;
}

export function Mascot({
  size = "md",
  className,
  alt = "JungleAudit mascot",
  decorative = false,
  priority = false,
}: MascotProps) {
  const px = sizePx[size];
  const src = px <= 56 ? "/jungleaudit-mascot-112.webp" : "/jungleaudit-mascot.webp";

  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      width={px}
      height={px}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(
        "shrink-0 rounded-2xl border border-border/60 bg-card object-cover shadow-sm",
        sizeClasses[size],
        className,
      )}
    />
  );
}