import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { NavigationItem } from "../constants/navigation";
import { isActivePath } from "../utils/is-active-path";

export function NavigationLink({
  item,
  onNavigate,
  mobile = false,
  collapsed = false,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  mobile?: boolean;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed && "justify-center px-2",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
        mobile && active && "bg-accent text-accent-foreground",
        mobile && !active && "hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />

      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}
