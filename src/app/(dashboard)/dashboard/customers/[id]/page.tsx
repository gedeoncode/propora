import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { customerService } from "@/features/customers/services/customer.service";
import { requireRole } from "@/lib/auth/guards";
type CustomerDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="wrap-break-words text-sm font-medium">
        {children || "Not provided"}
      </dd>
    </div>
  );
}

export default async function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  await requireRole(["admin", "manager", "staff"]);


  const { id } = await params;

  let customer;

  try {
    customer = await customerService.getById(id);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "NOT_FOUND"
    ) {
      notFound();
    }

    throw error;
  }

  const customerId = customer._id.toString();

  const customerName =
    `${customer.firstName} ${customer.lastName}`.trim() || "Customer";

  const assignedAgentName = customer.assignedAgent
    ? `${customer.assignedAgent.firstName} ${customer.assignedAgent.lastName}`.trim()
    : null;

  const sourceLeadName = customer.sourceLead
    ? `${customer.sourceLead.firstName} ${customer.sourceLead.lastName}`.trim()
    : null;

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title={customerName}
        description="Customer profile and CRM information."
        action={
          <Link
            href={`/customers/${customerId}/edit`}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Edit customer
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={customer.status} />

        <span className="text-sm text-muted-foreground">
          {customer.customerType}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6 lg:col-span-2">
          <div>
            <h2 className="font-semibold">Contact information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Customer identity and communication details.
            </p>
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailItem label="First name">
              {customer.firstName}
            </DetailItem>

            <DetailItem label="Last name">
              {customer.lastName}
            </DetailItem>

            <DetailItem label="Email address">
              {customer.email ? (
                <a
                  href={`mailto:${customer.email}`}
                  className="text-primary hover:underline"
                >
                  {customer.email}
                </a>
              ) : null}
            </DetailItem>

            <DetailItem label="Phone number">
              {customer.phone ? (
                <a
                  href={`tel:${customer.phone}`}
                  className="text-primary hover:underline"
                >
                  {customer.phone}
                </a>
              ) : null}
            </DetailItem>

            <DetailItem label="Customer type">
              {customer.customerType}
            </DetailItem>

            <DetailItem label="Account status">
              {customer.status}
            </DetailItem>
          </dl>
        </section>

        <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">CRM assignment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ownership and customer origin.
            </p>
          </div>

          <dl className="space-y-5">
            <DetailItem label="Assigned agent">
              {assignedAgentName ? (
                <div className="space-y-0.5">
                  <p>{assignedAgentName}</p>

                  {customer.assignedAgent?.email ? (
                    <a
                      href={`mailto:${customer.assignedAgent.email}`}
                      className="text-xs font-normal text-muted-foreground hover:text-foreground"
                    >
                      {customer.assignedAgent.email}
                    </a>
                  ) : null}
                </div>
              ) : (
                "Unassigned"
              )}
            </DetailItem>

            <DetailItem label="Source lead">
              {sourceLeadName ? (
                <div className="space-y-0.5">
                  <p>{sourceLeadName}</p>

                  {customer.sourceLead?.email ? (
                    <a
                      href={`mailto:${customer.sourceLead.email}`}
                      className="text-xs font-normal text-muted-foreground hover:text-foreground"
                    >
                      {customer.sourceLead.email}
                    </a>
                  ) : null}
                </div>
              ) : (
                "No source lead"
              )}
            </DetailItem>

            <DetailItem label="Created">
              {new Date(customer.createdAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DetailItem>

            <DetailItem label="Last updated">
              {new Date(customer.updatedAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DetailItem>
          </dl>
        </section>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Notes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Internal notes about the customer's requirements and preferences.
          </p>
        </div>

        {customer.notes?.trim() ? (
          <p className="whitespace-pre-wrap text-sm leading-6">
            {customer.notes}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No notes have been added yet.
          </p>
        )}
      </section>
    </main>
  );
}