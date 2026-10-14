import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";

const navigation = [
  { label: "Buy", href: "/discover?listingType=sale" },
  { label: "Rent", href: "/discover?listingType=rent" },
  { label: "Agents", href: "/agents" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const footerGroups = [
  {
    heading: "Discover",
    links: [
      { label: "Buy a property", href: "/discover?listingType=sale" },
      { label: "Rent a property", href: "/discover?listingType=rent" },
      { label: "Explore all properties", href: "/discover" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Propora", href: "/about" },
      { label: "Our agents", href: "/agents" },
      { label: "Contact us", href: "/contact" },
      { label: "Sign in", href: "/login" },
    ],
  },
];



function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${clientEnv.NEXT_PUBLIC_APP_NAME} home`}
      className="inline-flex shrink-0 items-center gap-2.5 rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span
        className={`relative flex shrink-0 items-center justify-center ${
          compact ? "size-8" : "size-9"
        }`}
      >
        <Image
          src="/images/logo.png"
          alt="Propora logo"
          fill
          sizes={compact ? "32px" : "36px"}
          className="object-contain"
          priority
        />
      </span>

      <span
        className={`font-semibold tracking-tight ${
          compact ? "text-base" : "text-[1.0625rem]"
        }`}
      >
        {clientEnv.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  );
}
function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={
        mobile
          ? "flex min-w-max items-center gap-0.5"
          : "hidden items-center gap-0.5 lg:flex"
      }
    >
      {navigation.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            mobile
              ? "inline-flex min-h-10 items-center rounded-md px-3.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              : "inline-flex min-h-10 items-center rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:px-3"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 page-container">
        <Wordmark />

        <NavigationLinks />

        {/* Desktop / tablet auth + primary CTA */}
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            render={<Link href="/login" />}
          >
            Sign in
          </Button>

          <Button
            size="sm"
            className="h-9 px-3.5 text-sm font-semibold"
            render={<Link href="/discover" />}
          >
            Find a property
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>

        {/* Small / tablet: primary CTA only, no sign-in */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex lg:hidden">
          <Button
            size="sm"
            className="h-9 px-3.5 text-sm font-semibold"
            render={<Link href="/discover" />}
          >
            Find a property
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile: single compact CTA */}
        <div className="flex shrink-0 items-center gap-1.5 sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            render={<Link href="/login" />}
          >
            Sign in
          </Button>

          <Button
            size="sm"
            className="h-9 px-3 text-sm font-semibold"
            render={<Link href="/discover" />}
          >
            Explore
          </Button>
        </div>
      </div>

      {/* Secondary nav row: only where the primary nav can't fit inline */}
      <div className="border-t border-border/60 lg:hidden">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 scrollbar-none sm:px-6 [&::-webkit-scrollbar]:hidden">
          <NavigationLinks mobile />
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="py-12 sm:py-14 page-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="max-w-sm">
            <Wordmark compact />

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A clearer way to discover properties, explore your options,
              and find a place that feels right.
            </p>

            <Link
              href="/discover"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start exploring
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                {group.heading}
              </h2>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          <p className="text-xs leading-5 text-muted-foreground">
            © {new Date().getFullYear()} {clientEnv.NEXT_PUBLIC_APP_NAME}.
            All rights reserved.
          </p>

          <p className="text-xs leading-5 text-muted-foreground">
            A clearer path to your next property.
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
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background p-3 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <MarketingHeader />

      <div id="main-content" className="min-w-0 flex-1">
        {children}
      </div>

      <MarketingFooter />
    </div>
  );
}