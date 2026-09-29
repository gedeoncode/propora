import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPECIALIZATIONS } from "@/features/agents/constants/constants";
import { createAgentSchema } from "@/features/agents/schemas/agent.schema";
import { agentService } from "@/features/agents/services/agent.service";
import { requireRole } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/mongoose";

const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function getText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getOptionalText(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value === "" ? undefined : value;
}

async function createAgentAction(formData: FormData) {
  "use server";

  const user = await requireRole(["admin", "staff"]);

  await connectToDatabase();

  const rawInput = {
    firstName: getText(formData, "firstName"),
    lastName: getText(formData, "lastName"),
    email: getText(formData, "email"),
    password: getText(formData, "password"),
    phone: getOptionalText(formData, "phone"),
    bio: getOptionalText(formData, "bio"),
    licenseNumber: getOptionalText(formData, "licenseNumber"),
    specializations: formData
      .getAll("specializations")
      .map((value) => String(value).trim())
      .filter(Boolean),
  };

  const parsed = createAgentSchema.safeParse(rawInput);

  if (!parsed.success) {
    throw new Error("Please correct the agent details and try again.");
  }

  const agent = await agentService.create(parsed.data, user.id);

  redirect(`/agents/${agent._id.toString()}`);
}

export default async function NewAgentPage() {
  await requireRole(["admin", "staff"]);

  return (
    <main className=" space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" aria-hidden="true" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Create agent
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Create the agent&apos;s account and professional profile together.
          </p>
        </div>
        <Link
          href="/agents"
          aria-label="Back to agents"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to agents
        </Link>
      </div>

      <form action={createAgentAction} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <div>
            <h2 className="text-base font-semibold">Account information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              These details are used to create the agent&apos;s login account.
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>

                <Input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last name</Label>

                <Input
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="agent@example.com"
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <Label htmlFor="password">Temporary password</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={inputClassName}
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Minimum 8 characters.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div>
            <h2 className="text-base font-semibold">Professional profile</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              These details belong to the agent profile.
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClassName}
                />
              </div>

              <div>
                <Label htmlFor="licenseNumber">License number</Label>

                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={2000}
                className={inputClassName}
                placeholder="Brief professional biography..."
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Maximum 2,000 characters.
              </p>
            </div>

            <div>
              <div>
                <Label>Specializations</Label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select all areas that apply.
                </p>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {SPECIALIZATIONS.map((specialization) => (
                  <label
                    key={specialization.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      name="specializations"
                      value={specialization.value}
                      className="size-4 accent-[var(--primary)]"
                    />

                    <span>{specialization.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/agents">Cancel</Link>}
          />

          <Button type="submit">Create agent</Button>
        </div>
      </form>
    </main>
  );
}
