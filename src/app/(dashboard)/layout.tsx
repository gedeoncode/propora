import type { ReactNode } from "react";



import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  Users,
  UserRoundSearch,
} from "lucide-react";
 

import { auth } from "@/auth";
import { requireAuth } from "@/lib/auth/guards";

const primaryNavigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
] as const;

const moduleNavigation = [
  { label: "Properties", icon: Building2 },
  { label: "Leads", icon: UserRoundSearch },
  { label: "Customers", icon: Users },
  { label: "Viewings", icon: CalendarDays },
] as const;

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

   return (

    <div className="min-h-screen bg-background text-foreground">
       <div className="flex min-h-screen">

        <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-sidebar-border px-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <span>Propora</span>
            </Link>
          </div>

          <nav
            aria-label="Dashboard navigation"
            className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
          >
            <div>
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>

              <div className="space-y-1">
                {primaryNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2.5 text-sm font-medium text-sidebar-accent-foreground"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Modules
              </p>

              <div className="space-y-1">
                {moduleNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-md px-2 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <CircleUserRound className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
           </div>
         </aside>
 
         <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <details className="relative md:hidden">
                  <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted [&::-webkit-details-marker]:hidden">
                    <ChevronDown className="size-4" aria-hidden="true" />
                    <span className="sr-only">Open navigation</span>
                  </summary>

                  <div className="absolute left-0 top-11 z-30 w-64 rounded-lg border border-border bg-card p-2 shadow-lg">
                    <nav aria-label="Mobile dashboard navigation" className="space-y-1">
                      {primaryNavigation.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground"
                          >
                            <Icon className="size-4" aria-hidden="true" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </details>

                <div>
                  <p className="text-sm font-medium">Dashboard</p>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Propora workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <CircleUserRound className="size-4" aria-hidden="true" />
                </span>
              </div>
            </div>
           </header>

           <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
         </div>
       </div>
     </div>
   );
}

                         