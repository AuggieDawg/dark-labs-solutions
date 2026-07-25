"use client";

import Link from "next/link";

type OwnerErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function OwnerError({ error, unstable_retry }: OwnerErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] px-5 py-16 text-white">
      <section
        aria-labelledby="owner-error-title"
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/40 sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
          Dark Labs Command Center
        </p>
        <h1
          id="owner-error-title"
          className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
        >
          Command Center temporarily unavailable.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
          The private workspace could not reach one of its required services.
          Retry the request once. Your public website remains available while
          the private system recovers.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Retry Command Center
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Return to public site
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200/15 bg-amber-200/[0.045] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/55">
            Operator check
          </p>
          <p className="mt-3 text-sm leading-6 text-white/48">
            Verify database connectivity and confirm that every committed
            migration has been applied to this deployment environment.
          </p>
          {error.digest ? (
            <p className="mt-3 break-all font-mono text-xs text-white/35">
              Support reference: {error.digest}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
