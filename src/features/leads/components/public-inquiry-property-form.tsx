
"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type PublicPropertyInquiryFormProps = {
  slug: string;
};

export function PublicPropertyInquiryForm({
  slug,
}: PublicPropertyInquiryFormProps) {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    setPending(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      slug,
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/v1/public/property-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.error?.message ??
            "We couldn't send your inquiry. Please try again.",
        );
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError(
        "We couldn't connect to the server. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
      >
        <CheckCircle2
          className="size-5 text-emerald-600"
          aria-hidden="true"
        />
        <p className="mt-2 font-semibold">Inquiry received</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Thank you for your interest. The agency can follow up using
          the contact details you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="inquiry-first-name"
            className="mb-1.5 block text-sm font-medium"
          >
            First name
          </label>
          <input
            id="inquiry-first-name"
            name="firstName"
            autoComplete="given-name"
            required
            maxLength={100}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label
            htmlFor="inquiry-last-name"
            className="mb-1.5 block text-sm font-medium"
          >
            Last name
          </label>
          <input
            id="inquiry-last-name"
            name="lastName"
            autoComplete="family-name"
            required
            maxLength={100}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="inquiry-email"
          className="mb-1.5 block text-sm font-medium"
        >
          Email address
        </label>
        <input
          id="inquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="inquiry-phone"
          className="mb-1.5 block text-sm font-medium"
        >
          Phone number
        </label>
        <input
          id="inquiry-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="+254..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Provide an email address or phone number.
        </p>
      </div>

      <div>
        <label
          htmlFor="inquiry-message"
          className="mb-1.5 block text-sm font-medium"
        >
          Message <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="I'd like to know more about this property..."
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Honeypot field for basic automated-spam detection. */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Sending inquiry..." : "Send inquiry"}
      </button>

      <p className="text-xs leading-5 text-muted-foreground">
        Your details will be shared with the agency so they can respond
        to your inquiry.
      </p>
    </form>
  );
}