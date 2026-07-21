export const dynamic = "force-dynamic";

import Link from "next/link";

import { ProjectStatus, ProspectStatus, TaskStatus } from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";
import { requireOwner } from "@/lib/auth/require";
import { formatEnumLabel, formatTimestamp } from "@/lib/utils/format";
import { getLeadDashboardForWorkspace } from "@/server/queries/leads";

export const metadata = {
  title: "Command Center",
};

export default async function OwnerDashboardPage() {
  const owner = await requireOwner();

  const [
    leadDashboard,
    clients,
    activeProspects,
    prospectFollowUpsDue,
    projects,
    activeProjects,
    tasks,
    openTasks,
    goals,
    notes,
    publishedWork,
    recentActivity,
  ] = await Promise.all([
    getLeadDashboardForWorkspace(owner.workspaceId),
    prisma.client.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.prospect.count({
      where: {
        workspaceId: owner.workspaceId,
        status: {
          in: [
            ProspectStatus.TO_CONTACT,
            ProspectStatus.CONTACTED,
            ProspectStatus.ENGAGED,
            ProspectStatus.QUALIFIED,
          ],
        },
      },
    }),
    prisma.prospect.count({
      where: {
        workspaceId: owner.workspaceId,
        status: {
          in: [
            ProspectStatus.TO_CONTACT,
            ProspectStatus.CONTACTED,
            ProspectStatus.ENGAGED,
            ProspectStatus.QUALIFIED,
          ],
        },
        nextFollowUpAt: {
          lte: new Date(),
        },
      },
    }),
    prisma.project.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.project.count({
      where: {
        workspaceId: owner.workspaceId,
        status: {
          in: [
            ProjectStatus.DISCOVERY,
            ProjectStatus.ACTIVE,
            ProjectStatus.REVIEW,
          ],
        },
      },
    }),
    prisma.task.count({
      where: {
        workspaceId: owner.workspaceId,
      },
    }),
    prisma.task.count({
      where: {
        workspaceId: owner.workspaceId,
        status: {
          notIn: [TaskStatus.DONE, TaskStatus.ARCHIVED],
        },
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
    prisma.project.count({
      where: {
        workspaceId: owner.workspaceId,
        workPageEnabled: true,
      },
    }),
    prisma.activityLog.findMany({
      where: {
        workspaceId: owner.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        action: true,
        summary: true,
        entityType: true,
        createdAt: true,
      },
    }),
  ]);

  const cards = [
    {
      label: "Clients",
      value: clients,
      detail: "Business workspaces",
      href: "/owner/clients",
    },
    {
      label: "Active prospects",
      value: activeProspects,
      detail: `${prospectFollowUpsDue} follow-up${prospectFollowUpsDue === 1 ? "" : "s"} due`,
      href: "/owner/prospects",
    },
    {
      label: "Active projects",
      value: activeProjects,
      detail: `${projects} total projects`,
      href: "/owner/projects",
    },
    {
      label: "Open tasks",
      value: openTasks,
      detail: `${tasks} total tasks`,
      href: "/owner/tasks",
    },
    {
      label: "Published work",
      value: publishedWork,
      detail: "Public case studies",
      href: "/work",
    },
    {
      label: "Knowledge",
      value: notes + goals,
      detail: `${notes} notes · ${goals} goals`,
      href: "/owner/notes",
    },
  ];

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
              Owner workspace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Dark Labs Command Center
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/55">
              Operate sales intake, client relationships, delivery, execution,
              business goals, internal knowledge, and public proof from one
              workspace. Every record is scoped to the authenticated Dark Labs
              workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/owner/prospects/new"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              New Prospect
            </Link>
            <Link
              href="/owner/clients/new"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              New Client
            </Link>
            <Link
              href="/owner/projects/new"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              New Project
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-300/[0.09] to-white/[0.02] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                  Sales inbox
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Act on the next conversation.
                </h2>
              </div>
              <Link
                href="/owner/leads"
                className="text-sm font-semibold text-white/55 transition hover:text-white"
              >
                All leads →
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "New website leads",
                  value: leadDashboard.newCount,
                  href: "/owner/leads?status=NEW",
                },
                {
                  label: "Lead follow-ups due",
                  value: leadDashboard.followUpsDue,
                  href: "/owner/leads?followUp=due",
                },
                {
                  label: "Prospect follow-ups due",
                  value: prospectFollowUpsDue,
                  href: "/owner/prospects?followUp=due",
                },
                {
                  label: "Notification failures",
                  value: leadDashboard.failedNotifications,
                  href: "/owner/leads?notification=failed",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:bg-white/[0.07]"
                >
                  <p className="text-xs leading-5 text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                </Link>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-white/32">
              {leadDashboard.total} total persisted lead
              {leadDashboard.total === 1 ? "" : "s"}. Email is a notification;
              the Command Center remains the source of truth.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
              Recent leads
            </p>
            <div className="mt-5 divide-y divide-white/10">
              {leadDashboard.recent.length === 0 ? (
                <p className="py-4 text-sm leading-6 text-white/45">
                  Persisted website inquiries will appear here.
                </p>
              ) : (
                leadDashboard.recent.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/owner/leads/${lead.id}`}
                    className="grid gap-2 py-3 transition hover:bg-white/[0.025] sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white/72">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="mt-1 text-xs text-white/38">
                        {lead.businessName} · {lead.reference}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                        {formatEnumLabel(lead.status)}
                      </p>
                      <p className="mt-1 text-xs text-white/28">
                        {formatTimestamp(lead.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 transition hover:border-white/20 hover:bg-white/[0.065]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-white/45">{card.label}</p>
                <span className="text-sm text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60">
                  →
                </span>
              </div>
              <p className="mt-4 text-4xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-white/45">
                {card.detail}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
              Operating shortcuts
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              Move from intake to proof without leaving the workspace.
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                {
                  label: "Work outbound prospects",
                  href: "/owner/prospects",
                },
                {
                  label: "Work the lead inbox",
                  href: "/owner/leads",
                },
                {
                  label: "Review client accounts",
                  href: "/owner/clients",
                },
                {
                  label: "Update project delivery",
                  href: "/owner/projects",
                },
                {
                  label: "Work the execution queue",
                  href: "/owner/tasks",
                },
                {
                  label: "Review the public Work page",
                  href: "/work",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/62 transition hover:bg-white/[0.07] hover:text-white"
                >
                  {item.label}
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                  Recent activity
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                  Workspace changes
                </h2>
              </div>
            </div>

            <div className="mt-6 divide-y divide-white/10">
              {recentActivity.length === 0 ? (
                <div className="py-6">
                  <p className="text-sm text-white/45">
                    Activity will appear as leads, clients, projects, tasks, and
                    public proof are created or updated.
                  </p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/72">
                        {activity.summary || activity.action}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/28">
                        {activity.entityType}
                      </p>
                    </div>
                    <p className="text-xs text-white/32">
                      {formatTimestamp(activity.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
