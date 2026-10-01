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
    href: "/properties",
    icon: Building2,
  },
  {
    label: "Leads",
    href: "/leads",
    icon: UserRoundSearch,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Viewings",
    href: "/viewings",
    icon: CalendarDays,
  },
  {
    label: "Agents",
    href: "/agents",
    icon: CircleUserRound,
  },
] as const;

export const allNavigation = [...primaryNavigation, ...moduleNavigation];

export type NavigationItem = (typeof allNavigation)[number];
