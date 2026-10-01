
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

type Props = {
  sources: string[];
  agents: Option[];
  properties: Option[];
};

const inputClassName =
  "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

const labelClassName = "text-sm font-medium";

const sourceLabels: Record<string, string> = {
  website: "Website",
  referral: "Referral",
  social_media: "Social media",
  property_portal: "Property portal",
  walk_in: "Walk-in",
  phone: "Phone",
  email: "Email",
  other: "Other",
};

export default function LeadForm({ sources, agents, properties }: Props) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState(sources[0] ?? "website");
  const [assignedAgentId, setAssignedAgentId] = useState("");
  const [interestedPropertyIds, setInterestedPropertyIds] = useState<
    string[]
  >([]);
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleProperty(propertyId: string) {
    setInterestedPropertyIds((current) =>
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() && !phone.trim()) {
      setError("Enter at least an email address or phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          source,
          ...(assignedAgentId ? { assignedAgentId } : {}),
          interestedPropertyIds,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || result.success === false) {
        setError(
          result.message ??
            result.error ??
            "Unable to create the lead. Please check your details.",
        );
        return;
      }

      router.push("/leads");
      router.refresh();
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Contact information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the prospect’s name and at least one contact method.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClassName}>
              First name <span className="text-destructive">*</span>
            </label>
            <input
              id="firstName"
              required
              maxLength={100}
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={inputClassName}
              placeholder="e.g. Jane"
            />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClassName}>
              Last name <span className="text-destructive">*</span>
            </label>
            <input
              id="lastName"
              required
              maxLength={100}
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={inputClassName}
              placeholder="e.g. Wanjiku"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              type="tel"
              maxLength={30}
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClassName}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Lead details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Record how the prospect found Propora and assign responsibility.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="source" className={labelClassName}>
              Lead source <span className="text-destructive">*</span>
            </label>
            <select
              id="source"
              required
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className={inputClassName}
            >
              {sources.map((item) => (
                <option key={item} value={item}>
                  {sourceLabels[item] ?? item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assignedAgentId" className={labelClassName}>
              Assigned agent
            </label>
            <select
              id="assignedAgentId"
              value={assignedAgentId}
              onChange={(event) => setAssignedAgentId(event.target.value)}
              className={inputClassName}
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Property interests</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select any published properties the prospect is interested in.
          </p>
        </div>

        {properties.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No published properties are available to select.
          </p>
        ) : (
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-3">
            {properties.map((property) => (
              <label
                key={property.id}
                className="flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={interestedPropertyIds.includes(property.id)}
                  onChange={() => toggleProperty(property.id)}
                  disabled={
                    !interestedPropertyIds.includes(property.id) &&
                    interestedPropertyIds.length >= 50
                  }
                  className="mt-1 size-4 rounded border-input accent-primary"
                />
                <span className="text-sm">{property.label}</span>
              </label>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {interestedPropertyIds.length} of 50 properties selected
        </p>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-2">
        <label htmlFor="notes" className={labelClassName}>
          Notes
        </label>
        <textarea
          id="notes"
          rows={5}
          maxLength={5000}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={inputClassName}
          placeholder="Requirements, budget, preferred locations, or follow-up notes..."
        />
        <p className="text-xs text-muted-foreground">
          {notes.length}/5000 characters
        </p>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/leads"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating lead..." : "Create lead"}
        </button>
      </div>
    </form>
  );
}