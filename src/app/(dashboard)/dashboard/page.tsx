import { dashboardService } from "@/features/analytics/services/dashboard.service";
import { connectToDatabase } from "@/lib/db/mongoose";

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {detail ? (
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  );
}

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

  return [record.firstName, record.lastName].filter(Boolean).join(" ") || "—";
}

export default async function DashboardPage() {
  await connectToDatabase();

  const {
    scope,
    metrics,
    upcomingViewings,
  } = await dashboardService.getOverview();

  const isAgentScope = scope === "agent";

  return (
    <div className="space-y-8">
      {/* <div>
        <p className="text-sm font-medium text-primary">
          {isAgentScope ? "Agent workspace" : "Workspace overview"}
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isAgentScope
            ? "A focused view of your properties, leads, customers, and upcoming viewings."
            : "A snapshot of your real-estate operations and upcoming activity."}
        </p>
      </div> */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Properties"
          value={metrics.properties.total}
          detail={`${metrics.properties.published} published`}
        />

        <MetricCard
          label="Available properties"
          value={metrics.properties.available}
          detail="Currently available"
        />

        <MetricCard
          label="Active leads"
          value={metrics.leads.active}
          detail="Not converted or lost"
        />

        <MetricCard
          label="Active customers"
          value={metrics.customers.active}
          detail="Currently active"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Workspace activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current operational activity.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Active agents</p>
              <p className="mt-1 text-2xl font-semibold">
                {metrics.agents.active}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Upcoming viewings
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {metrics.viewings.upcoming}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div>
            <h2 className="font-semibold">Property inventory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current publication and availability status.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total properties
              </span>
              <span className="font-medium">
                {metrics.properties.total}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Published
              </span>
              <span className="font-medium">
                {metrics.properties.published}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available
              </span>
              <span className="font-medium">
                {metrics.properties.available}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Upcoming viewings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAgentScope
              ? "Your next scheduled property viewings."
              : "The next scheduled property viewings."}
          </p>
        </div>

        {upcomingViewings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium">No upcoming viewings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Scheduled viewings will appear here.
            </p>
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

              return (
                <div
                  key={String(viewing._id)}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {property?.title || "Property viewing"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {property?.location?.city || "Location unavailable"}
                    </p>
                  </div>

                  <div className="text-sm sm:text-right">
                    <p className="font-medium">
                      {formatViewingDate(viewing.scheduledAt)}
                    </p>

                    <p className="mt-1 text-muted-foreground">
                      {getDisplayName(viewing.customerId) !== "—"
                        ? getDisplayName(viewing.customerId)
                        : getDisplayName(viewing.leadId)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}