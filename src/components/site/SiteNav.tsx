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
          className="pointer-events-auto group inline-flex items-center gap-3"
        >
          <Image
            src="/brand/dark-labs-mark.png"
            alt=""
            width={88}
            height={88}
            priority
            className="h-14 w-14 object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.20)] transition duration-300 group-hover:scale-105 md:h-[72px] md:w-[72px]"
          />

          <span className="hidden text-sm font-semibold uppercase tracking-[0.32em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] sm:inline">
            {APP_CONFIG.companyName}
          </span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-2 shadow-2xl shadow-black/35 backdrop-blur-xl md:flex">
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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
        <nav className="flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/25 px-2 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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
