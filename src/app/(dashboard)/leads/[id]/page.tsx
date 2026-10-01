import Link from "next/link";
import { notFound } from "next/navigation";

import { agentService } from "@/features/agents/services/agent.service";
import { leadService } from "@/features/leads/services/lead.service";
import { propertyService } from "@/features/properties/services/property.service";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadSource,
  type LeadStatus,
} from "@/features/leads/types/lead";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";

import { viewingService } from "@/features/viewings/services/viewing.service";
import { ViewingStatus } from "@/features/viewings/types/viewing";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  viewing_scheduled: "Viewing scheduled",
  negotiating: "Negotiating",
  converted: "Converted",
  lost: "Lost",
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  social_media: "Social media",
  property_portal: "Property portal",
  walk_in: "Walk-in",
  phone: "Phone",
  email: "Email",
  other: "Other",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  contacted: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  qualified: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  viewing_scheduled: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  negotiating: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  converted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  lost: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

const VIEWING_STATUS_LABELS: Record<ViewingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

const VIEWING_STATUS_STYLES: Record<ViewingStatus, string> = {
  scheduled: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  no_show: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

export default async function LeadDetailsPage({ params }: PageProps) {
  await requireRole([...ALLOWED_ROLES]);
  await connectToDatabase();

  const { id } = await params;

  let lead: Awaited<ReturnType<typeof leadService.getById>>;

  try {
    lead = await leadService.getById(id);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "NOT_FOUND"
    ) {
      notFound();
    }

    throw error;
  }

  const [agentResult, propertyResults, viewings] = await Promise.all([
    lead.assignedAgentId
      ? agentService.getById(lead.assignedAgentId.toString())
      : Promise.resolve(null),

    Promise.allSettled(
      lead.interestedPropertyIds.map((propertyId) =>
        propertyService.getById(propertyId.toString()),
      ),
    ),

    viewingService.list({
      leadId: id,
    }),
  ]);

  const agentUser = agentResult?.userId as unknown as
    | {
        firstName?: string;
        lastName?: string;
        email?: string;
      }
    | undefined;

  const agentName = agentUser
    ? [agentUser.firstName, agentUser.lastName].filter(Boolean).join(" ")
    : null;

  const properties = propertyResults
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<
        Awaited<ReturnType<typeof propertyService.getById>>
      > => result.status === "fulfilled",
    )
    .map((result) => result.value);

  const initials =
    `${lead.firstName.charAt(0)}${lead.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Back to leads
        </Link>

        <Link
          href={`/leads/${id}/edit`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Edit lead
        </Link>
      </div>

      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {lead.firstName} {lead.lastName}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[lead.status]}`}
              >
                {STATUS_LABELS[lead.status]}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Lead created {formatDate(lead.createdAt)}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary hover:underline"
                >
                  {lead.email}
                </a>
              )}

              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="text-primary hover:underline"
                >
                  {lead.phone}
                </a>
              )}

              {!lead.email && !lead.phone && (
                <span className="text-muted-foreground">
                  No contact details
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="">
        <div className="space-y-6 grid grid-cols-1 sm:space-y-0 sm:gap-6 lg:grid lg:grid-cols-2">
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Lead information</h2>

            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Lead source"
                value={SOURCE_LABELS[lead.source]}
              />
              <InfoItem
                label="Current status"
                value={STATUS_LABELS[lead.status]}
              />
              <InfoItem
                label="Assigned agent"
                value={agentName || "Unassigned"}
              />
              <InfoItem
                label="Last updated"
                value={formatDate(lead.updatedAt)}
              />
            </dl>
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Interested properties</h2>
              <span className="text-sm text-muted-foreground">
                {lead.interestedPropertyIds.length}
              </span>
            </div>

            {properties.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                No interested properties have been added to this lead.
              </p>
            ) : (
              <div className="mt-4 divide-y">
                {properties.map((property) => (
                  <div
                    key={property._id.toString()}
                    className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{property.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[property.location.city, property.location.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {property.currency}{" "}
                        {new Intl.NumberFormat("en-KE", {
                          maximumFractionDigits: 2,
                        }).format(property.price)}
                        {" · "}
                        {property.listingType === "sale"
                          ? "For sale"
                          : "For rent"}
                      </p>
                    </div>

                    <Link
                      href={`/properties/${property.slug}`}
                      className="shrink-0 text-sm font-medium text-primary hover:underline"
                    >
                      View property →
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {properties.length < lead.interestedPropertyIds.length && (
              <p className="mt-4 text-xs text-muted-foreground">
                Some previously linked properties could not be found.
              </p>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Viewings</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Property viewings associated with this lead.
                </p>
              </div>

              <span className="text-sm text-muted-foreground">
                {viewings.length}
              </span>
            </div>

            {viewings.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                No viewings have been scheduled for this lead.
              </p>
            ) : (
              <div className="mt-4 divide-y">
                {viewings.map((viewing) => (
                  <div
                    key={viewing._id.toString()}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {formatDate(viewing.scheduledAt)}
                        </p>

                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${VIEWING_STATUS_STYLES[viewing.status]}`}
                        >
                          {VIEWING_STATUS_LABELS[viewing.status]}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {viewing.type === "physical"
                          ? "Physical viewing"
                          : "Virtual viewing"}{" "}
                        · {viewing.durationMinutes} minutes
                      </p>

                      {viewing.notes && (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {viewing.notes}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/viewings/${viewing._id.toString()}`}
                      className="shrink-0 text-sm font-medium text-primary hover:underline"
                    >
                      View viewing →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Notes</h2>
            {lead.notes ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {lead.notes}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No notes have been added.
              </p>
            )}
          </section>
             <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Contact actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Send email
                </a>
              )}

              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Call lead
                </a>
              )}

              {!lead.email && !lead.phone && (
                <p className="text-sm text-muted-foreground">
                  Add contact details to enable email and call actions.
                </p>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
