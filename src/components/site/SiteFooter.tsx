import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
            {APP_CONFIG.companyName}
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
            Intelligent websites, automations, dashboards, and operating
            platforms for serious operators.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          {APP_CONFIG.publicNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
