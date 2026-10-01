"use client";

import { cn } from "cn";
import { primaryNavigation, moduleNavigation } from "../constants/navigation";
import { NavigationLink } from "./navigation-link";

export function DashboardNavigation({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  return (
    <nav
      aria-label="Dashboard navigation"
      className={cn(
        "flex-1 space-y-6 overflow-y-auto py-5",
        collapsed ? "px-2" : "px-3",
      )}
    >
      <div>
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
        )}

        <div className="space-y-1">
          {primaryNavigation.map((item) => (
            <NavigationLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>

      <div>
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            CRM
          </p>
        )}

        <div className="space-y-1">
          {moduleNavigation.map((item) => (
            <NavigationLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>
      </div>
    </nav>
  );
}
