
import Link from "next/link";

import { agentService } from "@/features/agents/services/agent.service";
import { propertyService } from "@/features/properties/services/property.service";
import { LEAD_SOURCES } from "@/features/leads/types/lead";
import { connectToDatabase } from "@/lib/db/mongoose";
import { requireRole } from "@/lib/auth/guards";

import LeadForm from "@/features/leads/components/lead-form";
import { logger } from "@/lib/logger";

const ALLOWED_ROLES = ["admin", "manager", "agent", "staff"] as const;

export default async function NewLeadPage() {
  await requireRole([...ALLOWED_ROLES]);
  await connectToDatabase();

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
  logger.info(`Fetched ${agentOptions.length} agents and ${properties.items.length} properties for lead form options.`,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <Link
          href="/leads"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to leads
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add lead
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record a new prospect and capture their property interests.
          </p>
        </div>
      </div>

      <LeadForm
        sources={[...LEAD_SOURCES]}
        agents={agentOptions}
        properties={propertyOptions}
      />
    </div>
  );
}