import Image from "next/image";
import Link from "next/link";

import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { ENGAGEMENTS } from "@/config/engagements";
import { ServiceCategory } from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Website & Client Acquisition Engagements",
  description:
    "Defined Dark Labs engagements for conversion websites, client acquisition systems, integrations, analytics, and ongoing optimization.",
};

const servicePanels = [
  {
    id: "positioning-experience",
    number: "01",
    title: "Positioning + Experience",
    description:
      "A clear offer, focused content structure, and custom customer experience built to earn the next action.",
    video: "/videos/services-websites.mp4",
  },
  {
    id: "funnels-integrations",
    number: "02",
    title: "Funnels + Integrations",
    description:
      "Lead paths and targeted connections that move qualified inquiries into the systems responsible for follow-up.",
    video: "/videos/services-automations.mp4",
  },
  {
    id: "measurement-optimization",
    number: "03",
    title: "Measurement + Optimization",
    description:
      "Conversion events, attribution, reporting, and post-launch improvement tied to meaningful business actions.",
    video: "/videos/services-dashboards.mp4",
  },
];

const capabilityDetails = [
  {
    id: "positioning-experience",
    number: "01",
    title: "Positioning + Experience",
    headline: "Make the right customer understand the value quickly.",
    body: "Dark Labs turns business strategy into a conversion-focused website experience. The work begins with the offer and customer journey, then connects messaging, information architecture, proof, interface design, mobile behavior, technical SEO, and performance into one coherent path.",
    bullets: [
      "Offer and audience clarification",
      "Conversion-focused content architecture",
      "Custom responsive interface design",
      "Service, inventory, proof, and contact paths",
      "Technical SEO and performance foundation",
    ],
  },
  {
    id: "funnels-integrations",
    number: "02",
    title: "Funnels + Integrations",
    headline: "Protect the lead after the button click.",
    body: "A conversion is not complete when a form is submitted. Dark Labs connects qualification, routing, booking, CRM, inventory, email, and notification tools where those connections reduce delay, ambiguity, or administrative drag. Existing business systems remain the source of truth unless replacement is explicitly in scope.",
    bullets: [
      "Campaign and service-specific landing paths",
      "Lead qualification and routing",
      "CRM, booking, inventory, and email connections",
      "Confirmation and follow-up workflows",
      "Integration testing and failure handling",
    ],
  },
  {
    id: "measurement-optimization",
    number: "03",
    title: "Measurement + Optimization",
    headline: "Know where the customer journey is working—and where it is not.",
    body: "Dark Labs defines meaningful conversion events, verifies data quality, and turns observed behavior into a practical improvement backlog. Reporting focuses on decisions: which pages, offers, sources, and follow-up paths deserve attention next.",
    bullets: [
      "Conversion-event and attribution plan",
      "Analytics implementation and validation",
      "Launch baseline and stabilization reporting",
      "Conversion-path analysis",
      "Prioritized experiments and improvements",
    ],
  },
];

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  [ServiceCategory.WEBSITES]: "Websites",
  [ServiceCategory.AUTOMATIONS]: "Funnels + integrations",
  [ServiceCategory.DASHBOARDS]: "Measurement",
  [ServiceCategory.PLATFORMS]: "Custom platforms",
};

async function loadShowcaseProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        showcaseEnabled: true,
      },
      orderBy: [{ showcaseSortOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        workPageEnabled: true,
        showcaseService: true,
        showcaseTitle: true,
        showcaseSummary: true,
        showcaseProblem: true,
        showcaseSolution: true,
        showcaseResults: true,
        client: {
          select: {
            name: true,
            company: true,
          },
        },
        beforeAfterAssets: {
          where: {
            publicEnabled: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            label: true,
            notes: true,
            beforeImageUrl: true,
            afterImageUrl: true,
          },
        },
      },
    });

    return {
      projects,
      unavailable: false,
    };
  } catch (error) {
    console.error("Unable to load services-page proof projects", error);

    return {
      projects: [],
      unavailable: true,
    };
  }
}

