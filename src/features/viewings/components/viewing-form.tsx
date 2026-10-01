"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PropertyOption = {
  id: string;
  title: string;
  location: string;
  currency: string;
  price: number;
  listingType: string;
};

type AgentOption = {
  id: string;
  name: string;
};

type ParticipantOption = {
  id: string;
  name: string;
  email: string;
};

type LeadOption = ParticipantOption & {
  status: string;
};

type ViewingFormProps = {
  properties: PropertyOption[];
  agents: AgentOption[];
  customers: ParticipantOption[];
  leads: LeadOption[];
};

type ParticipantType = "customer" | "lead";

type ApiResponse = {
  success?: boolean;
  error?: {
    message?: string;
  };
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-KE")}`;
  }
}

const selectClassName =
  "mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span
            className="ml-1 text-destructive"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </Label>

      {children}
    </div>
  );
}

export function ViewingForm({
  properties,
  agents,
  customers,
  leads,
}: ViewingFormProps) {
  const router = useRouter();

  const [participantType, setParticipantType] =
    useState<ParticipantType>("customer");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const scheduledAtValue = String(
      formData.get("scheduledAt") ?? "",
    );
    const scheduledAt = new Date(scheduledAtValue);

    if (
      !scheduledAtValue ||
      Number.isNaN(scheduledAt.getTime()) ||
      scheduledAt.getTime() <= Date.now()
    ) {
      setErrorMessage("Choose a date and time in the future.");
      return;
    }

    const propertyId = String(formData.get("propertyId") ?? "");
    const agentId = String(formData.get("agentId") ?? "");
    const participantId = String(
      formData.get("participantId") ?? "",
    );

    if (!propertyId || !agentId || !participantId) {
      setErrorMessage(
        "Select a property, an agent, and a customer or lead.",
      );
      return;
    }

    const durationMinutes = Number(
      formData.get("durationMinutes"),
    );

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 15 ||
      durationMinutes > 480
    ) {
      setErrorMessage(
        "Duration must be between 15 minutes and 8 hours.",
      );
      return;
    }

    const payload = {
      propertyId,
      agentId,
      [participantType === "customer"
        ? "customerId"
        : "leadId"]: participantId,
      type: String(formData.get("type") ?? "physical"),
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes,
      notes: String(formData.get("notes") ?? "").trim(),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/viewings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error?.message ??
            "Unable to schedule this viewing. Please try again.",
        );
        return;
      }

      router.push("/viewings");
      router.refresh();
    } catch {
      setErrorMessage(
        "A network error occurred. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const participants =
    participantType === "customer" ? customers : leads;

  const noProperties = properties.length === 0;
  const noAgents = agents.length === 0;
  const noParticipants = participants.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Appointment details</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the property, appointment format, and schedule.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <Field
              label="Property"
              htmlFor="propertyId"
              required
            >
              <select
                id="propertyId"
                name="propertyId"
                required
                disabled={isSubmitting || noProperties}
                defaultValue=""
                className={selectClassName}
              >
                <option value="" disabled>
                  {noProperties
                    ? "No eligible properties available"
                    : "Select a property"}
                </option>

                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} — {property.location}
                    {" · "}
                    {formatPrice(property.price, property.currency)}
                    {" · "}
                    {formatLabel(property.listingType)}
                  </option>
                ))}
              </select>

              {noProperties && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Add an available property before scheduling a
                  viewing.
                </p>
              )}
            </Field>
          </div>

          <Field
            label="Viewing type"
            htmlFor="type"
            required
          >
            <select
              id="type"
              name="type"
              required
              defaultValue="physical"
              disabled={isSubmitting}
              className={selectClassName}
            >
              <option value="physical">
                In-person viewing
              </option>
              <option value="virtual">
                Virtual viewing
              </option>
            </select>
          </Field>

          <Field
            label="Duration"
            htmlFor="durationMinutes"
            required
          >
            <select
              id="durationMinutes"
              name="durationMinutes"
              required
              defaultValue="60"
              disabled={isSubmitting}
              className={selectClassName}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1 hour 30 minutes</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </Field>

          <div>
            <Label htmlFor="scheduledAt">
              Date and time
              <span
                className="ml-1 text-destructive"
                aria-hidden="true"
              >
                *
              </span>
            </Label>

            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              disabled={isSubmitting}
              min={new Date(Date.now() + 60_000)
                .toISOString()
                .slice(0, 16)}
              className="mt-2"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Select a future appointment time.
            </p>
          </div>

          <Field
            label="Assigned agent"
            htmlFor="agentId"
            required
          >
            <select
              id="agentId"
              name="agentId"
              required
              disabled={isSubmitting || noAgents}
              defaultValue=""
              className={selectClassName}
            >
              <option value="" disabled>
                {noAgents
                  ? "No active agents available"
                  : "Select an agent"}
              </option>

              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            {noAgents && (
              <p className="mt-2 text-xs text-muted-foreground">
                An active agent is required to schedule a
                viewing.
              </p>
            )}
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Participant</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Every viewing must be associated with a customer or
            a lead.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <fieldset>
            <legend className="text-sm font-medium">
              Participant type
            </legend>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["customer", "Existing customer"],
                  ["lead", "Prospective lead"],
                ] as const
              ).map(([value, label]) => {
                const selected = participantType === value;

                return (
                  <label
                    key={value}
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      "focus-within:ring-3 focus-within:ring-ring/50",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/40",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="participantType"
                      value={value}
                      checked={selected}
                      onChange={() =>
                        setParticipantType(value)
                      }
                      disabled={isSubmitting}
                      className="size-4 accent-primary"
                    />

                    <span className="text-sm font-medium">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Field
            label={
              participantType === "customer"
                ? "Customer"
                : "Lead"
            }
            htmlFor="participantId"
            required
          >
            <select
              key={participantType}
              id="participantId"
              name="participantId"
              required
              defaultValue=""
              disabled={isSubmitting || noParticipants}
              className={selectClassName}
            >
              <option value="" disabled>
                {noParticipants
                  ? `No ${
                      participantType === "customer"
                        ? "active customers"
                        : "eligible leads"
                    } available`
                  : `Select ${
                      participantType === "customer"
                        ? "a customer"
                        : "a lead"
                    }`}
              </option>

              {participants.map((participant) => (
                <option
                  key={participant.id}
                  value={participant.id}
                >
                  {participant.name}
                  {participant.email
                    ? ` — ${participant.email}`
                    : ""}
                </option>
              ))}
            </select>

            {noParticipants && (
              <p className="mt-2 text-xs text-muted-foreground">
                Create the {participantType} first, then return
                to schedule the viewing.
              </p>
            )}
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Additional information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add instructions or context for the assigned agent.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <Label htmlFor="notes">Notes</Label>

          <Textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={5000}
            disabled={isSubmitting}
            placeholder="Meeting instructions, access details, or special requests..."
            className="mt-2 min-h-32 resize-y"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Optional · maximum 5,000 characters.
          </p>
        </div>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />

          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
        >
          <Link href="/viewings">Cancel</Link>
          {/* Go back to viewings */}
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            noProperties ||
            noAgents ||
            noParticipants
          }
        >
          {isSubmitting ? (
            <LoaderCircle
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <CalendarDays aria-hidden="true" />
          )}

          {isSubmitting
            ? "Scheduling..."
            : "Schedule viewing"}
        </Button>
      </div>
    </form>
  );
}