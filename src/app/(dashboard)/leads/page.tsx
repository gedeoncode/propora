import Link from "next/link";

import { agentService } from "@/features/agents/services/agent.service";
import { leadService } from "@/features/leads/services/lead.service";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/features/leads/types/lead";
import type { LeadSource, LeadStatus } from "@/features/leads/types/lead";
import { LeadActions } from "@/features/leads/components/lead-actions";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/shared/summary-card";
import { UsersRound } from "lucide-react";


type LeadsPageProps = {
  searchParams: Promise<{
    status?: string;
    source?: string;
  }>;
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
const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function getLeadStatusVariant(status: LeadStatus) {
  switch (status) {
    case "new":
      return "info" as const;

    case "contacted":
      return "brand" as const;

    case "qualified":
      return "brand" as const;

    case "viewing_scheduled":
      return "info" as const;

    case "negotiating":
      return "warning" as const;

    case "converted":
      return "success" as const;

    case "lost":
      return "danger" as const;
  }
}

function isLeadStatus(value?: string): value is LeadStatus {
  return Boolean(value && LEAD_STATUSES.includes(value as LeadStatus));
}

function isLeadSource(value?: string): value is LeadSource {
  return Boolean(value && LEAD_SOURCES.includes(value as LeadSource));
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getResultsStart(count: number) {
  return count === 0 ? 0 : 1;
}

function getResultsEnd(count: number) {
  return count;
}
export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  await requireRole([...ALLOWED_ROLES]);
  await connectToDatabase();

  const params = await searchParams;
  const status = isLeadStatus(params.status) ? params.status : undefined;
  const source = isLeadSource(params.source) ? params.source : undefined;

  const [allLeads, leads, agents] = await Promise.all([
    leadService.list(),
    leadService.list({
      status,
      source,
    }),
    agentService.list(),
  ]);

  const agentNames = new Map<string, string>();

  for (const agent of agents) {
    const agentId = agent._id.toString();
    const user = agent.userId as unknown as {
      firstName?: string;
      lastName?: string;
    };

    agentNames.set(
      agentId,
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "Unnamed agent",
    );
  }

  const counts = {
    total: allLeads.length,
    new: allLeads.filter((lead) => lead.status === "new").length,
    qualified: allLeads.filter((lead) => lead.status === "qualified").length,
    converted: allLeads.filter((lead) => lead.status === "converted").length,
  };

  const hasFilters = Boolean(status || source);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track prospects, manage follow-ups, and turn enquiries into customers."
        action={{
          href: "/leads/new",
          label: "Add lead",
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total leads" value={counts.total} />
        <SummaryCard label="New leads" value={counts.new} />
        <SummaryCard label="Qualified leads" value={counts.qualified} />
        <SummaryCard label="Converted leads" value={counts.converted} />
      </div>

      <form
        action="/leads"
        method="GET"
        className="rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Filter leads</h2>
            <p className="text-sm text-muted-foreground">
              Narrow the directory by status or acquisition source.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Lead status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={status ?? ""}
                className={selectClassName}
              >
                <option value="">All statuses</option>

                {LEAD_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">
                Lead source
              </label>

              <select
                id="source"
                name="source"
                defaultValue={source ?? ""}
                className={selectClassName}
              >
                <option value="">All sources</option>

                {LEAD_SOURCES.map((item) => (
                  <option key={item} value={item}>
                    {SOURCE_LABELS[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
            {hasFilters ? (
              <Link
                href="/leads"
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Clear filters
              </Link>
            ) : null}

            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Apply filters
            </button>
          </div>
        </div>
      </form>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold">Lead directory</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {leads.length} {leads.length === 1 ? "lead" : "leads"}{" "}
              {hasFilters ? "match your filters" : "in your directory"}
            </p>
          </div>

          {hasFilters ? (
            <Link
              href="/leads"
              className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View all leads
            </Link>
          ) : null}
        </div>

        {leads.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UsersRound className="size-5" aria-hidden="true" />
            </div>
            <h3 className="font-medium">
              {hasFilters ? "No leads match these filters" : "No leads yet"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasFilters
                ? "Try changing your filters or clear them to see all leads."
                : "Add your first lead to start managing prospective customers."}
            </p>
            {!hasFilters && (
              <Link
                href="/leads/new"
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add your first lead
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
             
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Lead
                  </th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Source
                  </th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Assigned agent
                  </th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Interested properties
                  </th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Added
                  </th>
                  <th className="w-16 px-5 py-3 text-right font-medium text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {leads.map((lead) => {
                  const id = lead._id.toString();

                  return (
                    <tr
                      key={id}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {getInitials(lead.firstName, lead.lastName)}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/leads/${id}`}
                              className="font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                              {lead.firstName} {lead.lastName}
                            </Link>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {lead.email || lead.phone || "No contact details"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {SOURCE_LABELS[lead.source as LeadSource]}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          variant={getLeadStatusVariant(lead.status)}
                        >
                          {STATUS_LABELS[lead.status as LeadStatus]}
                        </StatusBadge>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {lead.assignedAgentId
                          ? (agentNames.get(lead.assignedAgentId.toString()) ??
                            "Unknown agent")
                          : "Unassigned"}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {lead.interestedPropertyIds.length}
                        {lead.interestedPropertyIds.length === 1
                          ? " property"
                          : " properties"}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <LeadActions
                          leadId={id}
                          leadName={`${lead.firstName} ${lead.lastName}`}
                          currentStatus={lead.status}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
