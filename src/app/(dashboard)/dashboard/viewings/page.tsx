import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Video,
  MapPin,
  Users,
  CheckCircle2,
  CircleAlert,
  CalendarCheck,
} from "lucide-react";

import { viewingService } from "@/features/viewings/services/viewing.service";
import {
  VIEWING_STATUSES,
  VIEWING_TYPES,
  type ViewingStatus,
  type ViewingType,
} from "@/features/viewings/types/viewing";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryCard } from "@/components/shared/summary-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ViewingActions } from "@/features/viewings/components/viewing-actions";

type SearchParams = {
  status?: string;
  type?: string;
};

type PopulatedViewing = {
  _id: { toString(): string };
  propertyId: {
    title: string;
    location?: {
      address?: string;
      city?: string;
      region?: string;
    };
  } | null;
  agentId: {
    userId: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  customerId: {
    firstName: string;
    lastName: string;
  } | null;
  leadId: {
    firstName: string;
    lastName: string;
  } | null;
  type: ViewingType;
  status: ViewingStatus;
  scheduledAt: Date;
  durationMinutes: number;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(date));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  }).format(new Date(date));
}

function getViewingStatusVariant(status: ViewingStatus) {
  switch (status) {
    case "scheduled":
      return "info" as const;

    case "confirmed":
      return "success" as const;

    case "completed":
      return "neutral" as const;

    case "cancelled":
      return "danger" as const;

    case "no_show":
      return "warning" as const;
  }
}

function getParticipantName(viewing: PopulatedViewing) {
  const participant = viewing.customerId ?? viewing.leadId;

  if (!participant) {
    return "No participant";
  }

  return `${participant.firstName} ${participant.lastName}`;
}

function getAgentName(viewing: PopulatedViewing) {
  const user = viewing.agentId?.userId;

  return user ? `${user.firstName} ${user.lastName}` : "Unassigned";
}

function getLocation(viewing: PopulatedViewing) {
  const location = viewing.propertyId?.location;

  if (!location) {
    return "Location unavailable";
  }

  return (
    [location.address, location.city, location.region]
      .filter(Boolean)
      .join(", ") || "Location unavailable"
  );
}

export default async function ViewingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole(["admin", "manager", "agent", "staff"]);

  const params = await searchParams;

  const status = VIEWING_STATUSES.includes(params.status as ViewingStatus)
    ? (params.status as ViewingStatus)
    : undefined;

  const type = VIEWING_TYPES.includes(params.type as ViewingType)
    ? (params.type as ViewingType)
    : undefined;

  const [allResults, filteredResults] = await Promise.all([
    viewingService.list(),
    viewingService.list({ status, type }),
  ]);

  const allViewings = allResults as unknown as PopulatedViewing[];

  const viewings = filteredResults as unknown as PopulatedViewing[];

  const scheduledCount = allViewings.filter(
    (viewing) => viewing.status === "scheduled",
  ).length;

  const confirmedCount = allViewings.filter(
    (viewing) => viewing.status === "confirmed",
  ).length;

  const completedCount = allViewings.filter(
    (viewing) => viewing.status === "completed",
  ).length;

  const hasFilters = Boolean(status || type);

  function filterHref(nextStatus?: ViewingStatus, nextType?: ViewingType) {
    const query = new URLSearchParams();

    if (nextStatus) query.set("status", nextStatus);
    if (nextType) query.set("type", nextType);

    const search = query.toString();
    return search ? `/viewings?${search}` : "/viewings";
  }

  return (
    <main className="space-y-6">
      <PageHeader
        title="Viewings"
        description="Schedule and manage property appointments across your team."
        action={{
          href: "/dashboard/viewings/new",
          label: "Schedule viewing",
        }}
      />

      <section
        aria-label="Viewing summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          label="Total viewings"
          value={allViewings.length}
          description="All recorded appointments"
          icon={<CalendarDays className="size-5" />}
        />

        <SummaryCard
          label="Scheduled"
          value={scheduledCount}
          description="Awaiting confirmation"
          icon={<Clock3 className="size-5" />}
        />

        <SummaryCard
          label="Confirmed"
          value={confirmedCount}
          description="Appointments confirmed"
          icon={<CalendarCheck className="size-5" />}
        />

        <SummaryCard
          label="Completed"
          value={completedCount}
          description="Visits marked complete"
          icon={<CheckCircle2 className="size-5" />}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5">
          <div>
            <h2 className="font-semibold">Viewing schedule</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {viewings.length} {viewings.length === 1 ? "viewing" : "viewings"}{" "}
              found
            </p>
          </div>

          <form
            action="/dashboard/viewings"
            method="get"
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="status"
                className="text-xs font-medium text-muted-foreground"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={status ?? ""}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All statuses</option>
                {VIEWING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-xs font-medium text-muted-foreground"
              >
                Viewing type
              </label>

              <select
                id="type"
                name="type"
                defaultValue={type ?? ""}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All types</option>
                {VIEWING_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="h-10 w-full rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
              >
                Apply filters
              </button>
            </div>

            {hasFilters && (
              <div className="flex items-end">
                <Link
                  href="/viewings"
                  className="inline-flex h-10 items-center justify-center px-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Link>
              </div>
            )}
          </form>
        </div>

        {viewings.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>

            <h3 className="mt-4 text-sm font-semibold">
              {hasFilters
                ? "No viewings match these filters"
                : "No viewings yet"}
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {hasFilters
                ? "Try changing your filters to find other appointments."
                : "Scheduled property visits will appear here once you create your first viewing."}
            </p>

            {hasFilters && (
              <Link
                href="/dashboard/viewings"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Client / lead</th>
                  <th className="px-5 py-3 font-medium">Date & time</th>
                  <th className="px-5 py-3 font-medium">Agent</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {viewings.map((viewing) => (
                  <tr
                    key={viewing._id.toString()}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {viewing.type === "virtual" ? (
                            <Video className="size-4" aria-hidden="true" />
                          ) : (
                            <MapPin className="size-4" aria-hidden="true" />
                          )}
                        </span>

                        <div className="max-w-65">
                          <Link
                            href={`/dashboard/viewings/${viewing._id.toString()}`}
                            className="font-medium hover:text-primary"
                          >
                            {viewing.propertyId?.title ??
                              "Property unavailable"}
                          </Link>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {getLocation(viewing)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Users
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span>{getParticipantName(viewing)}</span>
                      </div>
                      <p className="mt-1 pl-6 text-xs text-muted-foreground">
                        {viewing.customerId ? "Customer" : "Lead"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {formatDate(viewing.scheduledAt)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(viewing.scheduledAt)}
                        {" · "}
                        {viewing.durationMinutes} min
                      </p>
                    </td>

                    <td className="px-5 py-4">{getAgentName(viewing)}</td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md border border-border px-2 py-1 text-xs">
                        {formatLabel(viewing.type)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        variant={getViewingStatusVariant(viewing.status)}
                      >
                        {formatLabel(viewing.status)}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ViewingActions
                        viewingId={viewing._id.toString()}
                        propertyTitle={
                          viewing.propertyId?.title ?? "Property unavailable"
                        }
                        participantName={getParticipantName(viewing)}
                        status={viewing.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewings.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {viewings.length}{" "}
              {viewings.length === 1 ? "viewing" : "viewings"}
            </span>
            <span>Times shown in East Africa Time (EAT)</span>
          </div>
        )}
      </section>
    </main>
  );
}
