import Link from "next/link";

import { LeadNotificationStatus, LeadStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import {
  formatDate,
  formatEnumLabel,
  formatTimestamp,
} from "@/lib/utils/format";
import {
  getLeadPipelineSummaryForWorkspace,
  isLeadStatus,
  listLeadsForWorkspace,
} from "@/server/queries/leads";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leads",
};

type OwnerLeadsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    followUp?: string;
    notification?: string;
  }>;
};

const statusOptions = Object.values(LeadStatus);

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  CONTACTED: "border-violet-300/20 bg-violet-300/10 text-violet-100",
  QUALIFIED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  DISQUALIFIED: "border-orange-300/20 bg-orange-300/10 text-orange-100",
  CONVERTED: "border-teal-300/20 bg-teal-300/10 text-teal-100",
  SPAM: "border-red-300/20 bg-red-300/10 text-red-100",
  ARCHIVED: "border-white/10 bg-white/[0.04] text-white/45",
};

function notificationLabel(status: LeadNotificationStatus | undefined) {
  if (!status) {
    return "No notification";
  }

  return `${formatEnumLabel(status)} notification`;
}

export default async function OwnerLeadsPage({
  searchParams,
}: OwnerLeadsPageProps) {
  const owner = await requireOwner();
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim() ?? "";
  const status = isLeadStatus(params.status) ? params.status : "";
  const followUp = params.followUp === "due" ? "due" : "";
  const notification = params.notification === "failed" ? "failed" : "";

  const [leads, pipeline] = await Promise.all([
    listLeadsForWorkspace({
      workspaceId: owner.workspaceId,
      q,
      status,
      followUp,
      notification,
    }),
    getLeadPipelineSummaryForWorkspace(owner.workspaceId),
  ]);

  const total = Object.values(pipeline).reduce((sum, count) => sum + count, 0);

  const summaryCards = [
    {
      label: "New",
      value: pipeline.NEW,
      detail: "Awaiting first review",
      href: "/owner/leads?status=NEW",
    },
    {
      label: "Contacted",
      value: pipeline.CONTACTED,
      detail: "Conversation started",
      href: "/owner/leads?status=CONTACTED",
    },
    {
      label: "Qualified",
      value: pipeline.QUALIFIED,
      detail: "Ready for a sales decision",
      href: "/owner/leads?status=QUALIFIED",
    },
    {
      label: "All leads",
      value: total,
      detail: `${pipeline.CONVERTED} converted`,
      href: "/owner/leads",
    },
  ];

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-7xl">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
              Sales
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Lead inbox
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
              Review every persisted website inquiry, manage follow-up, verify
              notification delivery, and convert qualified opportunities into
              client records.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
          >
            View public intake ↗
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/20 hover:bg-white/[0.065]"
            >
              <p className="text-sm text-white/45">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
              <p className="mt-2 text-xs leading-5 text-white/35">
                {card.detail}
              </p>
            </Link>
          ))}
        </div>

        <form
          action="/owner/leads"
          className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_220px_auto]"
        >
          {followUp ? (
            <input type="hidden" name="followUp" value={followUp} />
          ) : null}
          {notification ? (
            <input type="hidden" name="notification" value={notification} />
          ) : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, business, email, brief, or reference..."
            className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />

          <select
            name="status"
            defaultValue={status}
            aria-label="Filter by lead status"
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

        {followUp || notification ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
            <span>
              Showing {followUp ? "follow-ups due" : "failed notifications"}
            </span>
            <Link
              href="/owner/leads"
              className="font-semibold text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              Clear operational filter
            </Link>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          {leads.length === 0 ? (
            <div className="p-8">
              <p className="text-lg font-semibold">No leads found.</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                New website inquiries will appear here after they are safely
                stored. Try clearing the current filters if the pipeline has
                existing records.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {leads.map((lead) => {
                const notification = lead.notifications[0];
                const followUpDue =
                  lead.nextFollowUpAt && lead.nextFollowUpAt <= new Date();

                return (
                  <Link
                    key={lead.id}
                    href={`/owner/leads/${lead.id}`}
                    className="grid gap-4 p-5 transition hover:bg-white/[0.035] lg:grid-cols-[1.2fr_0.85fr_0.75fr_0.8fr] lg:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-white">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusStyles[lead.status]}`}
                        >
                          {formatEnumLabel(lead.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/48">
                        {lead.businessName} · {lead.email}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/28">
                        {lead.reference}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Interest
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {lead.engagementSlug
                          ? lead.engagementSlug.replaceAll("-", " ")
                          : "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Follow-up
                      </p>
                      <p
                        className={`mt-2 text-sm ${followUpDue ? "font-semibold text-amber-200" : "text-white/70"}`}
                      >
                        {lead.nextFollowUpAt
                          ? formatDate(lead.nextFollowUpAt)
                          : "Not scheduled"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                        Received
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {formatTimestamp(lead.createdAt)}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          notification?.status === LeadNotificationStatus.FAILED
                            ? "font-semibold text-red-200"
                            : "text-white/32"
                        }`}
                      >
                        {notificationLabel(notification?.status)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
