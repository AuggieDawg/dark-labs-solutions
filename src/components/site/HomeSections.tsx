import Link from "next/link";
import { ENGAGEMENTS } from "@/config/engagements";

const outcomes = [
  {
    number: "01",
    title: "Make the offer unmistakable",
    body: "The right customer should quickly understand what you do, who it is for, and why your business deserves the next conversation.",
  },
  {
    number: "02",
    title: "Earn confidence before the call",
    body: "Strong messaging, credible proof, and a professional customer experience begin building trust before you enter the room.",
  },
  {
    number: "03",
    title: "Build a dependable inquiry path",
    body: "An inquiry becomes actionable when it reaches the right person, with the right context, through a tested delivery path.",
  },
  {
    number: "04",
    title: "Measure what matters",
    body: "Track meaningful customer actions so future decisions are based on evidence—not assumptions, pageviews, or sales language.",
  },
];

const process = [
  {
    number: "01",
    title: "Understand the real operation",
    body: "Learn how customers find you, what earns their trust, where inquiries go, and what your team must do next before recommending features.",
  },
  {
    number: "02",
    title: "Expose the risk early",
    body: "Identify weak assumptions, dependencies, account ownership, recurring costs, failure points, and launch criteria while they are still planning decisions.",
  },
  {
    number: "03",
    title: "Build the complete path",
    body: "Connect the website, conversion path, lead delivery, integrations, and measurement—and test the full customer journey, not isolated screens.",
  },
  {
    number: "04",
    title: "Launch and stay accountable",
    body: "Release through a controlled gate, verify the live system, correct defects, and use credible evidence to decide what deserves improvement next.",
  },
];

const fitSignals = [
  "You operate an established business with a real offer, real customers, and a reputation worth protecting.",
  "The current website undersells the quality of the business or creates friction for qualified buyers.",
  "You want honest advice—even when the right answer is smaller, harder, or different from what you expected.",
  "You value careful planning, direct accountability, and a durable business asset over a disposable template.",
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Strong foundations first
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Make the hard decisions before they become expensive problems.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              A serious website begins before the first screen is designed. The
              offer, customer path, account ownership, lead routing, third-party
              services, analytics, and launch controls need to work together.
              Dark Labs plans those pieces early so preventable mistakes do not
              become operational problems later.
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
                Buy a clear outcome—not a vague promise.
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
              Founder-led accountability
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              The person making the promises stays responsible for the work.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              You work directly with the founder from the first strategic
              decision through launch and stabilization. That continuity
              protects the original business goal, reduces handoff mistakes, and
              makes accountability unmistakable when the work becomes difficult.
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
                Work worth standing behind
              </p>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.22em] text-white/45">
                Repete Auto · Case study in progress
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                See the thinking behind the finished system.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
                The Repete Auto case study documents the strategy, architecture,
                implementation, launch controls, and selected improvements
                behind a custom dealership website. Dark Labs publishes
                performance claims only when verified measurement supports them.
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
              Built for owners who care what happens after launch.
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
                The standard I intend to earn
              </p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                I want every client to be able to say: “Go with Dark Labs.
                Agustin will tell you the truth, find the answer, and follow
                through when the work gets difficult.”
              </h2>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/52">
                That recommendation is never assumed. It has to be earned
                through direct advice, disciplined planning, careful execution,
                clear boundaries, and the way I respond when the work becomes
                difficult.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xl font-semibold tracking-[-0.025em] text-white/85">
                Tell me what your business is trying to solve.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Talk to Agustin
                </Link>
                <Link
                  href="/work"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Review the Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
