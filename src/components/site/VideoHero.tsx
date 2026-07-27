import Link from "next/link";

import { VideoBackdrop } from "@/components/site/VideoBackdrop";

const capabilities = [
  "Positioning + conversion copy",
  "Custom design + development",
  "Lead routing + integrations",
  "Analytics + optimization",
];

export function VideoHero() {
  return (
    <VideoBackdrop src="/videos/dark-labs-hero.mp4" className="min-h-[100svh]">
      <section className="mx-auto flex min-h-[100svh] w-full max-w-7xl items-end px-6 pb-28 pt-32 md:pb-24">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60 md:text-xs">
              Conversion websites · lead systems · measurement
            </span>
          </div>

          <h1 className="mt-7 max-w-6xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)] md:text-7xl xl:text-8xl">
            Websites that turn attention into qualified sales conversations.
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
            Dark Labs designs and builds conversion-focused websites and client
            acquisition systems for established service businesses. Strategy,
            content structure, development, lead routing, integrations, and
            analytics are handled as one accountable system.
          </p>

          <p className="mt-5 max-w-3xl border-l border-white/25 pl-4 text-sm leading-6 text-white/58">
            Work directly with the founder responsible for the strategy, build,
            launch, and post-launch stabilization.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services#engagements"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              View Engagements
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-6 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.14]"
            >
              See the Work
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {capabilities.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/52 backdrop-blur-xl"
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
