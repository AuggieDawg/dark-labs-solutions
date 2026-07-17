import Link from "next/link";

const outcomes = [
  {
    number: "01",
    title: "Get found",
    body: "Build on a search-ready structure with strong mobile performance and technical SEO foundations.",
  },
  {
    number: "02",
    title: "Turn visits into action",
    body: "Give the right customer a clear offer, a useful path, and a reason to take the next step.",
  },
  {
    number: "03",
    title: "Route leads correctly",
    body: "Connect inquiries to the right people and existing systems without creating more administrative drag.",
  },
  {
    number: "04",
    title: "Know what happens next",
    body: "Measure meaningful customer actions so decisions after launch are based on evidence instead of guesswork.",
  },
];

const offerPhases = [
  {
    number: "01",
    title: "Discover",
    body: "Map the business, offer, customer flow, primary conversion, and follow-up process before deciding what to build.",
    deliverables: [
      "Business and customer-flow discovery",
      "Offer and conversion-path definition",
    ],
  },
  {
    number: "02",
    title: "Build",
    body: "Create a custom public experience around trust, clarity, action, and the way customers actually buy.",
    deliverables: [
      "Custom conversion-focused website",
      "Service or inventory funnel",
      "Mobile, SEO, and performance foundation",
    ],
  },
  {
    number: "03",
    title: "Connect + measure",
    body: "Make the website useful to the operation by connecting lead delivery, existing tools, and measurable events.",
    deliverables: [
      "Lead capture and routing",
      "Existing-system integrations",
      "Analytics and conversion events",
    ],
  },
  {
    number: "04",
    title: "Launch + stabilize",
    body: "Move into production through a controlled release, verify the critical path, and learn from real usage.",
    deliverables: [
      "Controlled production launch",
      "60-day stabilization and reporting",
      "Handoff and support options",
    ],
  },
];

const process = [
  {
    number: "01",
    title: "Discover the customer flow",
    body: "Understand how attention becomes an inquiry and how the business handles that inquiry after it arrives.",
  },
  {
    number: "02",
    title: "Design and build the system",
    body: "Turn the strongest path into a fast, trustworthy experience connected to the tools the business already uses.",
  },
  {
    number: "03",
    title: "Launch with control",
    body: "Test the complete conversion path, release through a defined gate, and verify the production experience.",
  },
  {
    number: "04",
    title: "Measure and stabilize",
    body: "Confirm data quality, observe real behavior, and prioritize improvements by business impact.",
  },
];

const expansionPaths = [
  {
    title: "Conversion reporting",
    body: "Turn verified website and funnel events into a clear view of what customers do next.",
  },
  {
    title: "Search expansion",
    body: "Add useful service, inventory, or location paths where real search demand supports them.",
  },
  {
    title: "Funnel optimization",
    body: "Improve offers and conversion paths using measured behavior instead of untested assumptions.",
  },
  {
    title: "Targeted integrations",
    body: "Connect the CRM, inventory, booking, or routing tools needed to protect the customer journey.",
  },
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Built to perform
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Your website should be part of your sales operation.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              Dark Labs is a custom website and digital systems agency for
              established businesses that need more leads, better visibility,
              and less operational friction.
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

      <section className="relative overflow-hidden px-6 py-24 md:py-32">
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
                Flagship engagement
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                The Dark Labs Client Acquisition System
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-base leading-8 text-white/55">
                A custom engagement connecting your public website, customer
                journey, and business systems—from discovery through the first
                60 days after launch.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Discuss Your Acquisition System
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {offerPhases.map((phase) => (
              <article
                key={phase.number}
                className="rounded-[2rem] border border-white/10 bg-black/35 p-7 backdrop-blur-sm md:p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-3xl font-semibold tracking-[-0.045em]">
                    {phase.title}
                  </h3>
                  <p className="font-mono text-sm text-white/30">
                    {phase.number}
                  </p>
                </div>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                  {phase.body}
                </p>
                <ul className="mt-7 grid gap-3">
                  {phase.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex items-start gap-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/65"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/45"
                      />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              How Dark Labs works
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Built around how your business actually works.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              The technology follows the customer journey and the operating
              reality behind it. Each phase has a clear job, test, and next
              decision.
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
                Proof in progress
              </p>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.22em] text-white/45">
                Repete Auto · Case study
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                See the system take shape.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
                The Repete Auto case study documents the decisions,
                implementation, launch, and selected optimization updates behind
                a custom dealership website. Results will be published only when
                the measurement supports them.
              </p>
              <Link
                href="/work"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.11]"
              >
                View the Repete Case Study
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Expansion paths
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Improve the acquisition system as evidence grows.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50">
              Start with the customer-acquisition path. Add reporting,
              search-focused content, funnel improvements, or a targeted
              integration when a measured opportunity makes the next investment
              clear.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {expansionPaths.map((path) => (
              <article
                key={path.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <h3 className="text-xl font-semibold tracking-[-0.035em]">
                  {path.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/48">
                  {path.body}
                </p>
              </article>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-8 inline-flex text-sm font-semibold text-white/65 underline decoration-white/25 underline-offset-8 transition hover:text-white"
          >
            Explore website, funnel, and measurement services
          </Link>
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
                One accountable partner from strategy through support.
              </h2>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/52">
                You work directly with the person responsible for understanding
                the problem and building the solution. That context stays with
                the project through architecture, implementation, launch, and
                ongoing support.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xl font-semibold tracking-[-0.025em] text-white/85">
                Ready to turn your website into a working acquisition system?
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Start a Project
                </Link>
                <Link
                  href="/work"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
