import Link from "next/link";

import { ProjectPriority, ProjectStatus, Visibility } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { formatEnumLabel } from "@/lib/utils/format";
import { createProjectAction } from "@/server/actions/projects";
import { getClientsForProjectSelect } from "@/server/queries/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Project",
};

type NewProjectPageProps = {
  searchParams?: Promise<{
    clientId?: string;
  }>;
};

const statusOptions = Object.values(ProjectStatus);
const priorityOptions = Object.values(ProjectPriority);
const visibilityOptions = Object.values(Visibility);

export default async function NewProjectPage({
  searchParams,
}: NewProjectPageProps) {
  const owner = await requireOwner();
  const clients = await getClientsForProjectSelect(owner.workspaceId);
  const params = searchParams ? await searchParams : {};
  const selectedClientId = params.clientId ?? "";

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href="/owner/projects"
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to projects
      </Link>

      <div className="mt-8 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Delivery Layer
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          New Project
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          Create a client project, internal build, or platform initiative.
          Milestones, deliverables, tasks, and updates will attach here.
        </p>

        <form
          action={createProjectAction}
          className="mt-10 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Project name
              </span>
              <input
                name="name"
                required
                placeholder="Dark Labs homepage rebuild"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Client
              </span>
              <select
                name="clientId"
                defaultValue={selectedClientId}
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
                defaultValue={ProjectStatus.DISCOVERY}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {statusOptions.map((status) => (
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
                defaultValue={ProjectPriority.MEDIUM}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {priorityOptions.map((priority) => (
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
                defaultValue={Visibility.OWNER_ONLY}
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
                placeholder="7500"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Currency
              </span>
              <input
                name="currency"
                defaultValue="USD"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Owner summary
            </span>
            <textarea
              name="summary"
              placeholder="What is this project?"
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Client-visible summary
            </span>
            <textarea
              name="clientVisibleSummary"
              placeholder="What should a client be allowed to see?"
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Internal notes
            </span>
            <textarea
              name="internalNotes"
              placeholder="Private strategy, constraints, next moves..."
              className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
