import Link from "next/link";
import { notFound } from "next/navigation";

import { agentService } from "@/features/agents/services/agent.service";
import { customerService } from "@/features/customers/services/customer.service";
import { leadService } from "@/features/leads/services/lead.service";
import { propertyService } from "@/features/properties/services/property.service";
import { viewingService } from "@/features/viewings/services/viewing.service";
import { VIEWING_TYPES } from "@/features/viewings/types/viewing";
import { requireRole } from "@/lib/auth/guards";

import ViewingEditForm from "@/features/viewings/components/viewing-edit-form";

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditViewingPage({ params }: PageProps) {
  await requireRole([...ALLOWED_ROLES]);

  const { id } = await params;

  let viewing;

  try {
    viewing = await viewingService.getById(id);
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

  const [properties, agents, customers, leads] = await Promise.all([
    propertyService.list({}, { page: 1, limit: 100 }),
    agentService.list(),
    customerService.list(),
    leadService.list(),
  ]);

  const propertyOptions = properties.map((property) => ({
    id: property._id.toString(),
    label: `${property.title} — ${property.location.city}`,
  }));

  const agentOptions = agents.map((agent) => ({
    id: agent._id.toString(),
    label: `${agent.userId.firstName} ${agent.userId.lastName}`,
  }));

  const customerOptions = customers.map((customer) => ({
    id: customer._id.toString(),
    label: `${customer.firstName} ${customer.lastName}`,
  }));

  const leadOptions = leads.map((lead) => ({
    id: lead._id.toString(),
    label: `${lead.firstName} ${lead.lastName}`,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Link
          href={`/viewings/${id}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to viewing
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit viewing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the property, participant, agent, or schedule.
          </p>
        </div>
      </div>

      {["completed", "cancelled", "no_show"].includes(viewing.status) ? (
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-medium">This viewing cannot be edited.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed, cancelled, and no-show viewings are read-only.
          </p>
        </div>
      ) : (
        <ViewingEditForm
          viewing={{
            id: viewing._id.toString(),
            propertyId: viewing.propertyId.toString(),
            agentId: viewing.agentId.toString(),
            customerId: viewing.customerId?.toString() ?? "",
            leadId: viewing.leadId?.toString() ?? "",
            type: viewing.type,
            scheduledAt: viewing.scheduledAt.toISOString(),
            durationMinutes: viewing.durationMinutes,
            notes: viewing.notes ?? "",
          }}
          properties={propertyOptions}
          agents={agentOptions}
          customers={customerOptions}
          leads={leadOptions}
          viewingTypes={[...VIEWING_TYPES]}
        />
      )}
    </div>
  );
}