import Link from "next/link";
import { notFound } from "next/navigation";

import { MilestoneStatus, Visibility } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { formatEnumLabel, toDateInputValue } from "@/lib/utils/format";
import { updateProjectMilestoneAction } from "@/server/actions/projects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Milestone",
};

type MilestoneEditPageProps = {
  params: Promise<{
    projectId: string;
    milestoneId: string;
  }>;
};

const milestoneStatusOptions = Object.values(MilestoneStatus);
const visibilityOptions = Object.values(Visibility);

export default async function MilestoneEditPage({
  params,
}: MilestoneEditPageProps) {
  const owner = await requireOwner();
  const { projectId, milestoneId } = await params;

  const milestone = await prisma.projectMilestone.findFirst({
    where: {
      id: milestoneId,
      projectId,
      project: {
        workspaceId: owner.workspaceId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!milestone) {
    notFound();
  }

  const updateMilestone = updateProjectMilestoneAction.bind(null, milestone.id);

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href={`/owner/projects/${milestone.project.id}`}
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to project
      </Link>

      <div className="mt-8 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Edit Milestone
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          {milestone.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          Project: {milestone.project.name}
        </p>

        <form
          action={updateMilestone}
          className="mt-10 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Milestone title
            </span>
            <input
              name="title"
              required
              defaultValue={milestone.title}
              className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Status
              </span>
              <select
                name="status"
                defaultValue={milestone.status}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              >
                {milestoneStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatEnumLabel(status)}
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
                defaultValue={milestone.visibility}
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
                Due date
              </span>
              <input
                name="dueDate"
                type="date"
                defaultValue={toDateInputValue(milestone.dueDate)}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Description
            </span>
            <textarea
              name="description"
              defaultValue={milestone.description ?? ""}
              className="min-h-36 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
