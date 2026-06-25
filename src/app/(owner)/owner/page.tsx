export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";
import { requireOwner } from "@/lib/auth/require";

export const metadata = {
  title: "Command Center",
};

export default async function OwnerDashboardPage() {
  const owner = await requireOwner();

  const [clients, projects, tasks, goals, notes] = await Promise.all([
    prisma.client.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.project.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.task.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.goal.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.note.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
  ]);

  const cards = [
    {
      label: "Clients",
      value: clients,
      detail: "Client CRM module comes next.",
    },
    {
      label: "Projects",
      value: projects,
      detail: "Project tracking will connect here.",
    },
    {
      label: "Tasks",
      value: tasks,
      detail: "Workbench execution layer is planned.",
    },
    {
      label: "Goals",
      value: goals,
      detail: "Personal and business goals will live here.",
    },
    {
      label: "Notes",
      value: notes,
      detail: "Knowledge layer and memory system.",
    },
  ];

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Owner Only
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          Dark Labs Command Center
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          This is now protected by Google authentication, owner email
          authorization, and workspace membership. It will become the private
          operating layer for clients, projects, tasks, goals, notes, and future
          automation.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30"
            >
              <p className="text-sm text-white/45">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
          <h2 className="text-lg font-semibold">Next engineering milestone</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Build the first real owner modules: clients, projects, tasks, and
            goals. The dashboard is already reading live workspace-scoped counts
            from Postgres.
          </p>
        </div>
      </div>
    </section>
  );
}
