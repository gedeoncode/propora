import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Plus,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { dashboardService } from "@/features/analytics/services/dashboard.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/shared/summary-card";

function formatViewingDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDisplayName(value: unknown) {
  if (!value || typeof value !== "object") {
    return "—";
  }

  const record = value as {
    firstName?: string;
    lastName?: string;
  };

  return (
    [record.firstName, record.lastName].filter(Boolean).join(" ") || "—"
  );
}

function getViewingStatusVariant(status: string) {
  switch (status) {
    case "confirmed":
      return "success" as const;

    case "scheduled":
      return "info" as const;

    default:
      return "neutral" as const;
  }
}

function formatViewingType(type: string) {
  return type === "physical" ? "In person" : "Virtual";
}

export default async function DashboardPage() {
  await connectToDatabase();

  const {
    scope,
    metrics,
    upcomingViewings,
  } = await dashboardService.getOverview();

  const isAgentScope = scope === "agent";

  const publishedRate =
    metrics.properties.total > 0
      ? Math.round(
          (metrics.properties.published /
            metrics.properties.total) *
            100,
        )
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description={
          isAgentScope
            ? "A focused view of your properties, leads, customers, and upcoming activity."
            : "A clear snapshot of your real-estate operations and upcoming activity."
        }
      />

      <section
        aria-label="Workspace metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          label="Properties"
          value={metrics.properties.total}
          description={`${metrics.properties.published} published`}
        />

        <SummaryCard
          label="Available properties"
          value={metrics.properties.available}
          description="Currently available"
        />

        <SummaryCard
          label="Active leads"
          value={metrics.leads.active}
          description="Not converted or lost"
        />

        <SummaryCard
          label="Active customers"
          value={metrics.customers.active}
          description="Currently active"
        />
      </section>

      <section
        aria-labelledby="quick-actions-heading"
        className="space-y-4"
      >
        <div>
          <h2
            id="quick-actions-heading"
            className="font-semibold"
          >
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Jump directly into the most common workspace tasks.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/properties/new"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Add property
              </span>

              <span className="mt-0.5 block text-xs text-muted-foreground">
                Create a new listing
              </span>
            </span>

            <ArrowRight
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/leads/new"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRoundSearch
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Add lead
              </span>

              <span className="mt-0.5 block text-xs text-muted-foreground">
                Capture a new prospect
              </span>
            </span>

            <ArrowRight
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/customers/new"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Add customer
              </span>

              <span className="mt-0.5 block text-xs text-muted-foreground">
                Create a customer profile
              </span>
            </span>

            <ArrowRight
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/viewings/new"
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium">
                Schedule viewing
              </span>

              <span className="mt-0.5 block text-xs text-muted-foreground">
                Book a property appointment
              </span>
            </span>

            <ArrowRight
              className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between gap-4 border-b p-5">
            <div>
              <h2 className="font-semibold">
                Upcoming viewings
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {isAgentScope
                  ? "Your next scheduled property appointments."
                  : "The next scheduled property appointments."}
              </p>
            </div>

            <Link
              href="/viewings"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View all
              <ArrowRight
                className="size-3.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {upcomingViewings.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <CalendarDays
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 text-sm font-medium">
                No upcoming viewings
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Scheduled property appointments will appear here.
              </p>

              <Link
                href="/viewings/new"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Plus
                  className="size-3.5"
                  aria-hidden="true"
                />
                Schedule viewing
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {upcomingViewings.map((viewing) => {
                const property = viewing.propertyId as
                  | {
                      title?: string;
                      location?: {
                        city?: string;
                      };
                    }
                  | null;

                const customerName = getDisplayName(
                  viewing.customerId,
                );

                const leadName = getDisplayName(
                  viewing.leadId,
                );

                const contactName =
                  customerName !== "—"
                    ? customerName
                    : leadName;

                return (
                  <Link
                    key={String(viewing._id)}
                    href={`/viewings/${String(viewing._id)}`}
                    className="group flex flex-col gap-4 p-5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {property?.title ||
                            "Property viewing"}
                        </p>

                        <StatusBadge
                          variant={getViewingStatusVariant(
                            viewing.status,
                          )}
                        >
                          {viewing.status === "confirmed"
                            ? "Confirmed"
                            : "Scheduled"}
                        </StatusBadge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {property?.location?.city ||
                          "Location unavailable"}
                      </p>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="text-sm font-medium">
                        {formatViewingDate(
                          viewing.scheduledAt,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {contactName !== "—"
                          ? contactName
                          : formatViewingType(viewing.type)}
                      </p>
                    </div>

                    <ArrowRight
                      className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b p-5">
            <h2 className="font-semibold">
              Operational snapshot
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current workspace capacity and inventory.
            </p>
          </div>

          <div className="divide-y">
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">
                  Active agents
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {isAgentScope
                    ? "Your agent workspace"
                    : "Currently active"}
                </p>
              </div>

              <p className="text-xl font-semibold tracking-tight">
                {metrics.agents.active}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">
                  Upcoming viewings
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Scheduled or confirmed
                </p>
              </div>

              <p className="text-xl font-semibold tracking-tight">
                {metrics.viewings.upcoming}
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Published inventory
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Published vs total properties
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {publishedRate}%
                </p>
              </div>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Published property percentage"
                aria-valuenow={publishedRate}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${publishedRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">
                  Active leads
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Prospects still in progress
                </p>
              </div>

              <Link
                href="/leads"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {metrics.leads.active}
                <ArrowRight
                  className="size-3.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}