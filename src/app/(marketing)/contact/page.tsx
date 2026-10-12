
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";
import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: `Contact Us | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  description:
    "Have a question about a property or your next move? Contact Propora for guidance on your property journey.",
};

const contactPaths = [
  {
    number: "01",
    title: "Finding a property",
    description:
      "Looking for a place to call home or an opportunity that fits your plans?",
    href: "/discover",
    linkLabel: "Explore properties",
  },
  {
    number: "02",
    title: "Speaking with an agent",
    description:
      "Want to connect with a property professional about your next move?",
    href: "/agents",
    linkLabel: "Meet our agents",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Choose a subject and share enough detail for us to understand your question.",
  },
  {
    number: "02",
    title: "Your inquiry is submitted",
    description:
      "We'll record your message so the team can review your inquiry.",
  },
  {
    number: "03",
    title: "Take the next step",
    description:
      "Your contact details give the team a way to follow up about your request.",
  },
];

export default function ContactPage() {
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
          <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 lg:py-24">
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-brand-400/60"
                />
                Let's talk property
              </p>

              <h1 className="mt-6 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
                Every property journey starts with a{" "}
                <span className="text-brand-300">question.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:text-[1.0625rem] sm:leading-8">
                Whether you're searching for a place to call home,
                exploring an investment, or figuring out your next
                move, we're here to help you find a clearer way forward.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-[0.9375rem] font-semibold hover:bg-brand-50"
                  render={
                    <Link href="#contact-form">
                      Send us a message
                    </Link>
                  }
                >
                  Send us a message
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
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
              aria-labelledby="contact-paths-heading"
              className="border-t border-white/15 pt-6 lg:ml-auto lg:w-full lg:max-w-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-300">
                A good place to start
              </p>

              <h2
                id="contact-paths-heading"
                className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl"
              >
                What brings you here?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/65">
                If you're ready to explore, you can start with the
                resources that best match your needs.
              </p>

              <div className="mt-6 divide-y divide-white/15 border-y border-white/15">
                {contactPaths.map((path) => (
                  <div
                    key={path.number}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-5"
                  >
                    <span
                      aria-hidden="true"
                      className="pt-1 font-mono text-xs tabular-nums text-brand-300"
                    >
                      {path.number}
                    </span>

                    <div>
                      <h3 className="font-semibold tracking-tight">
                        {path.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {path.description}
                      </p>

                      <Link
                        href={path.href}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-300 transition-colors hover:text-white"
                      >
                        {path.linkLabel}
                        <ArrowRight
                          className="size-4"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact form and process */}
      <section
        id="contact-form"
        aria-labelledby="contact-form-heading"
        className="scroll-mt-24 border-b border-border bg-background"
      >
        <div className="page-container">
          <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Get in touch
              </p>

              <h2
                id="contact-form-heading"
                className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                Let's work out your next step.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Tell us a little about what you're looking for.
                Share your question, explain what you need, and
                give us the context to understand your inquiry.
              </p>

              <div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-8">
                <ContactForm />
              </div>
            </div>

            <aside className="lg:pt-2">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  What happens next
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  A clearer process, from the start.
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  Getting in touch should be straightforward.
                  Here's how the contact process works.
                </p>

                <ol className="mt-8 divide-y divide-border border-y border-border">
                  {nextSteps.map((step) => (
                    <li
                      key={step.number}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-6"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-1 font-mono text-sm tabular-nums text-muted-foreground"
                      >
                        {step.number}
                      </span>

                      <div>
                        <h4 className="font-semibold tracking-tight">
                          {step.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                    <ShieldCheck
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold tracking-tight">
                      Your information matters
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Please share only the information needed to
                      explain your inquiry. Avoid including
                      sensitive personal information in your message.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-muted/50">
        <div className="page-container">
          <div className="flex flex-col gap-6 py-14 sm:py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Your next move
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Still exploring your options?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Browse the available listings and discover properties
                that could be right for you.
              </p>
            </div>

            <Button
              size="lg"
              className="h-11 shrink-0 self-start md:self-auto"
              render={<Link href="/discover" />}
            >
              Browse properties
              <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
