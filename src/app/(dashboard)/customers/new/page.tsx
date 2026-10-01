"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "@/features/customers/types/customer";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType: (typeof CUSTOMER_TYPES)[number];
  status: (typeof CUSTOMER_STATUSES)[number];
  notes: string;
};

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  customerType: "buyer",
  status: "active",
  notes: "",
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function NewCustomerPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        contact: {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          ...(values.email.trim() ? { email: values.email.trim() } : {}),
          ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
        },
        customerType: values.customerType,
        status: values.status,
        ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
      };

      const response = await fetch("/api/v1/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? result.error ?? "Unable to create the customer.",
        );
      }

      const customerId = result.data?._id;

      if (customerId) {
        router.push(`/customers/${customerId}`);
      } else {
        router.push("/customers");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClassName = "mb-1.5 block text-sm font-medium";

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/customers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to customers
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Add customer
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a CRM contact to track property interests and customer
          relationships.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Contact information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the customer's basic contact details.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClassName}>
                First name <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                maxLength={100}
                value={values.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                className={inputClassName}
                placeholder="Jane"
              />
            </div>

            <div>
              <label htmlFor="lastName" className={labelClassName}>
                Last name <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                maxLength={100}
                value={values.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                className={inputClassName}
                placeholder="Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClassName}
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClassName}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className={inputClassName}
                placeholder="+254 700 000 000"
              />
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Customer classification</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Categorize the customer and set their initial status.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="customerType" className={labelClassName}>
                Customer type
              </label>
              <select
                id="customerType"
                name="customerType"
                value={values.customerType}
                onChange={(event) =>
                  updateField(
                    "customerType",
                    event.target.value as FormValues["customerType"],
                  )
                }
                className={inputClassName}
              >
                {CUSTOMER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {formatLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as FormValues["status"],
                  )
                }
                className={inputClassName}
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClassName}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              maxLength={5000}
              value={values.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className={inputClassName}
              placeholder="Property preferences, budget, requirements, or other useful context..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {values.notes.length}/5000 characters
            </p>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/customers"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating customer..." : "Create customer"}
          </button>
        </div>
      </form>
    </main>
  );
}
