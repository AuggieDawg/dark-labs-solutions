import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white">
            {APP_CONFIG.companyName}
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
            Custom websites, lead funnels, targeted integrations, and measurable
            post-launch improvement for established businesses.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              Site
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/45">
              {APP_CONFIG.publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              Access
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/45">
              <Link href="/owner" className="hover:text-white">
                Command Center
              </Link>
              <Link href="/sign-in" className="hover:text-white">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Dark Labs. Built to turn attention into
            measurable action.
          </p>
          <p className="font-mono">founder-led / measurement-ready</p>
        </div>
      </div>
    </footer>
  );
}
