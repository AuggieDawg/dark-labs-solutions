import Link from "next/link";
import { ENGAGEMENTS } from "@/config/engagements";

const outcomes = [
  {
    number: "01",
    title: "Clarify the offer",
    body: "Make it immediately clear who you help, what you sell, and why the right customer should choose you.",
  },
  {
    number: "02",
    title: "Earn trust faster",
    body: "Use focused messaging, proof, and a professional customer experience to reduce hesitation before the first conversation.",
  },
  {
    number: "03",
    title: "Capture and route demand",
    body: "Turn interest into qualified inquiries and deliver each lead to the people and systems responsible for follow-up.",
  },
  {
    number: "04",
    title: "Prove what works",
    body: "Track meaningful conversion events so the next investment is based on evidence rather than pageviews or opinion.",
  },
];

const process = [
  {
    number: "01",
    title: "Diagnose the constraint",
    body: "Identify where the current customer journey loses clarity, trust, inquiries, or operational visibility.",
  },
  {
    number: "02",
    title: "Architect the path",
    body: "Define the offer, information hierarchy, conversion path, integrations, events, and launch criteria before development expands.",
  },
  {
    number: "03",
    title: "Build and connect",
    body: "Design the experience, develop the system, connect the required tools, and test the full lead path—not isolated screens.",
  },
  {
    number: "04",
    title: "Launch and stabilize",
    body: "Release through a controlled gate, verify production behavior, correct defects, and turn initial data into the next decision.",
  },
];

const fitSignals = [
  "You have a proven service, operation, or offer—not only an untested idea.",
  "The current website undersells the quality of the business or creates friction for qualified buyers.",
  "Leads need better capture, qualification, routing, follow-up, or attribution.",
  "You value a durable business asset and accountable implementation over a disposable template.",
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Built for the buying journey
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              A strong website does more than look credible.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              It helps the right customer understand the offer, trust the
              business, take the next step, and enter a follow-up process the
              company can actually measure and manage.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {outcomes.map((outcome) => (
              <article
                key={outcome.number}
                className="flex min-h-72 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <p className="font-mono text-sm text-white/30">
                  {outcome.number}
                </p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {outcome.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/50">
                    {outcome.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="engagements"
        className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 18%, rgba(255,255,255,0.11), transparent 30%), linear-gradient(180deg, #000 0%, #050507 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
                Defined engagements
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Buy a clear outcome—not an open-ended pile of hours.
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-base leading-8 text-white/55">
                Every engagement has a defined business problem, scope, launch
                standard, and next decision. Final pricing follows the Blueprint
                when requirements or integrations need deeper discovery.
              </p>
              <Link
                href="/services#engagements"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Compare Engagements
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {ENGAGEMENTS.map((engagement) => (
              <article
                key={engagement.name}
                className={`rounded-[2rem] border p-7 backdrop-blur-sm md:p-8 ${
                  "featured" in engagement && engagement.featured
                    ? "border-white/25 bg-white/[0.085]"
                    : "border-white/10 bg-black/35"
                }`}
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    {"featured" in engagement && engagement.featured ? (
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                        Flagship engagement
                      </p>
                    ) : null}
                    <h3 className="text-3xl font-semibold tracking-[-0.045em]">
                      {engagement.name}
                    </h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-white/85">
                      {engagement.investment}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {engagement.timeline}
                    </p>
                  </div>
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/52">
                  {engagement.summary}
                </p>

                <ul className="mt-7 grid gap-3">
                  {engagement.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/65"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/45"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-xs leading-6 text-white/38">
                  {engagement.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Delivery method
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Strategy and implementation stay connected.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              The person defining the system is accountable for building and
              validating it. That continuity reduces handoff loss and keeps the
              work tied to the business constraint.
            </p>
          </div>

          <div className="grid gap-3">
            {process.map((step) => (
              <article
                key={step.number}
                className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[88px_1fr]"
              >
                <p className="font-mono text-3xl tracking-[-0.08em] text-white/35">
                  {step.number}
                </p>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl rounded-[2.25rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
                Proof over promises
              </p>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.22em] text-white/45">
                Repete Auto · Case study in progress
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                See the decisions behind the finished system.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
                The Repete Auto case study documents the strategy, architecture,
                implementation, launch controls, and selected improvements
                behind a custom dealership website. Performance claims will be
                published only when verified measurement supports them.
              </p>
              <Link
                href="/work"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.11]"
              >
                View Selected Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Best fit
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Built for businesses ready to improve a real sales process.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fitSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <p className="text-sm leading-7 text-white/58">{signal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
                Founder-led delivery
              </p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                One accountable technical partner from diagnosis through launch.
              </h2>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/52">
                Begin with a fit conversation. When the opportunity is real but
                the scope is not yet clear, the Acquisition Blueprint turns the
                first decision into a concrete implementation plan.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xl font-semibold tracking-[-0.025em] text-white/85">
                Ready to identify the highest-leverage constraint?
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Book a Fit Call
                </Link>
                <Link
                  href="/services#engagements"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Review Engagements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
