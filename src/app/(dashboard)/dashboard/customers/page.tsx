import Link from "next/link";

import { customerService } from "@/features/customers/services/customer.service";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";
import { requireRole } from "@/lib/auth/guards";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

type SearchParams = {
  status?: string;
  customerType?: string;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getCustomerStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "success" as const;

    case "inactive":
      return "neutral" as const;

    case "prospect":
      return "info" as const;

    default:
      return "neutral" as const;
  }
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireRole(["admin", "manager", "staff", "agent"]);

  const params = await searchParams;

  const status = CUSTOMER_STATUSES.includes(
    params.status as (typeof CUSTOMER_STATUSES)[number],
  )
    ? (params.status as (typeof CUSTOMER_STATUSES)[number])
    : undefined;

  const customerType = CUSTOMER_TYPES.includes(
    params.customerType as (typeof CUSTOMER_TYPES)[number],
  )
    ? (params.customerType as (typeof CUSTOMER_TYPES)[number])
    : undefined;

  const customers = await customerService.list({
    status,
    customerType,
  });

  const hasFilters = Boolean(status || customerType);

  return (
    <main className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer profiles, preferences, and relationships."
        action={{
          href: "/dashboard/customers/new",
          label: "Add customer",
        }}
      />
 
      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card">
          <form
            action="/dashboard/customers"
            method="GET"
            className="flex flex-col gap-4 p-4 sm:p-5"
          >
            <div>
              <h2 className="text-sm font-semibold">Filter customers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Narrow the directory by customer status or type.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={status ?? ""}
                  className={selectClassName}
                >
                  <option value="">All statuses</option>

                  {CUSTOMER_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="customerType"
                  className="text-sm font-medium"
                >
                  Customer type
                </label>

                <select
                  id="customerType"
                  name="customerType"
                  defaultValue={customerType ?? ""}
                  className={selectClassName}
                >
                  <option value="">All types</option>

                  {CUSTOMER_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
              {hasFilters ? (
                <Link
                  href="/customers"
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
          </form>
        </div>

      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold">Customer directory</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {customers.length === 0
                ? "No customers found"
                : `${customers.length} ${
                    customers.length === 1 ? "customer" : "customers"
                  } ${
                    hasFilters
                      ? "match your filters"
                      : "in your directory"
                  }`}
            </p>
          </div>

          {hasFilters ? (
            <Link
              href="/customers"
              className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              View all customers
            </Link>
          ) : null}
        </div>

        {customers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-sm font-semibold">
              {hasFilters
                ? "No customers match these filters"
                : "No customers yet"}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {hasFilters
                ? "Try broadening your filters or clear them to view the full customer directory."
                : "Add your first customer to start building your customer relationships."}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {hasFilters ? (
                <Link
                  href="/customers"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Clear filters
                </Link>
              ) : null}

              <Link
                href="/customers/new"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Add customer
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">
                    Assigned agent
                  </th>
                  <th className="w-20 px-4 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => {
                  const id = customer.userId.toString();

                  return (
                    <tr
                      key={id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/customers/${id}`}
                          className="font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {customer.firstName} {customer.lastName}
                        </Link>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Added{" "}
                          {new Date(
                            customer.createdAt,
                          ).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          {customer.email || (
                            <span className="text-muted-foreground">
                              No email
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {customer.phone || "No phone"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-muted-foreground">
                          {formatLabel(customer.customerType)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge
                          variant={getCustomerStatusVariant(
                            customer.status,
                          )}
                        >
                          {formatLabel(customer.status)}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4">
                        {customer.assignedAgentId ? (
                          <span className="font-medium">
                            {customer.assignedAgentId.toString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/customers/${id}`}
                          className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}