import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";

const navigation = [
  { label: "Buy", href: "/discover?listingType=sale" },
  { label: "Rent", href: "/discover?listingType=rent" },
  { label: "Explore", href: "/discover" },
];

const footerLinks = [
  {
    heading: "Discover",
    links: [
      { label: "Buy a property", href: "/discover?listingType=sale" },
      { label: "Rent a property", href: "/discover?listingType=rent" },
      { label: "All listings", href: "/discover" },
    ],
  },
  {
    heading: "Company",
    links: [
      {
        label: `Why ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
        href: `/#why-${clientEnv.NEXT_PUBLIC_APP_NAME.toLowerCase()}`,
      },
      { label: "Sign in", href: "/login" },
    ],
  },
];

function Wordmark({ size = "md" }: { size?: "md" | "sm" }) {
  const isSm = size === "sm";
  return (
    <Link
      href="/"
      aria-label={`${clientEnv.NEXT_PUBLIC_APP_NAME} home`}
      className="inline-flex shrink-0 items-center gap-2.5"
    >
      <span
        className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${
          isSm ? "size-8" : "size-9"
        }`}
      >
        <Building2
          className={isSm ? "size-4" : "size-4.5"}
          aria-hidden="true"
        />
      </span>
      <span
        className={`font-semibold tracking-tight ${
          isSm ? "text-base" : "text-[1.0625rem]"
        }`}
      >
        {clientEnv.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  );
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="page-container flex h-16  items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        {/* Primary nav — desktop */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions — desktop / tablet */}
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            render={<Link href="/login" aria-label="Sign in" />}
          >
            Sign in
          </Button>

          <Button
            size="sm"
            className="h-9 px-4 text-sm font-semibold"
            render={<Link href="/discover" aria-label="Find a property" />}
          >
            Find a property
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile — single primary action, no fake menu */}
        <div className="sm:hidden">
          <Button
            size="sm"
            className="h-9 px-3.5 text-sm font-semibold"
            render={<Link href="/discover" aria-label="Find a property" />}
          >
            Find a property
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="page-container py-12  lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          {/* Brand column */}
          <div className="max-w-sm">
            <Wordmark size="sm" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A clearer way to discover properties and find a place that feels
              right.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {clientEnv.NEXT_PUBLIC_APP_NAME}. All
            rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for property discovery.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col ">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background p-3 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <MarketingHeader />

      <div className="flex-1">{children}</div>

      <MarketingFooter />
    </div>
  );
}