export default async function ServicesPage() {
  const { projects: showcaseProjects, unavailable: showcaseUnavailable } =
    await loadShowcaseProjects();

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
            Dark Labs engagements
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            A defined way to diagnose, build, and improve customer acquisition.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            Choose the engagement that matches the actual constraint. A website
            problem should not be sold as a software platform, and an
            operational lead-flow problem should not be reduced to a visual
            redesign.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#engagements"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Compare Engagements
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Book a Fit Call
            </Link>
          </div>
        </div>
      </section>

      <section
        id="engagements"
        className="scroll-mt-24 border-b border-white/10 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
                Products and packages
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Clear scope. Clear investment. Clear next decision.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/55">
              Published ranges are qualification ranges, not automatic quotes.
              Integration complexity, content volume, data migration, and custom
              application requirements are confirmed through discovery.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {ENGAGEMENTS.map((engagement) => (
              <article
                id={engagement.slug}
                key={engagement.slug}
                className={`scroll-mt-28 rounded-[2rem] border p-7 md:p-8 ${
                  "featured" in engagement && engagement.featured
                    ? "border-white/25 bg-white/[0.085]"
                    : "border-white/10 bg-white/[0.035]"
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

                <p className="mt-6 text-sm leading-7 text-white/52">
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

                <Link
                  href={`/contact?engagement=${encodeURIComponent(engagement.slug)}`}
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Discuss {engagement.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="divide-y divide-white/10">
        {capabilityDetails.map((service) => (
          <article
            id={`${service.id}-details`}
            key={service.id}
            className="scroll-mt-24 px-6 py-24 md:py-32"
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

      <section className="border-y border-white/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
              Selected proof
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Compact proof connected to the services it demonstrates.
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/50">
              These proof cards are published from the private Command Center.
              Full project narratives, when approved, appear on the Work page.
            </p>
          </div>

          {showcaseUnavailable ? (
            <div className="mt-12 rounded-[2rem] border border-amber-200/15 bg-amber-200/[0.04] p-8">
              <p className="text-sm font-semibold text-amber-100/80">
                Project proof is temporarily unavailable.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Service and engagement information remains available while the
                project publishing connection is restored.
              </p>
            </div>
          ) : showcaseProjects.length === 0 ? (
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8">
              <p className="text-lg font-semibold">
                The first client-approved proof cards are being prepared.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                Dark Labs publishes only the project details and media
                explicitly approved for public use.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {showcaseProjects.map((project) => {
                const asset = project.beforeAfterAssets[0];
                const clientLabel =
                  project.client?.company ??
                  project.client?.name ??
                  "Dark Labs project";

                return (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]"
                  >
                    {asset?.afterImageUrl || asset?.beforeImageUrl ? (
                      <div className="grid gap-px bg-white/10 sm:grid-cols-2">
                        {asset.beforeImageUrl ? (
                          <div className="relative aspect-[16/10] bg-black">
                            <Image
                              src={asset.beforeImageUrl}
                              alt={`${asset.label || project.name} before`}
                              fill
                              sizes="(min-width: 1024px) 25vw, 50vw"
                              className="object-cover"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                              Before
                            </span>
                          </div>
                        ) : null}
                        {asset.afterImageUrl ? (
                          <div className="relative aspect-[16/10] bg-black">
                            <Image
                              src={asset.afterImageUrl}
                              alt={`${asset.label || project.name} after`}
                              fill
                              sizes="(min-width: 1024px) 25vw, 50vw"
                              className="object-cover"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                              After
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="p-7 md:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                          {clientLabel}
                        </p>
                        {project.showcaseService ? (
                          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                            {serviceCategoryLabels[project.showcaseService]}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-5 text-3xl font-semibold tracking-[-0.045em]">
                        {project.showcaseTitle || project.name}
                      </h3>
                      {project.showcaseSummary ? (
                        <p className="mt-4 text-sm leading-7 text-white/52">
                          {project.showcaseSummary}
                        </p>
                      ) : null}

                      <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        {(
                          [
                            {
                              label: "Problem",
                              value: project.showcaseProblem,
                            },
                            {
                              label: "Solution",
                              value: project.showcaseSolution,
                            },
                            {
                              label: "Result",
                              value: project.showcaseResults,
                            },
                          ] as const
                        ).map(({ label, value }) =>
                          value ? (
                            <div
                              key={label}
                              className="border-t border-white/10 pt-4"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                                {label}
                              </p>
                              <p className="mt-3 text-sm leading-6 text-white/52">
                                {value}
                              </p>
                            </div>
                          ) : null,
                        )}
                      </div>

                      {project.workPageEnabled ? (
                        <Link
                          href={`/work#project-${project.slug || project.id}`}
                          className="mt-7 inline-flex text-sm font-semibold text-white/65 underline decoration-white/25 underline-offset-8 transition hover:text-white"
                        >
                          View full case study
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Start with the constraint
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Not sure which engagement fits? Begin with a fit call.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Book a Fit Call
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              View Selected Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
