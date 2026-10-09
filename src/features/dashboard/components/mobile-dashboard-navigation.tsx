"use client";

import { Building2, CircleUserRound, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { moduleNavigation, primaryNavigation } from "../constants/navigation";
import { NavigationLink } from "./navigation-link";
import { clientEnv } from "@/config/env.client";

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

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const drawer = document.getElementById("mobile-dashboard-navigation");

      if (!drawer) {
        return;
      }

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
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;

      window.scrollTo(0, scrollY);

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
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}{" "}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation"
            onClick={closeMenu}
            className="fixed inset-0 h-dvh z-40 cursor-default bg-foreground/30 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
          />

          {/* Drawer */}
          <aside
            id="mobile-dashboard-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile workspace navigation"
            className="fixed top-0 left-0 h-dvh z-50 flex w-[min(21rem,calc(100vw-2rem))] flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-200"
          >
            {/* Brand header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                aria-label="Propora overview"
                className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <Building2 className="size-4.5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight">
                    {clientEnv.NEXT_PUBLIC_APP_NAME}
                  </p>

                  <p className="truncate text-[11px] text-muted-foreground">
                    Real estate workspace
                  </p>
                </div>
              </Link>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation */}
            <nav
              aria-label="Mobile dashboard navigation"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 scrollbar-thin"
            >
              <div>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
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

              <div className="mt-7">
                <div className="mb-2 flex items-center gap-3 px-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    CRM
                  </p>

                  <span
                    className="h-px flex-1 bg-sidebar-border"
                    aria-hidden="true"
                  />
                </div>

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

            {/* Bottom brand/status area */}
            <div className="shrink-0 border-t border-sidebar-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] text-muted-foreground">
                  {clientEnv.NEXT_PUBLIC_APP_NAME} Workspace
                </p>

                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-label="Workspace available"
                  title="Workspace available"
                />
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
