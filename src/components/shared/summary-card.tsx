import type { ReactNode } from "react";

import { cn } from "cn";

type SummaryCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function SummaryCard({
  label,
  value,
  description,
  icon,
  className,
}: SummaryCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card px-4 py-4 ",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
              {icon ? (<span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </span>) : null}
      </div>

      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>

      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </section>
  );
}
