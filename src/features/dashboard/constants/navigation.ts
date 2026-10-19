import {
  Building2,
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  UserRoundSearch,
  Users,
} from "lucide-react";

export const primaryNavigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
] as const;

export const moduleNavigation = [
  {
    label: "Properties",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: UserRoundSearch,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Viewings",
    href: "/dashboard/viewings",
    icon: CalendarDays,
  },
  {
    label: "Agents",
    href: "/dashboard/agents",
    icon: CircleUserRound,
  },
] as const;

export const allNavigation = [...primaryNavigation, ...moduleNavigation];

export type NavigationItem = (typeof allNavigation)[number];
