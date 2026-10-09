
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleUserRound,
  LogOut,
} from "lucide-react";

import { cn } from "cn";
import { clientEnv } from "@/config/env.client";

type DashboardAccountMenuProps = {
  displayName: string;
  roleLabel: string;
  signOutAction: () => Promise<void>;
};

export function DashboardAccountMenu({
  displayName,
  roleLabel,
  signOutAction,
}: DashboardAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const signOutRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  function toggleMenu() {
    setOpen((current) => !current);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="dashboard-account-menu"
        onClick={toggleMenu}
        className={cn(
          "flex min-h-10 items-center gap-2 rounded-lg border border-transparent",
          "px-1.5 py-1 text-left transition-colors",
          "hover:border-border hover:bg-muted/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "border-border bg-muted/70",
        )}
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground"
          aria-hidden="true"
        >
          {initials || <CircleUserRound className="size-4" />}
        </span>

        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-36 truncate text-sm font-medium">
            {displayName}
          </span>
          <span className="block max-w-36 truncate text-xs text-muted-foreground">
            {roleLabel}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "hidden size-4 text-muted-foreground transition-transform sm:block",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="dashboard-account-menu"
          aria-label="Account options"
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-72",
            "overflow-hidden rounded-xl border border-border",
            "bg-popover text-popover-foreground shadow-lg",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold"
              aria-hidden="true"
            >
              {initials || <CircleUserRound className="size-5" />}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {roleLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Signed in to {clientEnv.NEXT_PUBLIC_APP_NAME}
              </p>
            </div>
          </div>

          <div className="p-2">
            <div className="px-2 py-2 text-xs text-muted-foreground">
              Account
            </div>

            <div
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground"
              aria-label="Current account role"
            >
              <Check className="size-4" aria-hidden="true" />
              <span>Active session</span>
            </div>

            <div className="my-2 border-t border-border" />

            <form action={signOutAction}>
              <button
                ref={signOutRef}
                type="submit"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2.5",
                  "text-sm font-medium text-destructive transition-colors",
                  "hover:bg-destructive/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}