
"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { clientEnv } from "@/config/env.client";

const navigation = [
  { label: "Properties", href: "#properties" },
  { label: "Agents", href: "#agents" },
  { label: "Leads", href: "#leads" },
  { label: "Customers", href: "#customers" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Propora home"
          onClick={closeMobileMenu}
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            {clientEnv.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                "text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          <Button variant="ghost" >
            <Link href="/login">
              Sign in
            </Link>
          </Button>

          <Button >
            <Link href="/login">
              Get started
            </Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={cn(
          "border-t border-border md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav
          className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 sm:px-6"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-medium",
                "text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              className="w-full"
              
            >
              <Link
                href="/login"
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>
            </Button>

            <Button
              className="w-full"
              
            >
              <Link
                href="/login"
                onClick={closeMobileMenu}
              >
                Get started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}