import Link from "next/link";
import { notFound } from "next/navigation";

import {
  DeliverableStatus,
  MilestoneStatus,
  ProjectPriority,
  ProjectStatus,
  Visibility,
} from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import {
  formatCurrencyFromCents,
  formatDate,
  formatEnumLabel,
  toDateInputValue,
} from "@/lib/utils/format";
import {
  createProjectDeliverableAction,
  createProjectMilestoneAction,
  createProjectUpdateAction,
  updateProjectAction,
} from "@/server/actions/projects";
import {
  getClientsForProjectSelect,
  getProjectDetailForWorkspace,
} from "@/server/queries/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project Detail",
};

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const projectStatusOptions = Object.values(ProjectStatus);
const projectPriorityOptions = Object.values(ProjectPriority);
const visibilityOptions = Object.values(Visibility);
const milestoneStatusOptions = Object.values(MilestoneStatus);
const deliverableStatusOptions = Object.values(DeliverableStatus);

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const owner = await requireOwner();
  const { projectId } = await params;

  const [project, clients] = await Promise.all([
    getProjectDetailForWorkspace(owner.workspaceId, projectId),
    getClientsForProjectSelect(owner.workspaceId),
  ]);

  if (!project) {
    notFound();
  }

  const updateProject = updateProjectAction.bind(null, project.id);
  const createMilestone = createProjectMilestoneAction.bind(null, project.id);
  const createDeliverable = createProjectDeliverableAction.bind(
    null,
    project.id,
  );
  const createUpdate = createProjectUpdateAction.bind(null, project.id);

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href="/owner/projects"
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to projects
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Project
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            {project.summary || "No project summary has been written yet."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/35">
            Status
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatEnumLabel(project.status)}
          </p>
          <p className="mt-2 text-xs text-white/35">
            Budget{" "}
            {formatCurrencyFromCents(project.budgetCents, project.currency)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {[
          { label: "Milestones", value: project._count.milestones },
          { label: "Deliverables", value: project._count.deliverables },
          { label: "Updates", value: project._count.updates },
          { label: "Tasks", value: project._count.tasks },
          { label: "Notes", value: project._count.notes },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
          >
            <p className="text-sm text-white/45">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          action={updateProject}
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <h2 className="text-xl font-semibold">Project details</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Project name
              </span>
              <input
                name="name"
                required
                defaultValue={project.name}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Client
              </span>
              <select
                name="clientId"
                defaultValue={project.client?.id ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                <option value="">Internal / no client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                    {client.company ? ` — ${client.company}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Status
              </span>
              <select
                name="status"
                defaultValue={project.status}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {projectStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Priority
              </span>
              <select
                name="priority"
                defaultValue={project.priority}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {projectPriorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {formatEnumLabel(priority)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Visibility
              </span>
              <select
                name="visibility"
                defaultValue={project.visibility}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {visibilityOptions.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {formatEnumLabel(visibility)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Start date
              </span>
              <input
                name="startDate"
                type="date"
                defaultValue={toDateInputValue(project.startDate)}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Due date
              </span>
              <input
                name="dueDate"
                type="date"
                defaultValue={toDateInputValue(project.dueDate)}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Budget
              </span>
              <input
                name="budgetDollars"
                inputMode="decimal"
                defaultValue={
                  project.budgetCents === null
                    ? ""
                    : String(project.budgetCents / 100)
                }
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Currency
              </span>
              <input
                name="currency"
                defaultValue={project.currency}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>
          </div>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Owner summary
            </span>
            <textarea
              name="summary"
              defaultValue={project.summary ?? ""}
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Client-visible summary
            </span>
            <textarea
              name="clientVisibleSummary"
              defaultValue={project.clientVisibleSummary ?? ""}
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Internal notes
            </span>
            <textarea
              name="internalNotes"
              defaultValue={project.internalNotes ?? ""}
              className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Save Changes
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Milestones</h2>

            <div className="mt-5 space-y-3">
              {project.milestones.length === 0 ? (
                <p className="text-sm leading-6 text-white/45">
                  No milestones yet.
                </p>
              ) : (
                project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{milestone.title}</p>
                      <Link
                        href={`/owner/projects/${project.id}/milestones/${milestone.id}`}
                        className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-white"
                      >
                        Edit
                      </Link>
                    </div>
                    <p className="mt-2 text-sm text-white/45">
                      {formatEnumLabel(milestone.status)} · Due{" "}
                      {formatDate(milestone.dueDate)}
                    </p>
                    {milestone.description ? (
                      <p className="mt-3 text-sm leading-6 text-white/45">
                        {milestone.description}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <form action={createMilestone} className="mt-6 grid gap-3">
              <input
                name="title"
                required
                placeholder="Milestone title"
                className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <select
                  name="status"
                  defaultValue={MilestoneStatus.PLANNED}
                  className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  {milestoneStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </select>

                <select
                  name="visibility"
                  defaultValue={Visibility.CLIENT_VISIBLE}
                  className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  {visibilityOptions.map((visibility) => (
                    <option key={visibility} value={visibility}>
                      {formatEnumLabel(visibility)}
                    </option>
                  ))}
                </select>

                <input
                  name="dueDate"
                  type="date"
                  className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                />
              </div>

              <textarea
                name="description"
                placeholder="Milestone description"
                className="min-h-20 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <button
                type="submit"
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Add Milestone
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Deliverables</h2>

            <div className="mt-5 space-y-3">
              {project.deliverables.length === 0 ? (
                <p className="text-sm leading-6 text-white/45">
                  No deliverables yet.
                </p>
              ) : (
                project.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <p className="font-semibold">{deliverable.title}</p>
                    <p className="mt-2 text-sm text-white/45">
                      {formatEnumLabel(deliverable.status)} ·{" "}
                      {formatEnumLabel(deliverable.visibility)}
                    </p>
                    {deliverable.url ? (
                      <a
                        href={deliverable.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm text-white/70 hover:text-white"
                      >
                        Open deliverable →
                      </a>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <form action={createDeliverable} className="mt-6 grid gap-3">
              <input
                name="title"
                required
                placeholder="Deliverable title"
                className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <input
                name="url"
                placeholder="Optional URL"
                className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <select
                  name="status"
                  defaultValue={DeliverableStatus.DRAFT}
                  className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  {deliverableStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </select>

                <select
                  name="visibility"
                  defaultValue={Visibility.OWNER_ONLY}
                  className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  {visibilityOptions.map((visibility) => (
                    <option key={visibility} value={visibility}>
                      {formatEnumLabel(visibility)}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Deliverable description"
                className="min-h-20 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <button
                type="submit"
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Add Deliverable
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Updates</h2>

            <form action={createUpdate} className="mt-5 grid gap-3">
              <input
                name="title"
                placeholder="Optional update title"
                className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <select
                name="visibility"
                defaultValue={Visibility.CLIENT_VISIBLE}
                className="h-11 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {visibilityOptions.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {formatEnumLabel(visibility)}
                  </option>
                ))}
              </select>

              <textarea
                name="body"
                required
                placeholder="Write a project update..."
                className="min-h-24 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <button
                type="submit"
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Add Update
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {project.updates.length === 0 ? (
                <p className="text-sm leading-6 text-white/45">
                  No updates yet.
                </p>
              ) : (
                project.updates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <p className="text-sm font-semibold">
                      {update.title || "Project update"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {update.body}
                    </p>
                    <p className="mt-3 text-xs text-white/30">
                      {formatEnumLabel(update.visibility)} ·{" "}
                      {formatDate(update.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
