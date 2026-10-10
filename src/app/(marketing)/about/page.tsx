
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Handshake,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover how Propora brings property discovery, real-estate professionals, and property management together in one platform.",
};

const values = [
  {
    title: "Trust and transparency",
    description:
      "We believe property decisions should be supported by clear information and dependable processes.",
    icon: ShieldCheck,
  },
  {
    title: "People first",
    description:
      "We put buyers, property owners, agents, and property managers at the center of the experience.",
    icon: Users,
  },
  {
    title: "Better collaboration",
    description:
      "We bring property information, customer relationships, and team workflows into one connected platform.",
    icon: Handshake,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              About Propora
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A better way to discover and manage property.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Propora brings property discovery, customer relationships, and
              real-estate operations together, helping agencies and property
              professionals work with greater clarity and consistency.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/discover" />}>
                Explore properties
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <Button variant="outline" render={<Link href="/agents" />}>
                Meet our agents
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 size-56 rounded-full bg-primary/10 blur-2xl"
            />

            <div className="relative">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Building2 aria-hidden="true" className="size-7" />
              </div>

              <p className="mt-8 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                One connected property experience.
              </p>

              <p className="mt-4 leading-7 text-muted-foreground">
                From the first property search to managing listings, agents,
                leads, and viewing requests, Propora is designed to help bring
                the moving parts of real estate into one organized workflow.
              </p>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm font-medium text-foreground">
                  Built for real-estate teams
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Designed to support property professionals and the people
                  they serve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            What guides us
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The principles behind the platform.
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Real estate involves important decisions and many relationships.
            Our approach focuses on making the process more organized,
            accessible, and easier to navigate.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-6" />
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Let&apos;s make your next property step easier.
            </h2>

            <p className="mt-3 leading-7 text-muted-foreground">
              Explore available listings or connect with a member of our
              real-estate team.
            </p>
          </div>

          <Button render={<Link href="/discover" />}>
            Get started
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
