import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { agentService } from "@/features/agents/services/agent.service";
import { customerService } from "@/features/customers/services/customer.service";
import { leadService } from "@/features/leads/services/lead.service";
import { propertyService } from "@/features/properties/services/property.service";
import { requireRole } from "@/lib/auth/guards";

import { ViewingForm } from "@/features/viewings/components/viewing-form";
import { PageHeader } from "@/components/layout/page-header";

export default async function NewViewingPage() {
  await requireRole(["admin", "manager", "agent", "staff"]);

  const [propertyResult, agents, customers, leads] = await Promise.all([
    propertyService.list({}, { page: 1, limit: 100 }),
    agentService.list("active"),
    customerService.list({ status: "active" }),
    leadService.list(),
  ]);

  const properties = propertyResult.items
    .filter(
      (property) =>
        property.publicationStatus !== "archived" &&
        ["available", "under_offer"].includes(property.availabilityStatus),
    )
    .map((property) => ({
      id: property._id.toString(),
      title: property.title,
      location: `${property.location.city}, ${property.location.country}`,
      currency: property.currency,
      price: property.price,
      listingType: property.listingType,
    }));

  const agentOptions = agents
    .filter((agent) => agent.status === "active" && agent.userId)
    .map((agent) => ({
      id: agent._id.toString(),
      name: `${agent.userId.firstName} ${agent.userId.lastName}`,
    }));

  const customerOptions = customers.map((customer) => ({
    id: customer._id.toString(),
    name: `${customer.firstName} ${customer.lastName}`,
    email: customer.email ?? "",
  }));

  const leadOptions = leads
    .filter((lead) => lead.status !== "lost")
    .map((lead) => ({
      id: lead._id.toString(),
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email ?? "",
      status: lead.status,
    }));

  return (
    <main className=" space-y-6">
      <div className="space-y-3">
        <Link
          href="/viewings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to viewings
        </Link>
        <PageHeader
          icon={<CalendarDays className="size-5" aria-hidden="true" />}
          title="Schedule a viewing"
          description="Arrange a property visit and assign an agent to the appointment."
        />
      </div>

      <ViewingForm
        properties={properties}
        agents={agentOptions}
        customers={customerOptions}
        leads={leadOptions}
      />
    </main>
  );
}
