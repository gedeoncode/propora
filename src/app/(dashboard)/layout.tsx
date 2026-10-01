import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { requireAuth } from "@/lib/auth/guards";
import { DashboardAccountMenu } from "@/features/dashboard/components/dashboard-account-menu";
import { MobileDashboardNavigation } from "@/features/dashboard/components/mobile-dashboard-navigation";
import { DashboardHeaderContext } from "@/features/dashboard/components/dashboard-header-context";

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await requireAuth();

  const displayName = session.user.name ?? "Propora user";
  const roleLabel = formatRole(user.role);

  async function signOutAction() {
    "use server";

    await signOut({
      redirectTo: "/login",
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <DashboardSidebar displayName={displayName} roleLabel={roleLabel} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <MobileDashboardNavigation
                  displayName={displayName}
                  roleLabel={roleLabel}
                />

                <DashboardHeaderContext />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <ThemeToggle />

                <div
                  className="hidden h-6 w-px bg-border sm:block"
                  aria-hidden="true"
                />

                <DashboardAccountMenu
                  displayName={displayName}
                  roleLabel={roleLabel}
                  signOutAction={signOutAction}
                />
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-400">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
