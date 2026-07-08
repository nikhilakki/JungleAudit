import { cn } from "@/lib/utils";

export const MASCOT_SRC = "/jungleaudit-mascot.png";

const sizeClasses = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
  xl: "size-28",
} as const;

type MascotSize = keyof typeof sizeClasses;

interface MascotProps {
  size?: MascotSize;
  className?: string;
  alt?: string;
  decorative?: boolean;
}

export function Mascot({
  size = "md",
  className,
  alt = "JungleAudit mascot",
  decorative = false,
}: MascotProps) {
  return (
    <img
      src={MASCOT_SRC}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      className={cn(
        "shrink-0 rounded-2xl border border-border/60 bg-card object-cover shadow-sm",
        sizeClasses[size],
        className,
      )}
    />
  );
}