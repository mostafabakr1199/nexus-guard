import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "destructive" | "info" | "muted";

const styles: Record<Variant, string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-amber-700 border-warning/40",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-info/10 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({
  variant = "muted",
  children,
  dot = true,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  const dotColor = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    info: "bg-info",
    muted: "bg-muted-foreground",
  }[variant];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", styles[variant], className)}>
      {dot && <span className={cn("status-dot", dotColor)} />}
      {children}
    </span>
  );
}
