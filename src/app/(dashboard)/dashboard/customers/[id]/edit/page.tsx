
"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CUSTOMER_TYPES,
  type CustomerType,
} from "@/features/customers/types/customer";

type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  notes: string;
};

type CustomerResponse = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  customerType: CustomerType;
  notes?: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const initialForm: CustomerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  customerType: "buyer",
  notes: "",
};

const inputClassName =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

export default function EditCustomerPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState<CustomerFormData>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/v1/customers/${id}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            getErrorMessage(payload, "Unable to load customer."),
          );
        }

        const customer = payload.data as CustomerResponse;

        if (cancelled) return;

        setForm({
          firstName: customer.firstName ?? "",
          lastName: customer.lastName ?? "",
          email: customer.email ?? "",
          phone: customer.phone ?? "",
          customerType: customer.customerType,
          notes: customer.notes ?? "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load customer.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateField<K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/v1/customers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim() || undefined,
            phone: form.phone.trim() || undefined,
          },
          customerType: form.customerType,
          notes: form.notes.trim() || undefined,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          getErrorMessage(payload, "Unable to update customer."),
        );
      }

      router.push(`/customers/${id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading customer...
      </div>
    );
  }

  if (error && !form.firstName && !form.lastName) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-destructive">{error}</p>
        <Link
          href="/customers"
          className="text-sm font-medium underline underline-offset-4"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="space-y-2">
        <Link
          href={`/customers/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to customer
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">
          Edit customer
        </h1>

        <p className="text-sm text-muted-foreground">
          Update the customer&apos;s contact details and CRM information.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4 rounded-lg border p-5">
          <h2 className="font-medium">Contact information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              First name
              <input
                className={inputClassName}
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                required
                maxLength={100}
                autoComplete="given-name"
              />
            </label>

            <label className="block text-sm font-medium">
              Last name
              <input
                className={inputClassName}
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                required
                maxLength={100}
                autoComplete="family-name"
              />
            </label>

            <label className="block text-sm font-medium">
              Email address
              <input
                type="email"
                className={inputClassName}
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                maxLength={254}
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-medium">
              Phone number
              <input
                type="tel"
                className={inputClassName}
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                maxLength={30}
                autoComplete="tel"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-5">
          <h2 className="font-medium">Customer details</h2>

          <label className="block text-sm font-medium">
            Customer type
            <select
              className={inputClassName}
              value={form.customerType}
              onChange={(event) =>
                updateField(
                  "customerType",
                  event.target.value as CustomerType,
                )
              }
              required
            >
              {CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Notes
            <textarea
              className={inputClassName}
              value={form.notes}
              onChange={(event) =>
                updateField("notes", event.target.value)
              }
              rows={5}
              maxLength={5000}
              placeholder="Add relevant customer information..."
            />
          </label>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href={`/customers/${id}`}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}