import { clientEnv } from "@/config/env.client";
import {
  CalendarCheck,
  CircleUserRound,
  Handshake,
  MessageSquare,
} from "lucide-react";

const agentWorkflow = [
  {
    label: "Leads",
    description: "See the opportunities that need attention.",
    icon: Handshake,
  },
  {
    label: "Customers",
    description: "Keep customer conversations connected to the work.",
    icon: MessageSquare,
  },
  {
    label: "Viewings",
    description: "Coordinate property appointments without losing context.",
    icon: CalendarCheck,
  },
];

export function MarketingAgentsSection() {
  return (
    <section id="agents" className="border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-primary">
            Built around your team
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Give every agent a clearer view of the work that matters.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Agents need more than a list of properties. {clientEnv.NEXT_PUBLIC_APP_NAME} keeps leads,
            customers, and viewings connected so your team can understand what
            needs attention and move work forward.
          </p>
        </div>

        {/* Agent workspace preview */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <CircleUserRound className="size-4" aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Agent workspace
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Keep daily work connected
                </p>
              </div>
            </div>

            <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Active work
            </span>
          </div>

          <div className="divide-y divide-border">
            {agentWorkflow.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 px-5 py-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border bg-muted/30 px-5 py-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Keep property activity and customer-facing work in the same
              operational context.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}