import Link from "next/link";
import { APP_CONFIG } from "@/config/app";

const businessProblems = [
  {
    number: "01",
    title: "The website undersells the business",
    body: "Your real-world reputation is stronger than the experience customers get when they look you up online.",
  },
  {
    number: "02",
    title: "Good inquiries lose momentum",
    body: "Customers click, call, or submit a form, but the path to the right person is slow, unclear, or difficult to verify.",
  },
  {
    number: "03",
    title: "The tools do not work together",
    body: "The website, email, booking, inventory, notifications, and follow-up process feel like separate pieces instead of one customer journey.",
  },
  {
    number: "04",
    title: "You cannot see what is working",
    body: "Traffic may be visible, but meaningful actions such as calls, inquiries, bookings, or service interest are not measured clearly.",
  },
];

const services = [
  {
    number: "01",
    title: "Custom Websites",
    headline: "Make the business as credible online as it is in person.",
    body: "Custom strategy, content structure, design, and development built around your customers, services, proof, and next step.",
  },
  {
    number: "02",
    title: "Funnels + Integrations",
    headline: "Protect the lead after the click.",
    body: "Clear inquiry paths and carefully chosen connections that help the right information reach the people and systems responsible for follow-up.",
  },
  {
    number: "03",
    title: "Web Analytics",
    headline: "Measure actions that matter to the business.",
    body: "Verified tracking for calls, forms, bookings, service interest, and other meaningful steps—so the next decision is based on evidence.",
  },
];

const process = [
  {
    number: "01",
    title: "Talk through the business",
    body: "We begin with how customers find you, what earns their trust, where the current process breaks down, and what your team needs to happen next.",
  },
  {
    number: "02",
    title: "Plan before building",
    body: "Dark Labs defines the customer path, scope, ownership, recurring services, risks, measurement, and launch standard before development expands.",
  },
  {
    number: "03",
    title: "Build, verify, and launch",
    body: "I build and test the complete path, release it through a controlled launch, verify the live system, and support the agreed stabilization period.",
  },
];

const fitSignals = [
  "You operate an established business with a real offer, real customers, and a reputation worth protecting.",
  "The current website undersells the quality of the business or creates friction for qualified buyers.",
  "You want honest advice—even when the right answer is smaller, harder, or different from what you expected.",
  "You value careful planning, direct accountability, and a durable business asset over a disposable template.",
];

const faqs = [
  {
    question: "Do I need to know exactly what I need?",
    answer:
      "No. Explain what is happening in the business, where customers or staff encounter friction, and what you want to improve. Determining the right system is part of the conversation.",
  },
  {
    question: "Can Dark Labs work with systems we already use?",
    answer:
      "Often, yes. I first determine what should remain in place, what can be connected safely, and where a simpler workflow is the better answer. Compatibility and responsibilities are confirmed before they enter the scope.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every build defines an agreed stabilization period for verifying the live system and addressing launch defects. Ongoing maintenance, reporting, and improvements are separate options with clear boundaries.",
  },
  {
    question: "How is final pricing determined?",
    answer:
      "Pricing follows the actual scope, content, integrations, and risk. The first conversation establishes fit; deeper planning is handled through a defined paid engagement when the work requires it.",
  },
  {
    question: "Do you guarantee leads, revenue, or search rankings?",
    answer:
      "No responsible consultant can guarantee outcomes controlled by customers, competitors, advertising platforms, or search engines. Dark Labs commits to disciplined planning, careful in-scope implementation, direct communication, and honest measurement.",
  },
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Does this sound familiar?
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              A website can look finished and still leave the business exposed.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              These are not cosmetic details. They are business-system
              decisions, and they are easier to address during planning than
              after real customers depend on the finished work.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessProblems.map((problem) => (
              <article
                key={problem.number}
                className="flex min-h-72 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <p className="font-mono text-sm text-white/30">
                  {problem.number}
                </p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {problem.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/50">
                    {problem.body}
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
                Selected work
              </p>
              <p className="mt-5 font-mono text-sm uppercase tracking-[0.22em] text-white/45">
                Repete Auto · Vernal, Utah
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                A dealership website built around the way the business actually
                operates.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
                Dark Labs built a custom website around Repete Auto&apos;s
                existing vehicle-inventory and inquiry workflow, with clearer
                customer paths, mobile usability, search foundations, meaningful
                event measurement, and a controlled launch process. Performance
                claims are published only when verified evidence supports them.
              </p>
              <Link
                href="/work"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.11]"
              >
                View the Repete Auto Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Founder-led accountability
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              The person making the promises stays responsible for the work.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
              You work directly with me from the first business conversation
              through the agreed launch and stabilization period. There is no
              handoff to someone who was not part of the original decisions.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 md:p-10">
            <p className="text-2xl font-semibold leading-snug tracking-[-0.035em] text-white/90 md:text-3xl">
              If I know the answer, I will give it to you directly. If I do not,
              I will say so, do the work to find it, and return with a grounded
              recommendation.
            </p>
            <p className="mt-6 text-sm leading-7 text-white/52">
              When I see a structural risk, I bring it up while it is still a
              planning decision. My standard is to tell the truth, protect the
              agreed outcome, communicate clearly, and follow through on the
              work Dark Labs accepts.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Talk to Agustin
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              What Dark Labs builds
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Three parts of one dependable customer journey.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              Your website, lead flow, and measurement should support the same
              business goal. Dark Labs plans them together and builds only what
              the business actually needs.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="flex min-h-80 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-sm text-white/30">
                    {service.number}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                    {service.title}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {service.headline}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {service.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Link
            href="/services#engagements"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            See Services and Starting Investments
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Simple process · serious planning
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Understand the business before prescribing the system.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {process.map((step) => (
              <article
                key={step.number}
                className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <p className="font-mono text-4xl tracking-[-0.08em] text-white/30">
                  {step.number}
                </p>
                <h3 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/50">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Best fit
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Built for owners who care what happens after launch.
            </h2>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                Starting investment
              </p>
              <p className="mt-3 text-xl font-semibold text-white/85">
                Paid planning starts at $1,500. Custom website builds start at
                $7,500.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Final scope and pricing depend on content, integrations,
                business risk, and the work required to launch responsibly.
              </p>
            </div>
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

      <section className="border-y border-white/10 bg-black px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
            Common questions
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
            Clear answers before the first call.
          </h2>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-semibold tracking-[-0.025em] text-white/85">
                  {faq.question}
                  <span
                    aria-hidden
                    className="text-2xl font-normal text-white/35 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
                Start with a real conversation
              </p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                Tell me what is happening now—and what you need the business to
                do better.
              </h2>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/52">
                Start with the business problem. If Dark Labs is not the right
                fit, I will tell you. If the responsible next step is smaller
                than a full build, I will tell you that too.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xl font-semibold tracking-[-0.025em] text-white/85">
                The first goal is clarity—not a rushed close.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Talk to Agustin
                </Link>
                <a
                  href={APP_CONFIG.phoneHref}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Call {APP_CONFIG.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
