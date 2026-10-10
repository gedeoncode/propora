import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Propora for help finding a property, listing your property, or learning more about our real-estate services.",
};

const contactOptions = [
  {
    title: "Property assistance",
    description:
      "Need help finding a property or want to learn more about a listing?",
    icon: MapPin,
    detail: "Explore properties",
    href: "/discover",
  },
  {
    title: "Speak with our team",
    description:
      "Explore our agent directory to find the right person to help with your property needs.",
    icon: MessageCircle,
    detail: "Meet our agents",
    href: "/agents",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* Hero */}{" "}
      <section className="border-b border-border bg-muted/30">
        {" "}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {" "}
          <div className="max-w-3xl">
            {" "}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Contact Propora{" "}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Let&apos;s find the right way forward.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Whether you are exploring properties, considering listing one, or
              simply have a question, we are here to help.
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
        </div>
      </section>
      {/* Contact form and supporting information */}
      <section
        id="contact-form"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Send us a message
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              How can we help?
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Share a few details about your inquiry. Fill in the form below,
              and we&apos;ll have the information needed to follow up with you.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-8 lg:pt-2">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                A little more information
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Not sure where to start? These resources can help you take the
                next step.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock3 className="size-5" aria-hidden="true" />
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">
                    What happens next?
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Your message is recorded as an inquiry so your team can
                    review the details and follow up using your contact
                    information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">
                    Your information
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    We use the details you provide to understand and respond to
                    your inquiry. Please avoid including sensitive personal
                    information in your message.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-background text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </div>

              <h4 className="mt-4 font-semibold text-foreground">
                Looking for a property?
              </h4>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Browse the available listings and explore properties that match
                your needs.
              </p>

              <Link
                href="/discover"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Browse listings
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      {/* Quick links */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Explore Propora
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Your next property decision starts here.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Whether you&apos;re buying, renting, or listing a property, start
              by exploring our available resources.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md sm:p-8"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>

                  <Link
                    href={option.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {option.detail}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to explore your options?
              </h3>

              <p className="mt-3 text-sm leading-6 text-primary-foreground/80 sm:text-base">
                Discover listings and take the next step toward your property
                goals.
              </p>
            </div>

            <Button
              variant="secondary"
              render={<Link href="/discover" />}
              className="mt-6 shrink-0 lg:mt-0"
            >
              Browse properties
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
