import Link from "next/link";

import { VideoBackdrop } from "@/components/site/VideoBackdrop";

export const metadata = {
  title: "Custom Website & Analytics Services",
  description:
    "Custom websites, lead funnels, targeted integrations, and web analytics for established businesses.",
};

const servicePanels = [
  {
    id: "websites",
    number: "01",
    title: "Custom Websites",
    description:
      "Conversion-focused websites built around trust, visibility, and a clear path to contact.",
    video: "/videos/services-websites.mp4",
  },
  {
    id: "funnels-integrations",
    number: "02",
    title: "Funnels + Integrations",
    description:
      "Lead paths and targeted connections that move inquiries into the systems your business already uses.",
    video: "/videos/services-automations.mp4",
  },
  {
    id: "web-analytics",
    number: "03",
    title: "Web Analytics",
    description:
      "Conversion measurement and reporting that show what customers do after they arrive.",
    video: "/videos/services-dashboards.mp4",
  },
];

const serviceDetails = [
  {
    id: "websites",
    number: "01",
    title: "Custom Websites",
    headline: "Turn your website into a measurable acquisition system.",
    body: "Dark Labs designs and builds custom websites around the way an established business earns trust and wins customers. Each build connects positioning, customer flow, conversion paths, technical SEO, mobile performance, and measurement instead of treating the site as a digital brochure.",
    bullets: [
      "Business and customer-flow discovery",
      "Custom interface and content architecture",
      "Service or inventory funnels",
      "Mobile, SEO, and performance foundation",
      "Lead capture and conversion paths",
    ],
  },
  {
    id: "funnels-integrations",
    number: "02",
    title: "Funnels + Integrations",
    headline: "Make every inquiry easier to capture, route, and follow up.",
    body: "A useful funnel continues after the button click. Dark Labs can connect forms, inventory, booking, CRM, email, and notification tools where those connections protect the customer journey and reduce operational friction. The existing business system remains the source of truth unless replacement is explicitly part of the engagement.",
    bullets: [
      "Lead capture and routing",
      "Form, booking, CRM, or inventory connections",
      "Confirmation and follow-up paths",
      "Attribution fields and conversion events",
      "Integration testing and failure handling",
    ],
  },
  {
    id: "web-analytics",
    number: "03",
    title: "Web Analytics",
    headline: "Measure customer behavior that can guide the next decision.",
    body: "Dark Labs establishes meaningful conversion events, validates the data, and reports what is happening after launch. The goal is not to overwhelm owners with pageviews. It is to connect visibility, engagement, inquiries, and operational follow-up to a practical optimization backlog.",
    bullets: [
      "Analytics and conversion-event foundation",
      "Data-quality and attribution checks",
      "Launch baseline and 60-day reporting",
      "Conversion-path analysis",
      "Prioritized SEO and funnel recommendations",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-black text-white">
      <section className="grid min-h-[100svh] border-b border-white/10 lg:grid-cols-3">
        {servicePanels.map((service) => (
          <a
            key={service.id}
            href={`#${service.id}-details`}
            className="group relative min-h-[100svh] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <VideoBackdrop
              src={service.video}
              className="h-full min-h-[100svh]"
            >
              <div className="flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-32 md:pt-36">
                <div className="flex items-start justify-between gap-5">
                  <p className="font-mono text-sm text-white/45">
                    {service.number}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
                    Acquisition layer
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl lg:text-4xl xl:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                    {service.description}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
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
            Dark Labs services
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            One acquisition system. Three connected layers.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            The website earns attention and trust. The funnel turns interest
            into a routed inquiry. The measurement layer shows what happens next
            so the system can improve after launch.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
      </section>

      <section className="divide-y divide-white/10">
        {serviceDetails.map((service) => (
          <article
            id={`${service.id}-details`}
            key={service.id}
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

                <Link
                  href="/contact"
                  className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Discuss {service.title}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Start with the customer flow
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Ready to turn your website into a measurable acquisition system?
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
              href="/work"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              View the Repete Case Study
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
