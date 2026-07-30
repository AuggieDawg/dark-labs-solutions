import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Dark Labs is a founder-led business technology consultancy built on careful planning, honest advice, direct accountability, and measurable client-owned systems.",
};

const principles = [
  {
    number: "01",
    title: "Plan deeply",
    body: "Understand the business, customer path, dependencies, ownership, and risks before expensive implementation decisions are locked in.",
  },
  {
    number: "02",
    title: "Tell the truth early",
    body: "Say what is known, identify what still needs to be verified, and never hide uncertainty behind confident sales language.",
  },
  {
    number: "03",
    title: "Build responsibly",
    body: "Treat lead delivery, integrations, data, performance, and failure paths as business infrastructure—not launch-day decoration.",
  },
  {
    number: "04",
    title: "Measure honestly",
    body: "Separate what is working, uncertain, and broken. Publish outcomes only when the evidence and client approval support them.",
  },
  {
    number: "05",
    title: "Stay accountable",
    body: "Keep strategy and implementation connected, communicate directly, and remain responsible through the agreed stabilization period.",
  },
  {
    number: "06",
    title: "Earn the referral",
    body: "Build the kind of system and working relationship a business owner can recommend without hesitation.",
  },
];

const referenceCriteria = [
  {
    title: "Stable",
    body: "Critical customer and lead paths have been tested in the real environment.",
  },
  {
    title: "Measurable",
    body: "Meaningful customer actions are captured well enough to guide the next decision.",
  },
  {
    title: "Documented",
    body: "Ownership, dependencies, recurring costs, operating steps, and support boundaries are clear.",
  },
  {
    title: "Ownership defined",
    body: "Account ownership, client access, recurring costs, and handoff responsibilities are documented for the agreed system.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-black text-white">
      <section className="px-6 pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
              About Dark Labs
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Plan ahead. Tell the truth. Follow through.
            </h1>
          </div>

          <div className="space-y-6 text-base leading-8 text-white/55 md:text-lg">
            <p>
              Dark Labs exists to help established businesses grow on solid
              digital ground—through custom websites, dependable lead systems,
              targeted integrations, and honest measurement built around how the
              business actually operates.
            </p>
            <p>
              The work does not begin and end with design. The offer, customer
              journey, lead delivery, account ownership, integrations,
              analytics, launch process, and long-term operating costs all
              affect whether the finished system truly supports the business. My
              job is to help make those decisions deliberately and catch
              preventable problems while they are still inexpensive to correct.
            </p>
            <p>
              When I know the answer, I will give it to you directly. When I do
              not, I will say so, find the answer, explain the tradeoff, and
              remain accountable for the work Dark Labs controls.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              The founder promise
            </p>
            <h2 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              I do not need to pretend I know everything. I do need to tell the
              truth, find the answer, and follow through on the work I accept.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-white/55">
              That standard matters most when something becomes difficult. I
              intend to earn the client&apos;s recommendation through direct
              advice, disciplined planning, careful execution, clear boundaries,
              and accountable follow-through.
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
              How the work is handled
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Conviction in the room. Discipline in the system.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
              Every business and owner is different. The truth, delivery
              standard, and responsibility do not change.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="flex min-h-64 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-7"
              >
                <p className="font-mono text-sm text-white/30">
                  {principle.number}
                </p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/50">
                    {principle.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Definition of success
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              A reference-worthy system.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              A beautiful launch is not enough. A successful Dark Labs project
              should hold up in the real business and leave the owner in
              control.
            </p>
          </div>

          <div>
            <div className="grid gap-4 md:grid-cols-2">
              {referenceCriteria.map((criterion) => (
                <article
                  key={criterion.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
                >
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    {criterion.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {criterion.body}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-8 max-w-3xl text-sm leading-7 text-white/45">
              Production ownership, access, recurring costs, dependencies, and
              handoff responsibilities are documented before launch. The account
              structure follows the written engagement. Dark Labs earns ongoing
              work through value—not artificial lock-in.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-end md:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Start with the business reality
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Bring me the business problem—even if you do not know the
              technical answer.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start a Direct Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
