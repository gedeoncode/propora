import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CircleUserRound,
  Handshake,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/config/env.client";

const workflowItems = [
  {
    label: "Properties",
    description: "Manage your property portfolio",
    icon: Building2,
  },
  {
    label: "Leads",
    description: "Track prospects and opportunities",
    icon: Handshake,
  },
  {
    label: "Customers",
    description: "Keep customer relationships organized",
    icon: Users,
  },
  {
    label: "Viewings",
    description: "Coordinate property appointments",
    icon: CalendarCheck,
  },
];

export function MarketingHero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        {/* Hero copy */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground">
            <CircleUserRound className="size-4 text-primary" aria-hidden="true" />
            Built for modern real-estate teams
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Run your real-estate business with clarity.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {clientEnv.NEXT_PUBLIC_APP_NAME} brings properties, leads, customers, agents, and viewings
            together in one workspace so your team can manage daily operations
            with less friction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" >
              <Link href="/login">
                Get started
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="#properties">Explore the platform</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Manage the work behind every property transaction from one place.
          </p>
        </div>

        {/* Product preview */}
        <div
          className="relative"
          aria-label="Propora workflow preview"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* Preview header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Propora workspace
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your real-estate operations
                </p>
              </div>

              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Building2 className="size-4" aria-hidden="true" />
              </div>
            </div>

            {/* Workflow */}
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {workflowItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="bg-card p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Preview footer */}
            <div className="border-t border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    One connected workflow
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Keep your team and property operations aligned.
                  </p>
                </div>

                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}