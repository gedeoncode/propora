import Link from "next/link";

import { requireRole } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";
import { agentService } from "@/features/agents/services/agent.service";
import {
  AGENT_SPECIALIZATIONS,
  AGENT_STATUSES,
} from "@/features/agents/types/agent";

type SearchParams = {
  status?: string;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClassName(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-700";
    case "inactive":
      return "bg-muted text-muted-foreground";
    case "suspended":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole(["admin", "manager", "staff"]);

  await connectToDatabase();

  const params = await searchParams;

  const status = AGENT_STATUSES.includes(
    params.status as (typeof AGENT_STATUSES)[number],
  )
    ? (params.status as (typeof AGENT_STATUSES)[number])
    : undefined;

  const agents = await agentService.list(status);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Agents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the professional agent profiles connected to Propora
            accounts.
          </p>
        </div>

        <Link
          href="/agents/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add agent
        </Link>
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold">
              Agent directory
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {agents.length}{" "}
              {agents.length === 1 ? "agent" : "agents"}
              {status ? ` · ${formatLabel(status)}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/agents"
              className={`rounded-md border px-3 py-2 text-xs font-medium ${
                !status
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              All
            </Link>

            {AGENT_STATUSES.map((agentStatus) => (
              <Link
                key={agentStatus}
                href={`/agents?status=${agentStatus}`}
                className={`rounded-md border px-3 py-2 text-xs font-medium ${
                  status === agentStatus
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {formatLabel(agentStatus)}
              </Link>
            ))}
          </div>
        </div>

        {agents.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-sm font-semibold">
              No agents found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no agent profiles matching the selected
              status.
            </p>

            <Link
              href="/agents/new"
              className="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Add the first agent
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">
                    Agent
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Contact
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Specializations
                  </th>
                  <th className="px-4 py-3 font-medium">
                    License
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr
                    key={agent._id.toString()}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <Link
                          href={`/agents/${agent._id.toString()}`}
                          className="font-medium hover:text-primary"
                        >
                          {agent.userId.firstName} {agent.userId.lastName}
                        </Link>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Agent profile
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {agent.phone ? (
                        <span>{agent.phone}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          No phone
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex max-w-[260px] flex-wrap gap-1.5">
                        {agent.specializations.length > 0 ? (
                          agent.specializations.map(
                            (specialization) => (
                              <span
                                key={specialization}
                                className="rounded-full bg-muted px-2 py-1 text-xs"
                              >
                                {formatLabel(specialization)}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {agent.licenseNumber ? (
                        <span>{agent.licenseNumber}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                          agent.status,
                        )}`}
                      >
                        {formatLabel(agent.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/agents/${agent._id.toString()}`}
                        className="font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}