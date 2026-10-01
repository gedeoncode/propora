import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    href: string;
    label: string;
  };
  children?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  action,
  icon,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
        )}

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>

          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {(action || children) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}

          {action ? (
            <Link
              href={action.href}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
      )}
    </header>
  );
}