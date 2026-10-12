
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Compass,
  UsersRound,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";
import { agentService } from "@/features/agents/services/agent.service";
import type { Agent } from "@/features/agents/types/agent";

export const metadata: Metadata = {
  title: `Meet Our Agents | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description:
    "Meet active real-estate professionals on Propora, explore their areas of specialization, and take the next step in your property journey.",
};

const specializationLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Land",
  property_management: "Property management",
  luxury: "Luxury properties",
  new_development: "New developments",
  investment: "Property investment",
  other: "Other",
};

const directoryPrinciples = [
  {
    number: "01",
    title: "Know who you're connecting with",
    description:
      "Review available professional profiles and learn about each agent's areas of specialization.",
    icon: UsersRound,
  },
  {
    number: "02",
    title: "Start with what matters to you",
    description:
      "Your location, priorities, and property goals can help shape the questions you ask.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Take the next step when ready",
    description:
      "Explore current listings or contact the Propora team when you need help with your inquiry.",
    icon: ArrowUpRight,
  },
];

export default async function AgentsPage() {
  let agents: Agent[] = [];
  let directoryUnavailable = false;

  try {

    agents = (await agentService.list("active")) as unknown as Agent[];
  } catch (error) {
    // Keep the public page useful even if the directory cannot be loaded.
    console.error("Failed to load the public agent directory.", error);
    directoryUnavailable = true;
  }

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
                People behind the properties
              </p>

              <h1 className="mt-6 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
                Every property journey is personal.
                <span className="block text-brand-300">
                  Start with the right people.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-[1.0625rem] sm:leading-8">
                Finding a property involves more than comparing listings.
                It's about understanding your options and knowing what
                to ask. Get to know the active professionals in our
                directory and explore how their specializations align
                with your plans.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-[0.9375rem] font-semibold hover:bg-brand-50"
                  render={<Link href="#agent-directory" />}
                >
                  Meet our agents
                  <ArrowRight
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </Button>

                <Link
                  href="/discover"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  Explore properties
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <aside
              aria-labelledby="directory-intro-heading"
              className="border-t border-white/15 pt-6 lg:ml-auto lg:w-full lg:max-w-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300">
                <UsersRound className="size-6" aria-hidden="true" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-brand-300">
                A more informed starting point
              </p>

              <h2
                id="directory-intro-heading"
                className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Get to know the people behind your next move.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                Explore professional profiles, review the information
                available, and use what you learn to guide your next
                property conversation.
              </p>

              <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <BriefcaseBusiness
                    className="size-5 text-brand-300"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Different areas of expertise
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Residential, commercial, land, and more.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Agent directory */}
      <section
        id="agent-directory"
        aria-labelledby="agents-heading"
        className="scroll-mt-24 border-b border-border"
      >
        <div className="page-container">
          <div className="flex flex-col gap-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                The directory
              </p>

              <h2
                id="agents-heading"
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Meet our agents.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Get familiar with their professional backgrounds and
                the areas of real estate they work in.
              </p>
            </div>

            {!directoryUnavailable && (
              <p
                className="text-sm text-muted-foreground sm:shrink-0"
                aria-live="polite"
              >
                {agents.length} active{" "}
                {agents.length === 1 ? "profile" : "profiles"}
              </p>
            )}
          </div>

          {directoryUnavailable ? (
            <div
              role="status"
              className="mb-16 rounded-2xl border border-border bg-card px-6 py-12 text-center sm:mb-20 sm:py-16"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <UsersRound className="size-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Our directory is temporarily unavailable.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                We couldn't load the agent profiles right now.
                You can still explore properties or contact our team.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button render={<Link href="/discover" />}>
                  Explore properties
                  <ArrowRight
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </Button>

                <Button
                  variant="outline"
                  render={<Link href="/contact" />}
                >
                  Contact us
                </Button>
              </div>
            </div>
          ) : agents.length === 0 ? (
            <div className="mb-16 rounded-2xl border border-dashed border-border px-6 py-14 text-center sm:mb-20 sm:py-16">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <UserRound className="size-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Our directory is growing.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                There are no active agent profiles to display right now.
                You can continue exploring properties while the directory
                develops.
              </p>

              <Button className="mt-6" render={<Link href="/discover" />}>
                Browse properties
                <ArrowRight
                  className="ml-2 size-4"
                  aria-hidden="true"
                />
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 pb-16 sm:grid-cols-2 sm:pb-20 lg:grid-cols-3">
              {agents.map((agent) => {
                const fullName = [
                  agent.userId?.firstName,
                  agent.userId?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                const specializations = agent.specializations ?? [];

                return (
                  <article
                    key={agent._id}
                    className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30"
                  >
                    <div className="flex items-start gap-4 p-5 sm:p-6">
                      <div className="size-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-20">
                        {agent.profileImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={agent.profileImageUrl}
                            alt={
                              fullName
                                ? `Portrait of ${fullName}`
                                : "Agent profile"
                            }
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <UserRound
                              className="size-8 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        <h3 className="break-words text-lg font-semibold tracking-tight">
                          {fullName || "Real-estate agent"}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <BriefcaseBusiness
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          Real-estate professional
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                      {agent.bio ? (
                        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                          {agent.bio}
                        </p>
                      ) : (
                        <p className="text-sm leading-6 text-muted-foreground">
                          Explore this agent's areas of specialization
                          to learn more about their professional focus.
                        </p>
                      )}

                      {specializations.length > 0 && (
                        <div className="mt-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Specializations
                          </p>

                          <ul className="mt-3 flex flex-wrap gap-2">
                            {specializations.map((specialization) => (
                              <li
                                key={specialization}
                                className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground"
                              >
                                {specializationLabels[specialization] ??
                                  specialization.replaceAll("_", " ")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-auto border-t border-border pt-5">
                        <Link
                          href="/contact"
                          className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Ask us about your next move
                          <ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How to approach your search */}
      <section
        aria-labelledby="approach-heading"
        className="bg-muted/20"
      >
        <div className="page-container">
          <div className="max-w-2xl pt-16 sm:pt-20 lg:pt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              A thoughtful next step
            </p>

            <h2
              id="approach-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Start with what matters to you.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              A more focused property search begins with clear priorities
              and the information you need to make a decision.
            </p>
          </div>

          <div className="grid gap-5 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-3 lg:py-14">
            {directoryPrinciples.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.number}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {principle.number}
                    </span>

                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
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

      {/* Closing CTA */}
      <section className="border-t border-border bg-background">
        <div className="page-container">
          <div className="flex flex-col gap-6 py-14 sm:py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Your next move
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to explore your options?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Browse available properties or get in touch if you
                need help figuring out where to start.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-11"
                render={<Link href="/discover" />}
              >
                Discover properties
                <ArrowUpRight
                  className="ml-2 size-4"
                  aria-hidden="true"
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-11"
                render={<Link href="/contact" />}
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
