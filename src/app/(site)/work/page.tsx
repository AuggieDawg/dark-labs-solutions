import Link from "next/link";

import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
  description:
    "Selected Dark Labs website, automation, dashboard, and platform case studies.",
};

export default async function WorkPage() {
  const projects = await prisma.project.findMany({
    where: {
      workPageEnabled: true,
    },
    orderBy: [{ workSortOrder: "asc" }, { workPublishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      workTitle: true,
      workClientLabel: true,
      workSummary: true,
      workDescription: true,
      workChallenge: true,
      workSolution: true,
      workOutcome: true,
      workWebsiteUrl: true,
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

  return (
    <main className="bg-black text-white">
      <section className="px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Selected work
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Real systems built around real businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Each project documents the problem, the system Dark Labs built, and
            the client-approved proof that can be shared publicly.
          </p>
        </div>
      </section>

      {projects.length === 0 ? (
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Case studies
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
              Client-approved project stories are being prepared.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
              Dark Labs publishes a project here only after its public copy and
              media have been selected in the Command Center.
            </p>
          </div>
        </section>
      ) : (
        <div className="border-t border-white/10">
          {projects.map((project, projectIndex) => {
            const projectId = `project-${project.slug || project.id}`;
            const storySections = [
              { label: "Challenge", body: project.workChallenge },
              { label: "Solution", body: project.workSolution },
              { label: "Outcome", body: project.workOutcome },
            ].filter((item) => item.body);

            return (
              <article
                id={projectId}
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
                        {project.workTitle || project.name}
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
                        Selected project notes
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
              Build the next measurable business system.
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
