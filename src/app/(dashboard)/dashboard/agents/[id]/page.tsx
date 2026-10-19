import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { agentService } from "@/features/agents/services/agent.service";
import { logger } from "@/lib/logger";

type AgentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
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

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(value);
}

export default async function AgentDetailPage({
  params,
}: AgentDetailPageProps) {
  await requireRole(["admin", "manager", "staff"]);

  const { id } = await params;
  const agent = await agentService.getById(id);
  logger.info("AgentDetailPage", { agent });

  if (!agent) {
    notFound();
  }

  return (
    <main className="space-y-6">
       <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/agents"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to agents
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            {agent.userId.firstName} {agent.userId.lastName}
          </h1>

          <p className="text-sm text-muted-foreground">
            {agent.userId.email}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/agents/${agent._id}/edit`}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Edit agent
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl font-semibold">
              {agent.profileImageUrl ? (
                <img
                  src={agent.profileImageUrl}
                  alt={`${agent.userId.firstName} ${agent.userId.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                `${agent.userId.firstName.charAt(0)}${agent.userId.lastName.charAt(0)}`
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold">
                  {agent.userId.firstName} {agent.userId.lastName}
                </h2>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                    agent.status,
                  )}`}
                >
                  {formatLabel(agent.status)}
                </span>
              </div>

              {agent.bio ? (
                <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {agent.bio}
                </p>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  No biography has been added.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Contact</h2>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd className="mt-1">
                {agent.phone ?? (
                  <span className="text-muted-foreground">
                    Not provided
                  </span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-muted-foreground">
                License number
              </dt>
              <dd className="mt-1">
                {agent.licenseNumber ?? (
                  <span className="text-muted-foreground">
                    Not provided
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">
            Specializations
          </h2>

          {agent.specializations.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.specializations.map((specialization) => (
                <span
                  key={specialization}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
                >
                  {formatLabel(specialization)}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No specializations have been added.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Record</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">
                Created
              </dt>
              <dd className="mt-1">
                {formatDate(agent.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-muted-foreground">
                Last updated
              </dt>
              <dd className="mt-1">
                {formatDate(agent.updatedAt)}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">
                Linked user ID
              </dt>
              <dd className="mt-1 break-all font-mono text-xs">
                {agent.userId.toString()}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}