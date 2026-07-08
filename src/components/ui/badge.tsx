import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-foreground",
        secondary: "border-transparent bg-accent text-accent-foreground",
        outline: "border-border bg-transparent text-foreground",
        success: "border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-300",
        warning: "border-transparent bg-amber-500/15 text-amber-800 dark:text-amber-200",
        destructive: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
