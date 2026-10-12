import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Video,
} from "lucide-react";

import { viewingService } from "@/features/viewings/services/viewing.service";
import { propertyService } from "@/features/properties/services/property.service";
import { agentService } from "@/features/agents/services/agent.service";
import { customerService } from "@/features/customers/services/customer.service";
import { leadService } from "@/features/leads/services/lead.service";
import type { ViewingStatus } from "@/features/viewings/types/viewing";

import { requireRole } from "@/lib/auth/guards";

import { ViewingStatusActions } from "@/features/viewings/components/viewing-status-actions";

type ViewingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function formatDateTime(value: Date) {
  return `${formatDate(value)} at ${formatTime(value)}`;
}

function getStatusClassName(status: ViewingStatus) {
  switch (status) {
    case "scheduled":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300";

    case "confirmed":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";

    case "completed":
      return "bg-muted text-muted-foreground";

    case "cancelled":
      return "bg-destructive/10 text-destructive";

    case "no_show":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default async function ViewingDetailPage({
  params,
}: ViewingDetailPageProps) {
  await requireRole(["admin", "manager", "agent", "staff"]);

  const { id } = await params;

  let viewing;

  try {
    viewing = await viewingService.getById(id);
  } catch {
    notFound();
  }

  const propertyId = viewing.propertyId.toString();
  const agentId = viewing.agentId.toString();
  const customerId = viewing.customerId?.toString();
  const leadId = viewing.leadId?.toString();

  const [property, agent, customer, lead] = await Promise.all([
    propertyService.getById(propertyId),
    agentService.getById(agentId),
    customerId ? customerService.getById(customerId) : Promise.resolve(null),
    leadId ? leadService.getById(leadId) : Promise.resolve(null),
  ]);

  const participant = customer ?? lead;

  const participantName = participant
    ? `${participant.firstName} ${participant.lastName}`
    : "Unknown participant";

  const participantType = customer ? "Customer" : "Lead";

  const participantEmail =
    participant && "email" in participant ? participant.email : null;

  const participantPhone =
    participant && "phone" in participant ? participant.phone : null;

  const agentName = `${agent.userId.firstName} ${agent.userId.lastName}`;

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/viewings"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to viewings
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Viewing details
            </h1>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                viewing.status,
              )}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {formatLabel(viewing.status)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {formatDateTime(viewing.scheduledAt)}
          </p>
        </div>

        <ViewingStatusActions
          viewingId={viewing._id.toString()}
          status={viewing.status}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {viewing.type === "virtual" ? (
                    <Video className="size-5" aria-hidden="true" />
                  ) : (
                    <MapPin className="size-5" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Property
                  </p>

                  <Link
                    href={`/properties/${property._id}`}
                    className="mt-1 block truncate text-lg font-semibold hover:text-primary"
                  >
                    {property.title}
                  </Link>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {property.location.city}, {property.location.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Viewing type
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatLabel(viewing.type)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatDate(viewing.scheduledAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Duration
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <Clock3
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {viewing.durationMinutes} minutes
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Appointment</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                People associated with this viewing.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {participantType}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {participant
                      ? getInitials(participant.firstName, participant.lastName)
                      : "?"}
                  </span>

                  <div className="min-w-0">
                    <p className="font-medium">{participantName}</p>

                    {participantEmail && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {participantEmail}
                      </p>
                    )}
                  </div>
                </div>

                {(participantEmail || participantPhone) && (
                  <div className="mt-4 space-y-2 text-sm">
                    {participantEmail && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="size-4" aria-hidden="true" />
                        <span>{participantEmail}</span>
                      </div>
                    )}

                    {participantPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="size-4" aria-hidden="true" />
                        <span>{participantPhone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Assigned agent
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="size-5" aria-hidden="true" />
                  </span>

                  <div>
                    <p className="font-medium">{agentName}</p>

                    {agent.userId.email && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {agent.userId.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {viewing.notes && (
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Notes</h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {viewing.notes}
              </p>
            </section>
          )}

          {viewing.cancellationReason && (
            <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
              <h2 className="text-lg font-semibold text-destructive">
                Cancellation reason
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {viewing.cancellationReason}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Schedule</h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Date</dt>

                <dd className="mt-1 flex items-center gap-2">
                  <CalendarDays
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {formatDate(viewing.scheduledAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Time</dt>

                <dd className="mt-1">{formatTime(viewing.scheduledAt)} EAT</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Duration</dt>

                <dd className="mt-1">{viewing.durationMinutes} minutes</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Format</dt>

                <dd className="mt-1">
                  {viewing.type === "virtual"
                    ? "Virtual viewing"
                    : "In-person viewing"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Record</h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>

                <dd className="mt-1">{formatDateTime(viewing.createdAt)}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Last updated</dt>

                <dd className="mt-1">{formatDateTime(viewing.updatedAt)}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Viewing ID</dt>

                <dd className="mt-1 break-all font-mono text-xs">
                  {viewing._id.toString()}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}
