import Link from "next/link";

import { CaseFileViewer } from "@/components/site/CaseFileViewer";
import { prisma } from "@/lib/db/prisma";
import { getPrimaryWorkspaceSlug } from "@/lib/env/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Selected Work",
  description:
    "Public Dark Labs case studies covering conversion websites, lead systems, integrations, launch controls, and measurable improvements.",
};

async function loadPublishedProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        workPageEnabled: true,
        workTitle: {
          not: null,
        },
        workspace: {
          slug: getPrimaryWorkspaceSlug(),
        },
      },
      orderBy: [{ workSortOrder: "asc" }, { workPublishedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        workTitle: true,
        workClientLabel: true,
        workSummary: true,
        workDescription: true,
        workChallenge: true,
        workSolution: true,
        workOutcome: true,
        workWebsiteUrl: true,
        beforeAfterAssets: {
          where: {
            publicEnabled: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            label: true,
            notes: true,
            beforeImageUrl: true,
            afterImageUrl: true,
          },
        },
        updates: {
          where: {
            showOnWorkPage: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            title: true,
            body: true,
          },
        },
      },
    });

    const publishableProjects = projects.filter(
      (project): project is typeof project & { workTitle: string } =>
        Boolean(project.workTitle?.trim()),
    );

    return {
      projects: publishableProjects,
      unavailable: false,
    };
  } catch (error) {
    console.error("Unable to load public Work page projects", error);

    return {
      projects: [],
      unavailable: true,
    };
  }
}

export default async function WorkPage() {
  const { projects, unavailable } = await loadPublishedProjects();

  return (
    <main className="bg-black text-white">
      <section className="px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Work worth standing behind
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            The business problem, the system built, and the proof intentionally
            published.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            Dark Labs publishes the reasoning behind the work—not inflated
            claims or private client data. Results appear only when the
            underlying measurement is credible and the material has been
            explicitly selected for the public story.
          </p>
        </div>
      </section>

      {unavailable ? (
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-200/15 bg-amber-200/[0.04] p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-100/55">
              Publishing connection unavailable
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
              The case-study library is temporarily unavailable.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
              The public site remains operational while the project publishing
              connection is restored. No private Command Center data is exposed
              by this fallback.
            </p>
          </div>
        </section>
      ) : projects.length === 0 ? (
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Case studies
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
              The first public project stories are being prepared.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
              Projects remain private by default. A case study appears here only
              after its public copy, media, and selected updates are explicitly
              enabled in the Command Center.
            </p>
          </div>
        </section>
      ) : (
        <div className="border-t border-white/10">
          {projects.map((project, projectIndex) => {
            const projectAnchor = `project-${project.slug || project.id}`;
            const storySections = [
              {
                number: "01",
                label: "Business constraint",
                body: project.workChallenge,
              },
              {
                number: "02",
                label: "System built",
                body: project.workSolution,
              },
              {
                number: "03",
                label: "Approved evidence",
                body: project.workOutcome,
              },
            ].filter((item) => Boolean(item.body));
            const caseIndex = [
              {
                label: "Overview",
                href: `#${projectAnchor}-overview`,
              },
              ...(project.beforeAfterAssets.length > 0
                ? [
                    {
                      label: "Visual proof",
                      href: `#${projectAnchor}-proof`,
                    },
                  ]
                : []),
              ...(storySections.length > 0
                ? [
                    {
                      label: "Reasoning",
                      href: `#${projectAnchor}-reasoning`,
                    },
                  ]
                : []),
              ...(project.updates.length > 0
                ? [
                    {
                      label: "Field notes",
                      href: `#${projectAnchor}-notes`,
                    },
                  ]
                : []),
            ];

            return (
              <article
                key={project.id}
                id={projectAnchor}
                className="scroll-mt-24 border-b border-white/10 px-6 py-24 md:py-32"
              >
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.32fr_1.68fr] lg:gap-16">
                  <aside className="lg:sticky lg:top-28 lg:self-start">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/52">
                      Case file
                    </p>
                    <p
                      aria-hidden="true"
                      className="mt-4 font-mono text-6xl tracking-[-0.1em] text-white/18"
                    >
                      {String(projectIndex + 1).padStart(2, "0")}
                    </p>
                    {project.workClientLabel ? (
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/48">
                        {project.workClientLabel}
                      </p>
                    ) : null}

                    <nav
                      aria-label={`Sections in the ${project.workTitle} case file`}
                      className="mt-8 overflow-x-auto pb-2 lg:overflow-visible lg:pb-0"
                    >
                      <ol className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col lg:gap-1">
                        {caseIndex.map((item, index) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              className="flex min-h-11 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 text-xs font-semibold text-white/48 transition hover:border-white/14 hover:bg-white/[0.05] hover:text-white/78 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              <span
                                aria-hidden="true"
                                className="font-mono text-[10px] tracking-[0.16em] text-white/36"
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </aside>

                  <div className="min-w-0">
                    <section
                      id={`${projectAnchor}-overview`}
                      className="scroll-mt-28"
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/52">
                        Story / evidence
                      </p>
                      <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
                        {project.workTitle}
                      </h2>
                      {project.workSummary ? (
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">
                          {project.workSummary}
                        </p>
                      ) : null}
                      {project.workDescription ? (
                        <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/48 md:text-base md:leading-8">
                          {project.workDescription}
                        </p>
                      ) : null}

                      {project.workWebsiteUrl ? (
                        <a
                          href={project.workWebsiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                        >
                          Visit Live Website ↗
                        </a>
                      ) : null}
                    </section>

                    {project.beforeAfterAssets.length > 0 ? (
                      <CaseFileViewer
                        projectTitle={project.workTitle}
                        assets={project.beforeAfterAssets}
                        sectionId={`${projectAnchor}-proof`}
                      />
                    ) : null}

                    {storySections.length > 0 ? (
                      <section
                        id={`${projectAnchor}-reasoning`}
                        className="mt-16 scroll-mt-28"
                      >
                        <div className="border-y border-white/10 py-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/52">
                            The reasoning behind the work
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white/88">
                            The constraint, the system, and what can honestly be
                            shown.
                          </h3>
                        </div>

                        <ol className="divide-y divide-white/10 border-b border-white/10">
                          {storySections.map((section) => (
                            <li
                              key={section.label}
                              className="grid gap-6 py-8 md:grid-cols-[8rem_1fr] md:gap-10"
                            >
                              <div>
                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                                  Frame {section.number}
                                </p>
                                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/58">
                                  {section.label}
                                </p>
                              </div>
                              <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-white/56 md:text-base md:leading-8">
                                {section.body}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </section>
                    ) : null}

                    {project.updates.length > 0 ? (
                      <section
                        id={`${projectAnchor}-notes`}
                        className="mt-16 scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 md:p-8"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
                          Selected implementation notes
                        </p>
                        <div className="mt-6 grid gap-4 xl:grid-cols-2">
                          {project.updates.map((update) => (
                            <blockquote
                              key={update.id}
                              className="rounded-3xl border border-white/10 bg-black/35 p-6"
                            >
                              {update.title ? (
                                <p className="text-sm font-semibold text-white/75">
                                  {update.title}
                                </p>
                              ) : null}
                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/50">
                                {update.body}
                              </p>
                            </blockquote>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Your project
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              Let&apos;s build a system we will both be proud to put our names
              behind.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Talk to Agustin
          </Link>
        </div>
      </section>
    </main>
  );
}
