import * as React from "react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  titleId: string;
  descriptionId: string;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog compound components must be used within <Dialog>");
  }
  return ctx;
}

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
  children: React.ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  dismissible = true,
  children,
}: DialogProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open || !dismissible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange?.(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange, dismissible]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ titleId, descriptionId }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
          onClick={dismissible ? () => onOpenChange?.(false) : undefined}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="relative z-10 flex max-h-[min(90svh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-card shadow-[0_16px_40px_rgb(0_0_0/0.12)]"
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialogContext();
  return (
    <h2
      id={titleId}
      className={cn(
        "font-display text-xl font-extrabold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { descriptionId } = useDialogContext();
  return (
    <div
      id={descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("overflow-y-auto px-6 py-2 text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-6 pt-4 pb-6 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}