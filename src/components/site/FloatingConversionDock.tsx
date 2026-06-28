import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export function FloatingConversionDock() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-black/45 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl md:bottom-6 md:left-auto md:right-6 md:w-auto md:translate-x-0">
      <div className="grid grid-cols-2 gap-2 md:flex">
        <a
          href={APP_CONFIG.phoneHref}
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
        >
          Call
        </a>

        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Start a Project
        </Link>
      </div>
    </div>
  );
}
