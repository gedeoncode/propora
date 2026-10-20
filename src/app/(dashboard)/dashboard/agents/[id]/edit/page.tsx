import Link from "next/link";
import { redirect } from "next/navigation";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPECIALIZATIONS } from "@/features/agents/constants/constants";
import { agentService } from "@/features/agents/services/agent.service";
import { updateAgentSchema } from "@/features/agents/schemas/agent.schema";
import { requireRole } from "@/lib/auth/guards";

const inputClassName =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";

function getText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getOptionalText(formData: FormData, name: string) {
  const value = getText(formData, name);

  return value === "" ? undefined : value;
}

async function updateAgentAction(agentId: string, formData: FormData) {
  "use server";

  const user = await requireRole(["admin", "manager"]);

  const rawInput = {
    firstName: getText(formData, "firstName"),
    lastName: getText(formData, "lastName"),
    phone: getOptionalText(formData, "phone"),
    bio: getOptionalText(formData, "bio"),
    licenseNumber: getOptionalText(formData, "licenseNumber"),
    specializations: formData
      .getAll("specializations")
      .map((value) => String(value).trim())
      .filter(Boolean),
  };

  const parsed = updateAgentSchema.safeParse(rawInput);

  if (!parsed.success) {
    throw new Error("Please correct the agent details and try again.");
  }

  await agentService.update(agentId, parsed.data);

  redirect(`/dashboard/agents/${agentId}`);
}

type EditAgentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;

  await requireRole(["admin", "manager", "staff"]);

  const agent = await agentService.getById(id);

  if (!agent) {
    redirect("/dashboard/agents");
  }

  const updateAction = updateAgentAction.bind(null, id);

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <Link
          href={`/dashboard/agents/${id}`}
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Back to agent
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Edit agent</h1>

        <p className="text-sm text-muted-foreground">
          Update the agent information below.
        </p>
      </div>

      <form action={updateAction} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <div>
            <h2 className="text-base font-semibold">Professional profile</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the agent&apos;s profile information.
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
                  defaultValue={agent.userId.firstName}
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
                  defaultValue={agent.userId.lastName}
                  required
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={agent.userId.phone ?? ""}
                  className={inputClassName}
                />
              </div>

              <div>
                <Label htmlFor="licenseNumber">License number</Label>

                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  defaultValue={agent.licenseNumber ?? ""}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div>
            <h2 className="text-base font-semibold">Profile details</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add information that will appear on the agent&apos;s professional
              profile.
            </p>
          </div>

          <div className="mt-5 grid gap-5">
            <div>
              <Label htmlFor="bio">Bio</Label>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={2000}
                defaultValue={agent.bio ?? ""}
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
                {SPECIALIZATIONS.map((specialization) => {
                  const checked =
                    agent.specializations?.includes(specialization.value) ??
                    false;

                  return (
                    <label
                      key={specialization.value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        name="specializations"
                        value={specialization.value}
                        defaultChecked={checked}
                        className="size-4 accent-[var(--primary)]"
                      />

                      <span>{specialization.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            render={<Link href={`/dashboard/agents/${id}`}>Cancel</Link>}
          />

          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </main>
  );
}
