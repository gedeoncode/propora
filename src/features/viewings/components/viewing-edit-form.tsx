"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

type ViewingData = {
  id: string;
  propertyId: string;
  agentId: string;
  customerId: string;
  leadId: string;
  type: string;
  scheduledAt: string;
  durationMinutes: number;
  notes: string;
};

type Props = {
  viewing: ViewingData;
  properties: Option[];
  agents: Option[];
  customers: Option[];
  leads: Option[];
  viewingTypes: string[];
};

function toLocalDateTime(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const inputClassName =
  "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

const labelClassName = "text-sm font-medium";

export default function ViewingEditForm({
  viewing,
  properties,
  agents,
  customers,
  leads,
  viewingTypes,
}: Props) {
  const router = useRouter();

  const [propertyId, setPropertyId] = useState(viewing.propertyId);
  const [agentId, setAgentId] = useState(viewing.agentId);
  const [customerId, setCustomerId] = useState(viewing.customerId);
  const [leadId, setLeadId] = useState(viewing.leadId);
  const [type, setType] = useState(viewing.type);
  const [scheduledAt, setScheduledAt] = useState(() =>
    toLocalDateTime(viewing.scheduledAt),
  );
  const [durationMinutes, setDurationMinutes] = useState(
    String(viewing.durationMinutes),
  );
  const [notes, setNotes] = useState(viewing.notes);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!customerId && !leadId) {
      setError("Select a customer or a lead for this viewing.");
      return;
    }

    if (customerId && leadId) {
      setError("Select either a customer or a lead, not both.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/v1/viewings/${viewing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          agentId,
          customerId: customerId || undefined,
          leadId: leadId || undefined,
          type,
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMinutes: Number(durationMinutes),
          notes: notes.trim() || undefined,
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
            "Unable to update the viewing. Please try again.",
        );
        return;
      }

      router.push(`/viewings/${viewing.id}`);
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
      className="space-y-6 rounded-xl border border-border bg-card p-5 sm:p-7"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="propertyId" className={labelClassName}>
            Property <span className="text-destructive">*</span>
          </label>
          <select
            id="propertyId"
            required
            value={propertyId}
            onChange={(event) => setPropertyId(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="agentId" className={labelClassName}>
            Assigned agent <span className="text-destructive">*</span>
          </label>
          <select
            id="agentId"
            required
            value={agentId}
            onChange={(event) => setAgentId(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="participantType" className={labelClassName}>
            Participant <span className="text-destructive">*</span>
          </label>
          <select
            id="participantType"
            value={customerId ? "customer" : "lead"}
            onChange={(event) => {
              if (event.target.value === "customer") {
                setLeadId("");
              } else {
                setCustomerId("");
              }
            }}
            className={inputClassName}
          >
            <option value="customer">Existing customer</option>
            <option value="lead">Existing lead</option>
          </select>
        </div>

        <div>
          {customerId || (!customerId && !leadId) ? (
            <>
              <label htmlFor="customerId" className={labelClassName}>
                Customer <span className="text-destructive">*</span>
              </label>
              <select
                id="customerId"
                required={!leadId}
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className={inputClassName}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.label}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label htmlFor="leadId" className={labelClassName}>
                Lead <span className="text-destructive">*</span>
              </label>
              <select
                id="leadId"
                required={!customerId}
                value={leadId}
                onChange={(event) => setLeadId(event.target.value)}
                className={inputClassName}
              >
                <option value="">Select a lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div>
          <label htmlFor="type" className={labelClassName}>
            Viewing type <span className="text-destructive">*</span>
          </label>
          <select
            id="type"
            required
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={inputClassName}
          >
            {viewingTypes.map((viewingType) => (
              <option key={viewingType} value={viewingType}>
                {viewingType === "physical" ? "In person" : "Virtual"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="durationMinutes" className={labelClassName}>
            Duration <span className="text-destructive">*</span>
          </label>
          <select
            id="durationMinutes"
            required
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            className={inputClassName}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 minutes</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
            <option value="240">4 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="scheduledAt" className={labelClassName}>
            Date and time <span className="text-destructive">*</span>
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClassName}>
            Notes
          </label>
          <textarea
            id="notes"
            rows={5}
            maxLength={5000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add instructions or other details..."
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {notes.length}/5000 characters
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Link
          href={`/viewings/${viewing.id}`}
          className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}