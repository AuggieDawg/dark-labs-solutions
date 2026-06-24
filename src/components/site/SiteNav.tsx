import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center border border-white/20 bg-white/[0.04]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
            {APP_CONFIG.companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {APP_CONFIG.publicNav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.22em] text-white/50 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/owner"
          className="hidden rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white hover:text-black sm:inline-flex"
        >
          Command
        </Link>
      </div>
    </header>
  );
}
