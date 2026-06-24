import Link from "next/link";

export const metadata = {
  title: "Services",
};

const serviceChapters = [
  {
    id: "websites",
    number: "01",
    eyebrow: "Websites",
    title: "Your digital front door should sell, not sit there.",
    body: "Premium websites, landing pages, content architecture, responsive design, conversion flow, and SEO-ready structure.",
    cta: "Build the public layer",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.82)), radial-gradient(circle at 40% 20%, rgba(255,255,255,0.22), transparent 26%), linear-gradient(135deg, #1a1d22 0%, #08090c 55%, #000 100%)",
  },
  {
    id: "automations",
    number: "02",
    eyebrow: "Automations",
    title: "Manual work is invisible drag on the business.",
    body: "Lead routing, form workflows, notifications, admin reduction, CRM handoffs, inbox cleanup, and repeatable operating procedures.",
    cta: "Remove the friction",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.84)), radial-gradient(circle at 70% 25%, rgba(120,130,255,0.28), transparent 30%), linear-gradient(135deg, #111827 0%, #06070a 55%, #000 100%)",
  },
  {
    id: "dashboards",
    number: "03",
    eyebrow: "Dashboards",
    title: "Visibility turns chaos into decisions.",
    body: "Owner dashboards, project views, lead tracking, operational metrics, reporting systems, and internal tools built around the numbers that matter.",
    cta: "See the system",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.86)), radial-gradient(circle at 50% 35%, rgba(255,255,255,0.18), transparent 24%), linear-gradient(135deg, #171717 0%, #070707 60%, #000 100%)",
  },
  {
    id: "platforms",
    number: "04",
    eyebrow: "Platforms",
    title: "Build the machine behind the business.",
    body: "Client portals, private dashboards, project systems, task workbenches, knowledge layers, and long-term custom software infrastructure.",
    cta: "Engineer the platform",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.88)), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.20), transparent 26%), linear-gradient(135deg, #242018 0%, #090806 55%, #000 100%)",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-black text-white">
      <section className="relative border-b border-white/10 px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.13), transparent 34%), linear-gradient(180deg, #07070a 0%, #000 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Services
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Systems built for serious operators.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Dark Labs builds the layers modern businesses need: the public
            presence, the automated workflows, the dashboards, and the private
            operating platform behind it all.
          </p>
        </div>
      </section>

      <section className="grid border-b border-white/10 lg:grid-cols-4">
        {serviceChapters.map((chapter) => (
          <article
            id={chapter.id}
            key={chapter.id}
            className="group relative min-h-[78vh] overflow-hidden border-b border-white/10 px-6 py-8 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            style={{ background: chapter.background }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12] transition duration-700 group-hover:opacity-[0.22]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative z-10 flex min-h-[calc(78vh-4rem)] flex-col">
              <div className="flex items-start justify-between gap-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
                  {chapter.eyebrow}
                </p>
                <p className="font-mono text-xs text-white/35">SOUND OFF</p>
              </div>

              <div className="mt-auto">
                <p className="font-mono text-6xl font-light tracking-[-0.08em] text-white/70 md:text-7xl">
                  {chapter.number}
                </p>
                <h2 className="mt-6 max-w-sm text-3xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-4xl">
                  {chapter.title}
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-6 text-white/52">
                  {chapter.body}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                    {chapter.cta}
                  </span>
                  <span className="h-px w-12 bg-white/35 transition group-hover:w-20" />
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                  Scroll
                </p>
                <p className="font-mono text-xs text-white/30">
                  {chapter.number} / 04
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-white/35">
              Operating Principle
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Do not buy isolated tools. Build the system.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Discovery before implementation",
              "Business value before technical novelty",
              "Clear ownership and access control",
              "Reusable systems over one-off hacks",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <p className="text-sm leading-6 text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Ready
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Need a system, not just a site?
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </main>
  );
}
