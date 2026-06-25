import Link from "next/link";

import { ProjectStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import {
  formatCurrencyFromCents,
  formatDate,
  formatEnumLabel,
} from "@/lib/utils/format";
import {
  isProjectStatus,
  listProjectsForWorkspace,
} from "@/server/queries/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
};

type OwnerProjectsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

const statusOptions = Object.values(ProjectStatus);

export default async function OwnerProjectsPage({
  searchParams,
}: OwnerProjectsPageProps) {
  const owner = await requireOwner();
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim() ?? "";
  const status = isProjectStatus(params.status) ? params.status : "";

  const projects = await listProjectsForWorkspace({
    workspaceId: owner.workspaceId,
    q,
    status,
  });

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Owner Only
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Projects
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            Track client work, internal builds, deliverables, milestones,
            visibility, budgets, and delivery status.
          </p>
        </div>

        <Link
          href="/owner/projects/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          New Project
        </Link>
      </div>

      <form
        action="/owner/projects"
        className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_220px_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search projects, clients, summaries..."
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
        />

        <select
          name="status"
          defaultValue={status}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
        >
          <option value="">All statuses</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {formatEnumLabel(item)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025]">
        {projects.length === 0 ? (
          <div className="p-8">
            <p className="text-lg font-semibold">No projects found.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Create the first project to connect client relationships to real
              delivery work.
            </p>
            <Link
              href="/owner/projects/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create first project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/owner/projects/${project.id}`}
                className="grid gap-4 p-5 transition hover:bg-white/[0.035] xl:grid-cols-[1.15fr_0.85fr_0.75fr_0.75fr_0.7fr]"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    {project.name}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {project.client?.name || "Internal / no client"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Status
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatEnumLabel(project.status)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Priority
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatEnumLabel(project.priority)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Budget
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatCurrencyFromCents(
                      project.budgetCents,
                      project.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Due
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatDate(project.dueDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
