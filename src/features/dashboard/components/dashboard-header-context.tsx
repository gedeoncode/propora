"use client";
import { usePathname } from "next/navigation";
import { allNavigation, NavigationItem } from "../constants/navigation";
import { isActivePath } from "../utils/is-active-path";

const navigationDescriptions: Record<NavigationItem["href"], string> = {
  "/dashboard": "Real-estate operations",
  "/properties": "Listings and inventory",
  "/leads": "Prospects and pipeline",
  "/customers": "Customer relationships",
  "/viewings": "Appointments and scheduling",
  "/agents": "Team and assignments",
};

export function DashboardHeaderContext() {
  const pathname = usePathname();

  const currentItem = allNavigation.find((item) =>
    isActivePath(pathname, item.href),
  );

  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">
        {currentItem?.label ?? "Workspace"}
      </p>

      <p className="hidden truncate text-xs text-muted-foreground sm:block">
        {currentItem
          ? navigationDescriptions[currentItem.href]
          : "Manage your real estate operations"}
      </p>
    </div>
  );
}
