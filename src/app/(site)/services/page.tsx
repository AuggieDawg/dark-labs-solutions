import Link from "next/link";

import { VideoBackdrop } from "@/components/site/VideoBackdrop";

export const metadata = {
  title: "Services",
};

const servicePanels = [
  {
    id: "websites",
    number: "01",
    title: "Websites",
    description:
      "Premium public presence built to create trust and convert attention.",
    video: "/videos/services-websites.mp4",
  },
  {
    id: "automations",
    number: "02",
    title: "Automations",
    description:
      "Repeatable workflows that remove manual drag from the business.",
    video: "/videos/services-automations.mp4",
  },
  {
    id: "dashboards",
    number: "03",
    title: "Dashboards",
    description: "Owner visibility, operational metrics, and decision support.",
    video: "/videos/services-dashboards.mp4",
  },
  {
    id: "platforms",
    number: "04",
    title: "Platforms",
    description:
      "Client portals, command centers, and private operating systems.",
    video: "/videos/services-platforms.mp4",
  },
];

const serviceDetails = [
  {
    number: "01",
    title: "Websites",
    headline: "A website should be an acquisition system, not a brochure.",
    body: "Dark Labs websites are built around positioning, clarity, conversion flow, mobile performance, search-ready structure, and premium visual trust. The goal is not decoration. The goal is to make the business easier to understand, easier to trust, and easier to contact.",
    bullets: [
      "Brand and content architecture",
      "Landing pages and core service pages",
      "Conversion-focused calls to action",
      "Responsive implementation",
      "Analytics-ready structure",
    ],
  },
  {
    number: "02",
    title: "Automations",
    headline: "Manual work compounds into hidden operational cost.",
    body: "Automation should remove friction from repeated workflows: lead intake, follow-up, internal notifications, task creation, client handoff, and administrative cleanup. The strongest automations are invisible because the business simply moves faster.",
    bullets: [
      "Lead routing and intake flows",
      "Form-to-dashboard workflows",
      "Email and notification systems",
      "Internal task generation",
      "Repeatable operating procedures",
    ],
  },
  {
    number: "03",
    title: "Dashboards",
    headline: "Visibility is the first step toward control.",
    body: "Owners need to see what is happening without hunting through spreadsheets, texts, inboxes, and memory. Dashboards turn scattered business activity into a single source of truth.",
    bullets: [
      "Client and project visibility",
      "Operational KPIs",
      "Lead and pipeline tracking",
      "Project health summaries",
      "Custom internal reporting",
    ],
  },
  {
    number: "04",
    title: "Platforms",
    headline:
      "Some businesses need software built around how they actually operate.",
    body: "When off-the-shelf tools create more friction than leverage, a private operating platform can unify clients, projects, tasks, notes, documents, and future automation into one controlled system.",
    bullets: [
      "Owner command centers",
      "Client portals",
      "Project management systems",
      "Task and goal workbenches",
      "Knowledge and automation layers",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-black text-white">
      <section className="grid min-h-[calc(100vh-80px)] border-b border-white/10 lg:grid-cols-4">
        {servicePanels.map((service) => (
          <a
            key={service.id}
            href={`#${service.id}-details`}
            className="group relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <VideoBackdrop
              src={service.video}
              className="h-full min-h-[calc(100vh-80px)]"
            >
              <div className="flex min-h-[calc(100vh-80px)] flex-col justify-between px-6 py-8">
                <div className="flex items-start justify-between gap-5">
                  <p className="font-mono text-sm text-white/45">
                    {service.number}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
                    Service
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl lg:text-4xl xl:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
                    {service.description}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                      Explore
                    </span>
                    <span className="h-px w-10 bg-white/35 transition-all duration-500 group-hover:w-20" />
                  </div>
                </div>
              </div>
            </VideoBackdrop>
          </a>
        ))}
      </section>

      <section className="border-b border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Services
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Four layers of modern business infrastructure.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            The public site attracts attention. The automations reduce drag. The
            dashboards create visibility. The platform becomes the operating
            system behind the work.
          </p>
        </div>
      </section>

      <section className="divide-y divide-white/10">
        {serviceDetails.map((service) => (
          <article
            id={`${service.title.toLowerCase()}-details`}
            key={service.number}
            className="px-6 py-24 md:py-32"
          >
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="font-mono text-6xl tracking-[-0.08em] text-white/25 md:text-7xl">
                  {service.number}
                </p>
                <h2 className="mt-8 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                  {service.title}
                </h2>
              </div>

              <div>
                <h3 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">
                  {service.headline}
                </h3>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">
                  {service.body}
                </p>

                <div className="mt-10 grid gap-3 md:grid-cols-2">
                  {service.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
                    >
                      <p className="text-sm leading-6 text-white/60">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
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
