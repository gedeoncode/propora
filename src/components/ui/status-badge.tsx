import type { ReactNode } from "react";

import { cn } from "cn";

type StatusBadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "brand"
  | "danger"
  | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  variant?: StatusBadgeVariant;
  className?: string;
};

const variantClasses: Record<StatusBadgeVariant, string> = {
  success:
    "bg-success/10 text-success",
  warning:
    "bg-warning/10 text-warning",
  info:
    "bg-info/10 text-info",
  brand:
    "bg-primary/10 text-primary",
  danger:
    "bg-destructive/10 text-destructive",
  neutral:
    "bg-muted text-muted-foreground",
};

export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}