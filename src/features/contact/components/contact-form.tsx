
"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const subjectOptions = [
  { value: "general", label: "General inquiry" },
  { value: "property", label: "Finding a property" },
  { value: "listing", label: "Listing a property" },
  { value: "agents", label: "Agent or agency inquiry" },
  { value: "support", label: "Technical support" },
  { value: "other", label: "Something else" },
] as const;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/v1/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.error?.message ??
            "We couldn't send your message. Please review your details and try again.",
        );
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError(
        "We couldn't connect to the server. Please check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight">
          Message received
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thank you for contacting Propora. Your message has been submitted.
          Our team can follow up using the contact details you provided.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={pending}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-first-name"
            className="block text-sm font-medium"
          >
            First name <span className="text-destructive">*</span>
          </label>

          <input
            id="contact-first-name"
            name="firstName"
            autoComplete="given-name"
            required
            maxLength={100}
            disabled={pending}
            placeholder="Your first name"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-last-name"
            className="block text-sm font-medium"
          >
            Last name <span className="text-destructive">*</span>
          </label>

          <input
            id="contact-last-name"
            name="lastName"
            autoComplete="family-name"
            required
            maxLength={100}
            disabled={pending}
            placeholder="Your last name"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium"
          >
            Email address <span className="text-destructive">*</span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            disabled={pending}
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-phone"
            className="block text-sm font-medium"
          >
            Phone number{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>

          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            disabled={pending}
            placeholder="+254 7XX XXX XXX"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium"
        >
          What can we help you with?{" "}
          <span className="text-destructive">*</span>
        </label>

        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          disabled={pending}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="" disabled>
            Select a subject
          </option>

          {subjectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium"
        >
          Your message <span className="text-destructive">*</span>
        </label>

        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          disabled={pending}
          placeholder="Tell us a little about what you need help with..."
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />

        <p className="text-xs leading-5 text-muted-foreground">
          Please include enough detail for our team to understand your request.
        </p>
      </div>

      {/* Honeypot: ordinary visitors should never see or fill this field. */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p className="leading-6">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full gap-2 sm:w-auto sm:min-w-44"
      >
        {pending ? (
          <>
            <LoaderCircle
              className="size-4 animate-spin"
              aria-hidden="true"
            />
            Sending message...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Send message
          </>
        )}
      </Button>

      <p className="text-xs leading-5 text-muted-foreground">
        Your contact details will be used to respond to your inquiry.
      </p>
    </form>
  );
}