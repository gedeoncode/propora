import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";
import { PublicFeaturedProperties } from "@/features/properties/components/public-featured-property";

export const metadata: Metadata = {
  title: `Discover Properties | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description:
    `Explore properties for sale and rent with ${clientEnv.NEXT_PUBLIC_APP_NAME}. Find your next home or investment with a clearer property search experience.`,
};

const trustSignals = [
  { value: "12,400+", label: "Published listings" },
  { value: "180", label: "Cities covered" },
  { value: "48h", label: "Avg. response time" },
  { value: "9 yrs", label: "On the market" },
];

const benefits = [
  {
    title: "A simpler search",
    description:
      "Narrow your options by location, budget, and the kind of property you need — without digging through noise.",
  },
  {
    title: "Clear property details",
    description:
      "Review the information available for each listing before arranging a viewing, so every visit counts.",
  },
  {
    title: "Homes and investments",
    description:
      "Explore different property types, whether you are buying a first home or building a portfolio.",
  },
];

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ============================================================
          HERO
          Single asymmetric composition: editorial copy on the left,
          the search surface anchored into the hero on the right.
          Brand-navy surface, no stock photography.
          ============================================================ */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        {/* Layered brand field — soft radial light + hairline grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_15%_0%,var(--color-brand-900)_0%,var(--color-brand-950)_45%,#0a1226_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(90%_70%_at_50%_10%,black,transparent)]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 pt-16 pb-0 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:pt-24">
            {/* ---- Copy ---- */}
            <div className="max-w-xl pb-2 lg:pb-24">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                <span className="h-px w-8 bg-brand-400/60" aria-hidden="true" />
                Property discovery
              </p>

              <h1 className="mt-6 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
                Find a place to
                <br className="hidden sm:block" />{" "}
                <span className="text-brand-300">call your own.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-[1.0625rem] sm:leading-8">
                Discover homes, spaces, and property opportunities that fit
                the way you want to live — with search that respects your
                time.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button
                  
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-[0.9375rem] font-semibold  hover:bg-brand-50"
                  render={<Link href="/discover" aria-label="Explore properties" />}
                >
              
                    Explore properties
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
               
                </Button>

                <Link
                  href={`#why-${clientEnv.NEXT_PUBLIC_APP_NAME.toLowerCase()}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  Why {clientEnv.NEXT_PUBLIC_APP_NAME}
                  <ArrowRight
                    className="size-4 -translate-x-1 transition-transform group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            {/* ---- Search surface ---- */}
            <div className="w-full max-w-lg lg:ml-auto">
              <form
                action="/discover"
                method="get"
                className="overflow-hidden rounded-t-xl border border-border/10 border-b-0 bg-background text-slate-900 shadow-[0_-1px_0_0_rgba(255,255,255,.06)_inset,0_30px_60px_-20px_rgba(0,0,0,.5)] sm:rounded-t-2xl"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                  <h2 className="text-[0.9375rem] font-semibold tracking-tight text-slate-900">
                    Find a property
                  </h2>
                  <span className="text-xs text-slate-400">
                    Refine anytime
                  </span>
                </div>

                <div className="space-y-5 px-5 py-6 sm:px-6">
                  {/* Intent */}
                  <fieldset>
                    <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                      I want to
                    </legend>
                    <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="listingType"
                          value="sale"
                          defaultChecked
                          className="peer sr-only"
                        />
                        <span className="flex min-h-10 items-center justify-center rounded-md border border-transparent px-3 text-sm font-medium text-slate-600 transition peer-checked:border-slate-200 peer-checked:bg-background peer-checked:text-slate-950 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1">
                          Buy
                        </span>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="listingType"
                          value="rent"
                          className="peer sr-only"
                        />
                        <span className="flex min-h-10 items-center justify-center rounded-md border border-transparent px-3 text-sm font-medium text-slate-600 transition peer-checked:border-slate-200 peer-checked:bg-white peer-checked:text-slate-950 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1">
                          Rent
                        </span>
                      </label>
                    </div>
                  </fieldset>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="property-location"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="property-location"
                        name="city"
                        type="search"
                        placeholder="City or neighbourhood"
                        autoComplete="address-level2"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                      />
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label
                        htmlFor="minimum-price"
                        className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500"
                      >
                        Min price
                      </label>
                      <div className="relative">
                        <select
                          id="minimum-price"
                          name="minPrice"
                          defaultValue=""
                          className="h-11 w-full appearance-none rounded-lg border border-muted-foreground/40 bg-background px-3 pr-8 text-sm text-muted-foreground/70 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                        >
                          <option value="">No minimum</option>
                          <option value="500000">500,000</option>
                          <option value="1000000">1 million</option>
                          <option value="3000000">3 million</option>
                          <option value="5000000">5 million</option>
                          <option value="10000000">10 million</option>
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor="maximum-price"
                        className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Max price
                      </label>
                      <div className="relative">
                        <select
                          id="maximum-price"
                          name="maxPrice"
                          defaultValue=""
                          className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm text-muted-foreground/70 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                        >
                          <option value="">No maximum</option>
                          <option value="1000000">1 million</option>
                          <option value="3000000">3 million</option>
                          <option value="5000000">5 million</option>
                          <option value="10000000">10 million</option>
                          <option value="25000000">25 million</option>
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full text-sm font-semibold"
                  >
                    <Search className="mr-2 size-4" aria-hidden="true" />
                    Search properties
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* ---- Trust strip ---- */}
          <div className="mt-12 border-t border-white/10 py-6 sm:mt-16 lg:mt-0 lg:py-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {trustSignals.map((signal) => (
                <div key={signal.label} className="flex flex-col gap-1">
                  <dt className="order-2 text-xs font-medium uppercase tracking-wider text-white/45">
                    {signal.label}
                  </dt>
                  <dd className="order-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {signal.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
              <PublicFeaturedProperties />
      {/* ============================================================
          WHY PROPORA
          Editorial two-column: heading rail on the left, a numbered
          list with hairline rules on the right — no cards.
          ============================================================ */}
      <section
        id={`why-${clientEnv.NEXT_PUBLIC_APP_NAME.toLowerCase()}`}
        className="scroll-mt-24 border-b border-border bg-background"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            {/* Heading rail */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                A better way to discover
              </p>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
                Make your next move with confidence.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                Finding the right property should feel straightforward.
                {clientEnv.NEXT_PUBLIC_APP_NAME} brings discovery and useful listing information
                together in one place.
              </p>

              <Link
                href="/discover"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Start your search
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Numbered list */}
            <ol className="divide-y divide-border border-y border-border">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 py-6 sm:gap-x-8 sm:py-8"
                >
                  <span
                    aria-hidden="true"
                    className="pt-1 font-mono text-sm tabular-nums text-muted-foreground"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================
          CLOSING CTA
          Left-aligned, quiet — not a centered button bar.
          ============================================================ */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Your next move
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to find your next property?
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Browse the listings currently available and shortlist the
                options that fit your needs.
              </p>
            </div>

            <Button
              
              size="lg"
              className="h-11 shrink-0 self-start md:self-auto"
            >
              <Link href="/discover">
                Browse properties
                <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}