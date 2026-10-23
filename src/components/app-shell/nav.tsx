"use client";

import {
  CalendarDays,
  Home,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

export const APP_NAV: {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}[] = [
  { href: "/dashboard", label: "Mi día", shortLabel: "Hoy", icon: Home },
  {
    href: "/calendar",
    label: "Calendario",
    shortLabel: "Calendario",
    icon: CalendarDays,
  },
  {
    href: "/community",
    label: "Comunidad",
    shortLabel: "Retos",
    icon: Users,
  },
  {
    href: "/settings",
    label: "Ajustes",
    shortLabel: "Ajustes",
    icon: Settings,
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1" aria-label="Navegación principal">
      {APP_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-link", active && "nav-link-active")}
            aria-current={active ? "page" : undefined}
          >
            <item.icon
              className={cn(
                "size-[1.15rem]",
                active ? "text-[#8A6512]" : "text-ink-muted",
              )}
              strokeWidth={active ? 2.5 : 2}
            />
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto size-1.5 rounded-full bg-[#D3A12D]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EDDDB7] bg-[#FFFDF5]/95 px-2 pt-1.5 backdrop-blur-xl lg:hidden safe-bottom"
      aria-label="Navegación inferior"
    >
      <div className="mx-auto flex max-w-md items-center">
        {APP_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "bottom-link",
                active && "bottom-link-active",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-2xl transition",
                  active ? "bg-[#FFE8A8] text-[#8A6512]" : "bg-transparent",
                )}
              >
                <item.icon className="size-[1.15rem]" strokeWidth={active ? 2.5 : 2} />
              </span>
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className="icon-button size-9 border-transparent bg-transparent text-ink-muted hover:bg-cream-200 hover:text-ink"
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <LogOut className="size-4" />
    </button>
  );
}
