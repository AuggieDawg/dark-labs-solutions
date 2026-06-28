import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

const painPoints = [
  {
    title: "Your website does not convert.",
    body: "The business looks less capable online than it actually is, and good leads hesitate.",
  },
  {
    title: "Your workflow leaks time.",
    body: "Forms, calls, notes, follow-ups, and project details are scattered across too many places.",
  },
  {
    title: "You cannot see the business clearly.",
    body: "Owners need dashboards and systems that show what is active, late, profitable, or blocked.",
  },
];

const buildPath = [
  {
    number: "01",
    title: "Clarify the offer",
    body: "We define what the customer needs to understand before they trust you enough to call.",
  },
  {
    number: "02",
    title: "Build the public layer",
    body: "We create a premium web presence designed around trust, clarity, speed, and conversion.",
  },
  {
    number: "03",
    title: "Connect the operations",
    body: "We add the forms, automations, dashboards, and internal systems that make the website useful.",
  },
  {
    number: "04",
    title: "Compound the platform",
    body: "The system improves over time with better workflows, better data, and stronger client experience.",
  },
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Why Dark Labs
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              The goal is simple: turn visitors into customers.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/52">
              A business website should not exist just to look modern. It should
              create trust, explain the offer, generate contact, and support the
              operations behind the work.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="min-h-72 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm leading-6 text-white/50">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_CONFIG.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Call Now
            </a>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              See What We Build
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10), transparent 28%), linear-gradient(180deg, #000 0%, #050507 100%)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Funnel Flow
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              From attention to contact to operating system.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              The public site earns attention. The service pages explain the
              value. The contact path turns interest into a real conversation.
              The private platform manages the work after the sale.
            </p>
          </div>

          <div className="grid gap-3">
            {buildPath.map((item) => (
              <div
                key={item.number}
                className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[88px_1fr]"
              >
                <p className="font-mono text-3xl tracking-[-0.08em] text-white/35">
                  {item.number}
                </p>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Start
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Want more customers from a better digital system?
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_CONFIG.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Call Now
            </a>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Contact Dark Labs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
