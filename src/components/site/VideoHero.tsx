import Link from "next/link";

import { VideoBackdrop } from "@/components/site/VideoBackdrop";

const capabilities = [
  "Websites",
  "Automations",
  "Dashboards",
  "Client Portals",
  "Private Platforms",
];

export function VideoHero() {
  return (
    <VideoBackdrop
      src="/videos/dark-labs-hero.mp4"
      className="min-h-[calc(100vh-80px)]"
    >
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-end px-6 py-16 md:py-20">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              Intelligent Business Systems
            </span>
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-white md:text-7xl xl:text-8xl">
            Build the machine behind the business.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
            Dark Labs builds premium websites, automations, dashboards, client
            portals, and private operating platforms for businesses that need
            modern digital infrastructure.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Start a Project
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.12]"
            >
              View Services
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {capabilities.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/50 backdrop-blur-xl"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </VideoBackdrop>
  );
}
