"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TimeZoneBadge } from "@/components/site/TimeZoneBadge";
import { APP_CONFIG } from "@/config/app";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Dark Labs home"
          className="group inline-flex items-center gap-4"
        >
          <Image
            src="/brand/dark-labs-mark.png"
            alt=""
            width={72}
            height={72}
            priority
            className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.16)] transition duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.22)] md:h-16 md:w-16"
          />

          <span className="hidden text-sm font-semibold uppercase tracking-[0.32em] text-white sm:inline">
            {APP_CONFIG.companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative text-xs font-medium uppercase tracking-[0.22em] transition",
                  active ? "text-white" : "text-white/45 hover:text-white",
                ].join(" ")}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-white/70" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <TimeZoneBadge />

          <Link
            href="/owner"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white hover:text-black sm:px-5 sm:py-2.5"
          >
            Command
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-3 md:hidden">
        <nav className="mx-auto flex max-w-7xl gap-5 overflow-x-auto text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          {APP_CONFIG.publicNav.slice(1).map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "shrink-0 text-white" : "shrink-0"}
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
