import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { getPrimaryWorkspaceSlug } from "@/lib/env/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Selected Work",
  description:
    "Client-approved Dark Labs case studies covering conversion websites, lead systems, integrations, launch controls, and measurable improvements.",
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
            Selected work
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            The business problem, the system built, and the proof approved for
            public use.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            Dark Labs publishes the reasoning behind the work—not inflated
            claims or private client data. Results appear only when the
            underlying measurement is credible and the client has approved the
            public story.
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
              The first client-approved project stories are being prepared.
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
            const storySections = [
              { label: "Challenge", body: project.workChallenge },
              { label: "System", body: project.workSolution },
              { label: "Outcome", body: project.workOutcome },
            ].filter((item) => item.body);

            return (
              <article
                key={project.id}
                className="scroll-mt-24 border-b border-white/10 px-6 py-24 md:py-32"
              >
                <div className="mx-auto max-w-7xl">
                  <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
                    <div>
                      <p className="font-mono text-sm text-white/30">
                        {String(projectIndex + 1).padStart(2, "0")}
                      </p>
                      {project.workClientLabel ? (
                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/38">
                          {project.workClientLabel}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
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
                    </div>
                  </div>

                  {project.beforeAfterAssets.length > 0 ? (
                    <section className="mt-16">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/32">
                            Selected visual proof
                          </p>
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
                            Only media explicitly marked public in the Command
                            Center is rendered here.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5">
                        {project.beforeAfterAssets.map((asset) => (
                          <figure
                            key={asset.id}
                            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]"
                          >
                            <div
                              className={`grid gap-px bg-white/10 ${
                                asset.beforeImageUrl && asset.afterImageUrl
                                  ? "lg:grid-cols-2"
                                  : ""
                              }`}
                            >
                              {asset.beforeImageUrl ? (
                                <div className="relative aspect-[16/10] bg-black">
                                  <Image
                                    src={asset.beforeImageUrl}
                                    alt={`${asset.label || project.workTitle} before`}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
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
                                    alt={`${asset.label || project.workTitle} after`}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                  />
                                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                                    After
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {asset.label || asset.notes ? (
                              <figcaption className="p-6">
                                {asset.label ? (
                                  <p className="text-sm font-semibold text-white/75">
                                    {asset.label}
                                  </p>
                                ) : null}
                                {asset.notes ? (
                                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/45">
                                    {asset.notes}
                                  </p>
                                ) : null}
                              </figcaption>
                            ) : null}
                          </figure>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {storySections.length > 0 ? (
                    <div className="mt-16 grid gap-4 lg:grid-cols-3">
                      {storySections.map((section) => (
                        <section
                          key={section.label}
                          className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/32">
                            {section.label}
                          </p>
                          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/55">
                            {section.body}
                          </p>
                        </section>
                      ))}
                    </div>
                  ) : null}

                  {project.updates.length > 0 ? (
                    <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 md:p-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/32">
                        Selected implementation notes
                      </p>
                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
              Build the next system worth documenting.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Book a Fit Call
          </Link>
        </div>
      </section>
    </main>
  );
}
