import { NavigationItem } from "../constants/navigation";

export function isActivePath(pathname: string, href: NavigationItem["href"]) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}