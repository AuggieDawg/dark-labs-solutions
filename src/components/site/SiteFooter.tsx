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
            Founder-led custom websites, funnels, integrations, and web
            analytics for established businesses that value solid foundations
            and direct accountability.
          </p>
          <p className="mt-4 max-w-md text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Technology behind the scenes. Your business in the spotlight.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              Contact
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/45">
              <a href={APP_CONFIG.phoneHref} className="hover:text-white">
                {APP_CONFIG.phoneDisplay}
              </a>
              <a
                href={`mailto:${APP_CONFIG.contactEmail}`}
                className="hover:text-white"
              >
                {APP_CONFIG.contactEmail}
              </a>
              <a
                href={APP_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              Legal
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/45">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-white/30 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Dark Labs. Plan deeply. Build
            carefully. Measure honestly. Earn the referral.
          </p>
          <p className="font-mono">founder-led / accountable through launch</p>
        </div>
      </div>
    </footer>
  );
}
