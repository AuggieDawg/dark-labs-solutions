import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { formatDate, formatEnumLabel } from "@/lib/utils/format";
import {
  toggleProjectUpdateWorkPageAction,
  updateProjectWorkPageAction,
} from "@/server/actions/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work Page Publishing",
};

type ProjectWorkPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectWorkPage({
  params,
}: ProjectWorkPageProps) {
  const owner = await requireOwner();
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: owner.workspaceId,
    },
    include: {
      client: {
        select: {
          name: true,
          company: true,
        },
      },
      updates: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const updateWorkPage = updateProjectWorkPageAction.bind(null, project.id);
  const publicPreviewHref = `/work#project-${project.slug || project.id}`;

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href={`/owner/projects/${project.id}`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to project
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Public proof
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Work page publishing
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/55">
            Build the complete project privately, then choose the exact
            case-study copy and project updates that Dark Labs can publish.
            Internal notes, budgets, tasks, client-only material, and project
            images never render on the public Work page.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={publicPreviewHref}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-white/90"
          >
            Preview Work Page
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold">
              {project.workPageEnabled
                ? "Published on the Work page"
                : "Private — not shown on the Work page"}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {project.workPublishedAt
                ? `Published ${formatDate(project.workPublishedAt)}`
                : "Enable publishing only after the client-approved public content is ready."}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              project.workPageEnabled
                ? "bg-emerald-400/15 text-emerald-200"
                : "bg-white/[0.06] text-white/45"
            }`}
          >
            {project.workPageEnabled ? "Live" : "Draft"}
          </span>
        </div>
      </div>

      <form
        action={updateWorkPage}
        className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
      >
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Public case study</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Only the fields in this section are used as project copy on the
              public Work page.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
            <input
              name="workPageEnabled"
              type="checkbox"
              defaultChecked={project.workPageEnabled}
              className="h-4 w-4 accent-white"
            />
            <span className="text-sm font-semibold">
              Show project on Work page
            </span>
          </label>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Public title
            </span>
            <input
              name="workTitle"
              defaultValue={project.workTitle ?? project.name}
              placeholder={project.name}
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Public client label
            </span>
            <input
              name="workClientLabel"
              defaultValue={
                project.workClientLabel ??
                project.client?.company ??
                project.client?.name ??
                ""
              }
              placeholder="Repete Auto"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Live website URL
            </span>
            <input
              name="workWebsiteUrl"
              type="url"
              defaultValue={project.workWebsiteUrl ?? ""}
              placeholder="https://example.com"
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Display order
            </span>
            <input
              name="workSortOrder"
              type="number"
              defaultValue={project.workSortOrder}
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
            />
          </label>
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Short summary
          </span>
          <textarea
            name="workSummary"
            defaultValue={project.workSummary ?? ""}
            placeholder="The concise result a prospective client should understand first."
            className="min-h-24 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </label>

        <label className="mt-5 grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Case-study description
          </span>
          <textarea
            name="workDescription"
            defaultValue={project.workDescription ?? ""}
            placeholder="Describe the engagement and what Dark Labs was responsible for."
            className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </label>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {[
            {
              name: "workChallenge",
              label: "Challenge",
              value: project.workChallenge,
              placeholder: "What was not working before?",
            },
            {
              name: "workSolution",
              label: "Solution",
              value: project.workSolution,
              placeholder: "What did Dark Labs build or integrate?",
            },
            {
              name: "workOutcome",
              label: "Outcome",
              value: project.workOutcome,
              placeholder: "What changed after launch?",
            },
          ].map((field) => (
            <label key={field.name} className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                {field.label}
              </span>
              <textarea
                name={field.name}
                defaultValue={field.value ?? ""}
                placeholder={field.placeholder}
                className="min-h-36 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Save Work Page Settings
          </button>
        </div>
      </form>

      <div className="mt-6">
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Public updates and comments
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Select individual project updates that help tell the public story.
              Their existing owner/client visibility does not make them public.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {project.updates.length === 0 ? (
              <p className="text-sm text-white/40">
                Add project updates from the project overview first.
              </p>
            ) : (
              project.updates.map((update) => {
                const toggleUpdate = toggleProjectUpdateWorkPageAction.bind(
                  null,
                  project.id,
                  update.id,
                );

                return (
                  <article
                    key={update.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {update.title || "Project update"}
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/50">
                          {update.body}
                        </p>
                        <p className="mt-3 text-xs text-white/30">
                          {formatEnumLabel(update.visibility)} ·{" "}
                          {formatDate(update.createdAt)}
                        </p>
                      </div>
                      <form action={toggleUpdate}>
                        <button
                          type="submit"
                          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                            update.showOnWorkPage
                              ? "bg-emerald-400/15 text-emerald-200"
                              : "border border-white/10 text-white/55 hover:text-white"
                          }`}
                        >
                          {update.showOnWorkPage ? "Public" : "Make Public"}
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
