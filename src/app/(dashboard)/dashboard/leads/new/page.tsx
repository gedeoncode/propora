import Link from "next/link";

import { agentService } from "@/features/agents/services/agent.service";
import { propertyService } from "@/features/properties/services/property.service";
import { LEAD_SOURCES } from "@/features/leads/types/lead";
import { requireRole } from "@/lib/auth/guards";

import LeadForm from "@/features/leads/components/lead-form";
import { logger } from "@/lib/logger";
import { ArrowLeft, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

export default async function NewLeadPage() {
  await requireRole([...ALLOWED_ROLES]);

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
  logger.info(
    `Fetched ${agentOptions.length} agents and ${properties.items.length} properties for lead form options.`,
  );

  return (
    <div className=" space-y-6">
      <div className="space-y-3">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Leads
        </Link>
        
        <PageHeader
          icon={<User className="size-5" aria-hidden="true" />}
          title="Add Lead"
          description="Record a new prospect and capture their property interests."
        />
      </div>

      <LeadForm
        sources={[...LEAD_SOURCES]}
        agents={agentOptions}
        properties={propertyOptions}
      />
    </div>
  );
}
