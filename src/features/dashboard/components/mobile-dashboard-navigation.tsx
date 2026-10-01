"use client";
import { Building2, CircleUserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moduleNavigation, primaryNavigation } from "../constants/navigation";
import { NavigationLink } from "./navigation-link";

type MobileDashboardNavigationProps = {
  displayName: string;
  roleLabel: string;
};

export function MobileDashboardNavigation({
  displayName,
  roleLabel,
}: MobileDashboardNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = document.getElementById("mobile-dashboard-navigation");

      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          '[tabindex]:not([tabindex="-1"])',
        ].join(","),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <div className="md:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-dashboard-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((current) => !current)}
        className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity"
            onClick={closeMenu}
          />

          <aside
            id="mobile-dashboard-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile workspace navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2.5rem))] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" aria-hidden="true" />
                </span>

                <span>Propora</span>
              </Link>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation"
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-sidebar-border px-5 py-4">
              <p className="text-xs text-muted-foreground">Signed in as</p>

              <div className="mt-2 flex min-w-0 items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground"
                  aria-hidden="true"
                >
                  <CircleUserRound className="size-5" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{displayName}</p>

                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </div>
            </div>

            <nav
              aria-label="Mobile dashboard navigation"
              className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
            >
              <div>
                <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Workspace
                </p>

                <div className="space-y-1">
                  {primaryNavigation.map((item) => (
                    <NavigationLink
                      key={item.href}
                      item={item}
                      mobile
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  CRM
                </p>

                <div className="space-y-1">
                  {moduleNavigation.map((item) => (
                    <NavigationLink
                      key={item.href}
                      item={item}
                      mobile
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}