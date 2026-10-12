
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Handshake,
  House,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";

export const metadata: Metadata = {
  title: `About Us | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description:
    "Discover the thinking behind Propora and our approach to clearer property discovery, useful information, and more confident real-estate decisions.",
};

const principles = [
  {
    number: "01",
    title: "Clarity comes first",
    description:
      "Property decisions involve enough uncertainty already. We aim to make available information easier to navigate, understand, and evaluate.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Details make a difference",
    description:
      "The right details help people understand their options, compare properties thoughtfully, and know which questions to ask next.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "People are the point",
    description:
      "A property is never just an entry on a screen. It can represent a home, a livelihood, a fresh start, or a long-term ambition.",
    icon: Handshake,
  },
];

const audiences = [
  {
    number: "01",
    title: "For your next move",
    description:
      "Whether you're buying, renting, or exploring an investment, discover properties and evaluate the options that fit your plans.",
    icon: House,
    href: "/discover",
    action: "Explore properties",
  },
  {
    number: "02",
    title: "For a more informed search",
    description:
      "Use property details to narrow your options and connect with real-estate professionals when you're ready to take the next step.",
    icon: Search,
    href: "/agents",
    action: "Meet our agents",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_15%_0%,var(--color-brand-900)_0%,var(--color-brand-950)_45%,#0a1226_100%)]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(90%_70%_at_50%_10%,black,transparent)]"
        />

        <div className="page-container">
          <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:py-24">
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-brand-400/60"
                />
                About {clientEnv.NEXT_PUBLIC_APP_NAME}
              </p>

              <h1 className="mt-6 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
                Property is personal.
                <span className="block text-brand-300">
                  The experience should be clearer.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-[1.0625rem] sm:leading-8">
                Finding the right property is about more than a
                search. It's about understanding your options,
                weighing what matters, and feeling ready for
                whatever comes next. {clientEnv.NEXT_PUBLIC_APP_NAME}{" "}
                is built around making that journey more
                straightforward.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-[0.9375rem] font-semibold hover:bg-brand-50"
                  render={<Link href="/discover" />}
                >
                  Explore properties
                  <ArrowRight
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </Button>

                <Link
                  href="#our-approach"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  What guides us
                  <ArrowRight
                    className="size-4 -translate-x-1 transition-transform group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            {/* Brand statement */}
            <aside
              aria-labelledby="belief-heading"
              className="relative lg:ml-auto lg:w-full lg:max-w-lg"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-2xl border border-white/10 sm:-inset-4"
              />

              <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-9">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300">
                  <Target className="size-6" aria-hidden="true" />
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                  What we believe
                </p>

                <h2
                  id="belief-heading"
                  className="mt-4 text-2xl font-medium leading-snug tracking-tight sm:text-3xl"
                >
                  Better decisions begin with a clearer view of
                  what's possible.
                </h2>

                <div className="mt-8 h-px bg-white/10" />

                <p className="mt-5 text-sm leading-6 text-white/65">
                  Less friction in the search. More room to focus
                  on the decision that matters to you.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        aria-labelledby="mission-heading"
        className="border-b border-border"
      >
        <div className="page-container">
          <div className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Why Propora
              </p>

              <h2
                id="mission-heading"
                className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                Make room for better property decisions.
              </h2>
            </div>

            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-foreground sm:text-xl sm:leading-9">
                Every property search starts somewhere: a need,
                an idea, a new opportunity, or a change in
                circumstances.
              </p>

              <p className="mt-5 text-base leading-7 text-muted-foreground">
                But finding a suitable property can mean sorting
                through listings, working out which details matter,
                and deciding what to do next. We believe the
                experience can be more focused and easier to
                navigate.
              </p>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                That's the thinking behind {clientEnv.NEXT_PUBLIC_APP_NAME}:
                bring useful property information into a clearer
                discovery experience, so people can spend more time
                considering their options and less time feeling
                lost in the search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        id="our-approach"
        aria-labelledby="approach-heading"
        className="scroll-mt-24 bg-muted/20"
      >
        <div className="page-container">
          <div className="max-w-2xl py-16 pb-0 sm:py-20 sm:pb-0 lg:py-24 lg:pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Our approach
            </p>

            <h2
              id="approach-heading"
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              A better experience starts with the basics.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              No unnecessary complexity. Just a considered approach
              to the information, tools, and people involved in
              a property decision.
            </p>
          </div>

          <div className="grid gap-5 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-3 lg:py-14">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.number}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {principle.number}
                    </span>

                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon
                        className="size-5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-tight">
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* People and property journeys */}
      <section
        aria-labelledby="people-heading"
        className="border-t border-border"
      >
        <div className="page-container">
          <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Your journey
              </p>

              <h2
                id="people-heading"
                className="mt-4 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Different priorities. A clearer place to start.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                There's no single way to approach real estate.
                Your needs, budget, timing, and plans should help
                shape what you look for.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Have a question? Let's talk
                <ArrowRight
                  className="size-4"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {audiences.map((audience) => {
                const Icon = audience.icon;

                return (
                  <article
                    key={audience.number}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {audience.number}
                      </span>

                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <h3 className="mt-6 text-lg font-semibold tracking-tight">
                      {audience.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                      {audience.description}
                    </p>

                    <Link
                      href={audience.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      {audience.action}
                      <ArrowRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="page-container">
          <div className="flex flex-col gap-6 py-14 sm:py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Your next chapter
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Start with a clearer view of your options.
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Explore available properties and take the next step
                at your own pace.
              </p>
            </div>

            <Button
              size="lg"
              className="h-11 shrink-0 self-start md:self-auto"
              render={<Link href="/discover" />}
            >
              Discover properties
              <ArrowUpRight
                className="ml-2 size-4"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
