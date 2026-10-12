
import Link from "next/link";
import { notFound } from "next/navigation";

import { agentService } from "@/features/agents/services/agent.service";
import { leadService } from "@/features/leads/services/lead.service";
import { propertyService } from "@/features/properties/services/property.service";
import { LEAD_SOURCES } from "@/features/leads/types/lead";
import { requireRole } from "@/lib/auth/guards";

import LeadEditForm from "@/features/leads/components/lead-edit-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

export default async function EditLeadPage({ params }: PageProps) {
  await requireRole([...ALLOWED_ROLES]);

  const { id } = await params;

  let lead;

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

  const [agents, properties] = await Promise.all([
    agentService.list("active"),
    propertyService.list(
      { publicationStatus: "published" },
      { page: 1, limit: 100 },
    ),
  ]);

  const agentOptions = agents.map((agent) => {
    const user = agent.userId as unknown as {
      firstName?: string;
      lastName?: string;
    };

    return {
      id: agent._id.toString(),
      label:
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "Unnamed agent",
    };
  });

  const propertyOptions = properties.items.map((property) => ({
    id: property._id.toString(),
    label: `${property.title} — ${property.location.city}`,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Link
          href={`/leads/${id}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to lead
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit lead
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update contact details, assignment, and property interests.
            The current lead status will remain unchanged.
          </p>
        </div>
      </div>

      <LeadEditForm
        lead={{
          id: lead._id.toString(),
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email ?? "",
          phone: lead.phone ?? "",
          source: lead.source,
          assignedAgentId: lead.assignedAgentId?.toString() ?? "",
          interestedPropertyIds: lead.interestedPropertyIds.map((item: { toString: () => string }) =>
            item.toString(),
          ),
          notes: lead.notes ?? "",
        }}
        sources={[...LEAD_SOURCES]}
        agents={agentOptions}
        properties={propertyOptions}
      />
    </div>
  );
}