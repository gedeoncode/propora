
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, UserRound } from "lucide-react";

import { agentService } from "@/features/agents/services/agent.service";
import type { Agent } from "@/features/agents/types/agent";
import { connectToDatabase } from "@/lib/db/mongoose";

export const metadata: Metadata = {
  title: "Meet Our Agents | Propora",
  description:
    "Meet Propora's active real-estate agents and explore their areas of specialization.",
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

export default async function AgentsPage() {
  let agents: Agent[] = [];

  try {
    await connectToDatabase();

    // The service populates userId with the user's name and email.
    // Only display the public professional fields below.
    agents = (await agentService.list("active")) as unknown as Agent[];
  } catch {
    return (
      <main className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Meet our agents
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Our agent directory is temporarily unavailable. Please try again
            shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">
            People behind the properties
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Meet the people ready to help you move forward.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Connect with our active real-estate professionals to explore
            properties and discuss your next move.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="agents-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="agents-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Our agents
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-estate professionals with different areas of expertise.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {agents.length} {agents.length === 1 ? "agent" : "agents"}
          </p>
        </div>

        {agents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <UserRound
              className="mx-auto size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-semibold">
              Our directory is growing
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              There are no active agent profiles to display right now.
              Browse our current property listings in the meantime.
            </p>
            <Link
              href="/discover"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Explore properties
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const fullName = [
                agent.userId?.firstName,
                agent.userId?.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article
                  key={agent._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4 p-5 sm:p-6">
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {agent.profileImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={agent.profileImageUrl}
                          alt=""
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

                    <div className="min-w-0 pt-1">
                      <h3 className="break-words text-lg font-semibold">
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

                  {agent.bio && (
                    <p className="px-5 text-sm leading-6 text-muted-foreground sm:px-6">
                      {agent.bio}
                    </p>
                  )}

                  {agent.specializations.length > 0 && (
                    <div className="px-5 pb-5 pt-4 sm:px-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Specializations
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {agent.specializations.map((specialization) => (
                          <li
                            key={specialization}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                          >
                            {specializationLabels[specialization] ??
                              specialization}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t border-border px-5 py-4 sm:px-6">
                    <Link
                      href="/discover"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      Browse properties
                      <ArrowRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
