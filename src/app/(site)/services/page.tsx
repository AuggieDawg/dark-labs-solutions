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
    "Defined founder-led engagements for custom websites, lead systems, integrations, honest analytics, client ownership, and controlled launches.",
};

const servicePanels = [
  {
    id: "positioning-experience",
    number: "01",
    title: "Custom Websites",
    description:
      "Custom strategy, design, and development that make the business easier to understand, trust, find, and contact.",
    video: "/videos/services-websites.mp4",
  },
  {
    id: "funnels-integrations",
    number: "02",
    title: "Funnels + Integrations",
    description:
      "Dependable paths that qualify inquiries and connect them to the people and systems responsible for follow-up.",
    video: "/videos/services-automations.mp4",
  },
  {
    id: "measurement-optimization",
    number: "03",
    title: "Web Analytics + Improvement",
    description:
      "Verified conversion events, practical reporting, and measured improvements tied to meaningful customer actions.",
    video: "/videos/services-dashboards.mp4",
  },
];

const capabilityDetails = [
  {
    id: "positioning-experience",
    number: "01",
    title: "Custom Websites",
    headline: "Make the business look as capable online as it is in real life.",
    body: "A strong website should do more than impress people. It should communicate the offer clearly, answer the questions that create hesitation, establish credibility, perform reliably on mobile, support search visibility, and give the right customer a confident next step.",
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
    title: "Web Analytics + Improvement",
    headline: "Measure the actions that matter, then decide with evidence.",
    body: "Dark Labs defines and verifies meaningful conversion events, establishes a credible launch baseline, and turns customer behavior into a practical improvement backlog. Reporting is built to answer what deserves attention next—not merely to produce impressive-looking traffic numbers.",
    bullets: [
      "Conversion-event and attribution plan",
      "Analytics implementation and validation",
      "Launch baseline and stabilization reporting",
      "Conversion-path analysis",
      "Prioritized experiments and improvements",
    ],
  },
];

const foundationStandards = [
  {
    title: "Ownership is defined",
    body: "Production ownership, client access, recurring costs, and handoff responsibilities are documented for the agreed engagement.",
  },
  {
    title: "Costs are visible",
    body: "Recurring services, vendor dependencies, renewal responsibility, and likely usage costs are identified before they become surprises.",
  },
  {
    title: "Unknowns are recorded",
    body: "Assumptions and unanswered questions are named, assigned a verification path, and kept out of critical decisions until confirmed.",
  },
  {
    title: "Included paths are tested",
    body: "The critical lead, notification, integration, mobile, analytics, and recovery paths included in the engagement are tested before release.",
  },
  {
    title: "Launch is controlled",
    body: "Acceptance criteria, production checks, monitoring, rollback decisions, and stabilization responsibilities are agreed before release.",
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
            How Dark Labs helps
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Build the foundation first. Then connect, measure, and improve it.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            The right engagement depends on where the business is losing
            strength: clarity, trust, lead flow, follow-up, or visibility. Dark
            Labs diagnoses the constraint before prescribing the work. A website
            problem should not be sold as a software platform, and a broken
            process should not be reduced to a visual redesign.
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
              Talk Through the Problem
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
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/35">
                Core implementation standards
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Premium work is visible in the decisions nobody sees on launch
                day.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/55">
              A polished interface cannot compensate for unclear ownership,
              hidden recurring costs, unreliable lead delivery, or an untested
              release. Dark Labs applies these standards to the systems and
              critical paths included in the written engagement.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {foundationStandards.map((standard) => (
              <article
                key={standard.title}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {standard.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/50">
                  {standard.body}
                </p>
              </article>
            ))}
          </div>
        </div>
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
              Bring me the real business problem. I will help determine the
              right system.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
              View Selected Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
