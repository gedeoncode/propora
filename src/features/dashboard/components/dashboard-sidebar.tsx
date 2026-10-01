
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  PanelLeft,
  CircleUserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { DashboardNavigation } from "./dashboard-navigation";

type DashboardSidebarProps = {
  displayName: string;
  roleLabel: string;
};

const STORAGE_KEY = "propora-sidebar-collapsed";

export function DashboardSidebar({
  displayName,
  roleLabel,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(
      window.localStorage.getItem(STORAGE_KEY) === "true",
    );
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;

      window.localStorage.setItem(
        STORAGE_KEY,
        String(next),
      );

      return next;
    });
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col",
        "transition-[width] duration-200 ease-out",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {collapsed ? (
          <button
            type="button"
            aria-label="Expand sidebar"
            title="Expand sidebar"
            onClick={toggleCollapsed}
            className="flex size-10 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              aria-label="Propora overview"
              className="flex min-w-0 items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" aria-hidden="true" />
              </span>

              <span>Propora</span>
            </Link>

            <Button
              type="button"
              variant="ghost"
              
              className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground p-2"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              onClick={toggleCollapsed}
            >
              <PanelLeft aria-hidden="true" className="size-5 " />
            </Button>
          </>
        )}
      </div>

      <DashboardNavigation collapsed={collapsed} />

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md",
            collapsed ? "justify-center px-0 py-1" : "px-2 py-2",
          )}
          title={collapsed ? `${displayName} · ${roleLabel}` : undefined}
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground"
            aria-hidden="true"
          >
            <CircleUserRound className="size-4" />
          </span>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {displayName}
              </p>

              <p className="text-xs text-muted-foreground">
                {roleLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}