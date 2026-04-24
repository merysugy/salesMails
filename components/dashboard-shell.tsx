"use client";

import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Mail, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions/auth";
import { AppLogoMark } from "@/components/app-logo-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/correo", label: "Correo", icon: Mail },
  {
    href: "/dashboard/noticias/interesantes",
    label: "Funciones IA",
    icon: Sparkles,
  },
  { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItemButton({
  active,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-md text-figma-ui/70 transition-colors",
        active && "bg-figma-table text-white",
      )}
    >
      <Icon className="size-[1.15rem]" strokeWidth={1.75} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="font-dashboard grid h-full min-h-0 grid-cols-[4.75rem_1fr] grid-rows-[auto_1fr] overflow-hidden bg-figma-shell text-figma-table lg:grid-cols-[5.5rem_1fr]">
      <aside className="row-span-2 flex flex-col items-center border-r border-border/80 bg-brand-shell-warm py-6">
        <div className="mb-8">
          <Link href="/dashboard" aria-label="Ir al dashboard">
            <AppLogoMark />
          </Link>
        </div>

        <nav className="flex flex-col items-center gap-5">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md transition-colors hover:bg-muted"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <NavItemButton
                  active={active}
                  icon={item.icon}
                  label={item.label}
                />
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="flex min-w-0 flex-wrap items-center justify-end gap-3 bg-brand-shell-warm px-6 py-5 md:gap-5 md:px-10">
        <p className="font-display text-lg font-semibold tracking-tight text-figma-table">
          Bienvenida, María
        </p>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="border-border/80 bg-transparent text-sm font-medium text-figma-table shadow-none hover:bg-muted"
          >
            Cerrar sesión
          </Button>
        </form>
      </header>

      <main className="min-h-0 min-w-0 overflow-y-auto overscroll-contain bg-[#FFFFFF] px-4 pb-6 pt-6 md:px-8 md:pt-8">
        <div className="flex min-h-full min-w-0 flex-col">{children}</div>
      </main>
    </div>
  );
}
