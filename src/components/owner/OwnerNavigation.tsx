"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const OWNER_NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Command Center", href: "/owner" }],
  },
  {
    label: "Sales",
    items: [
      { label: "Clients", href: "/owner/clients" },
      { label: "Prospects", href: "/owner/prospects" },
      { label: "Leads", href: "/owner/leads" },
    ],
  },
  {
    label: "Delivery",
    items: [
      { label: "Projects", href: "/owner/projects" },
      { label: "Tasks", href: "/owner/tasks" },
    ],
  },
  {
    label: "Strategy",
    items: [{ label: "Goals", href: "/owner/goals" }],
  },
  {
    label: "Knowledge",
    items: [{ label: "Notes", href: "/owner/notes" }],
  },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/owner") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type OwnerNavigationProps = {
  mobile?: boolean;
};

export function OwnerNavigation({ mobile = false }: OwnerNavigationProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav
        aria-label="Command Center navigation"
        className="flex gap-5 overflow-x-auto px-5 pb-4"
      >
        {OWNER_NAV_GROUPS.map((group) => (
          <div key={group.label} className="shrink-0">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              {group.label}
            </p>
            <div className="flex gap-2">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? "border-white/25 bg-white text-black"
                        : "border-white/10 bg-white/[0.045] text-white/60 hover:bg-white/[0.09] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Command Center navigation" className="mt-9 space-y-6">
      {OWNER_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28">
            {group.label}
          </p>
          <div className="mt-2 space-y-1.5">
            {group.items.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl border px-4 py-2.5 text-sm transition ${
                    active
                      ? "border-white/20 bg-white/[0.12] font-semibold text-white"
                      : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
