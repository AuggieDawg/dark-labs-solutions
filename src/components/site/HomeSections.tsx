import Link from "next/link";

const layers = [
  {
    number: "01",
    title: "Public Presence",
    body: "Premium websites, landing pages, positioning, conversion structure, and trust-building design.",
  },
  {
    number: "02",
    title: "Operational Systems",
    body: "Automations, dashboards, lead routing, client workflows, and internal tools built around the actual business.",
  },
  {
    number: "03",
    title: "Private Platform",
    body: "Owner command center, client portals, task workbench, knowledge layer, and long-term software infrastructure.",
  },
];

const principles = [
  "Business value before technical novelty",
  "Clear access control before private data",
  "Reusable systems over one-off hacks",
  "Design that earns trust before it asks for attention",
];

export function HomeSections() {
  return (
    <>
      <section className="border-y border-white/10 bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Operating Layers
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              The website is the front door. The system is the business.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {layers.map((layer) => (
              <article
                key={layer.number}
                className="group min-h-80 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition hover:bg-white/[0.06]"
              >
                <p className="font-mono text-5xl tracking-[-0.08em] text-white/25 transition group-hover:text-white/60">
                  {layer.number}
                </p>
                <h3 className="mt-14 text-2xl font-semibold tracking-[-0.04em]">
                  {layer.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/50">
                  {layer.body}
                </p>
              </article>
            ))}
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
              Method
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Engineer around the business reality.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              Every build should create leverage: more trust, more visibility,
              fewer manual steps, stronger client experience, and cleaner
              execution.
            </p>
          </div>

          <div className="grid gap-3">
            {principles.map((item, index) => (
              <div
                key={item}
                className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[88px_1fr]"
              >
                <p className="font-mono text-3xl tracking-[-0.08em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">
                    {item}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Dark Labs is being built as both a business and the
                    operating platform behind the business.
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
              Build the system
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Your business deserves infrastructure, not decoration.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Start a Project
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
