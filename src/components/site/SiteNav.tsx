"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TimeZoneBadge } from "@/components/site/TimeZoneBadge";
import { APP_CONFIG } from "@/config/app";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="Dark Labs home"
          className="pointer-events-auto group inline-flex items-center"
        >
          <Image
            src="/brand/dark-labs-logo.png"
            alt="Dark Labs"
            width={320}
            height={180}
            priority
            className="h-14 w-auto max-w-[190px] object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.18)] transition duration-300 group-hover:scale-[1.03] md:h-16 md:max-w-[240px]"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-2 shadow-2xl shadow-black/35 backdrop-blur-xl md:flex"
        >
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                  active
                    ? "bg-white text-black"
                    : "text-white/58 hover:bg-white/[0.08] hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2">
          <TimeZoneBadge />

          <a
            href={APP_CONFIG.phoneHref}
            className="hidden rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:bg-white hover:text-black lg:inline-flex"
          >
            Call
          </a>

          <Link
            href="/contact"
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black shadow-2xl shadow-black/30 transition hover:bg-white/90 sm:px-5"
          >
            Contact
          </Link>

          <Link
            href="/owner"
            className="hidden rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white sm:inline-flex"
          >
            Command
          </Link>
        </div>
      </div>

      <div className="pointer-events-auto mx-auto flex max-w-7xl px-4 md:hidden">
        <nav
          aria-label="Mobile navigation"
          className="flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/25 px-2 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "shrink-0 rounded-full px-3 py-2",
                  active ? "bg-white text-black" : "hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
