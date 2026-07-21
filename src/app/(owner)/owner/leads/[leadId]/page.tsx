import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadNotificationStatus, LeadStatus } from "@/generated/prisma";

import { OwnerFormSubmitButton } from "@/components/owner/OwnerFormSubmitButton";
import { requireOwner } from "@/lib/auth/require";
import {
  formatDate,
  formatEnumLabel,
  formatTimestamp,
  toDateInputValue,
} from "@/lib/utils/format";
import {
  convertLeadToClientAction,
  retryLeadNotificationAction,
  updateLeadAction,
} from "@/server/actions/leads";
import {
  getLeadActivityForWorkspace,
  getLeadDetailForWorkspace,
} from "@/server/queries/leads";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lead Detail",
};

type LeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  CONTACTED: "border-violet-300/20 bg-violet-300/10 text-violet-100",
  QUALIFIED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  DISQUALIFIED: "border-orange-300/20 bg-orange-300/10 text-orange-100",
  CONVERTED: "border-teal-300/20 bg-teal-300/10 text-teal-100",
  SPAM: "border-red-300/20 bg-red-300/10 text-red-100",
  ARCHIVED: "border-white/10 bg-white/[0.04] text-white/45",
};

const convertibleStatuses = new Set<LeadStatus>([
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
]);

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const owner = await requireOwner();
  const { leadId } = await params;
  const lead = await getLeadDetailForWorkspace(owner.workspaceId, leadId);

  if (!lead) {
    notFound();
  }

  const activity = await getLeadActivityForWorkspace(
    owner.workspaceId,
    lead.id,
  );
  const updateLead = updateLeadAction.bind(null, lead.id);
  const convertLead = convertLeadToClientAction.bind(null, lead.id);
  const statusOptions = lead.clientId
    ? [LeadStatus.CONVERTED]
    : Object.values(LeadStatus).filter(
        (status) => status !== LeadStatus.CONVERTED,
      );
  const canConvert = !lead.clientId && convertibleStatuses.has(lead.status);
  const attribution = [
    { label: "Source page", value: lead.sourcePath },
    { label: "Landing page", value: lead.landingPath },
    { label: "Referrer", value: lead.referrerUrl },
    { label: "UTM source", value: lead.utmSource },
    { label: "UTM medium", value: lead.utmMedium },
    { label: "UTM campaign", value: lead.utmCampaign },
    { label: "UTM term", value: lead.utmTerm },
    { label: "UTM content", value: lead.utmContent },
  ].filter((item) => item.value);

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-7xl">
        <Link
          href="/owner/leads"
          className="text-sm text-white/45 transition hover:text-white"
        >
          ← Back to lead inbox
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                {lead.reference}
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusStyles[lead.status]}`}
              >
                {formatEnumLabel(lead.status)}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="mt-4 text-lg text-white/55">{lead.businessName}</p>
            <p className="mt-2 text-sm text-white/35">
              Received {formatTimestamp(lead.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Email lead
            </a>
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Call lead
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid content-start gap-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Project brief
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                The business constraint
              </h2>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {lead.businessConstraint}
              </p>

              {lead.desiredOutcome ? (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                    Desired outcome
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/60">
                    {lead.desiredOutcome}
                  </p>
                </div>
              ) : null}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Contact and qualification
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Email", value: lead.email },
                  { label: "Phone", value: lead.phone || "Not provided" },
                  {
                    label: "Website",
                    value: lead.websiteUrl || "Not provided",
                  },
                  {
                    label: "Engagement",
                    value: lead.engagementSlug
                      ? lead.engagementSlug.replaceAll("-", " ")
                      : "Not selected",
                  },
                  {
                    label: "Timeline",
                    value: lead.timeline
                      ? formatEnumLabel(lead.timeline)
                      : "Not selected",
                  },
                  {
                    label: "Budget range",
                    value: lead.budgetRange
                      ? formatEnumLabel(lead.budgetRange)
                      : "Not selected",
                  },
                  {
                    label: "Referral source",
                    value: lead.referralSource || "Not provided",
                  },
                  {
                    label: "Privacy notice",
                    value: `${lead.privacyNoticeVersion} · ${formatDate(lead.privacyAcknowledgedAt)}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                      {item.label}
                    </p>
                    <p className="mt-2 break-words text-sm capitalize text-white/68">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {lead.websiteUrl ? (
                <a
                  href={lead.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-semibold text-white/60 underline decoration-white/20 underline-offset-8 transition hover:text-white"
                >
                  Open business website ↗
                </a>
              ) : null}
            </section>

            {attribution.length > 0 ? (
              <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                  Acquisition context
                </p>
                <div className="mt-5 divide-y divide-white/10">
                  {attribution.map((item) => (
                    <div
                      key={item.label}
                      className="grid gap-2 py-3 sm:grid-cols-[150px_1fr]"
                    >
                      <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                        {item.label}
                      </p>
                      <p className="break-all text-sm text-white/58">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Activity
              </p>
              <div className="mt-5 divide-y divide-white/10">
                {activity.length === 0 ? (
                  <p className="py-3 text-sm leading-6 text-white/42">
                    Activity will appear as this lead moves through the sales
                    process.
                  </p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-white/70">
                          {item.summary || item.action}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/28">
                          {item.action}
                        </p>
                      </div>
                      <p className="text-xs text-white/32">
                        {formatTimestamp(item.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="grid content-start gap-6">
            <form
              action={updateLead}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Sales control
              </p>
              <h2 className="mt-4 text-xl font-semibold">Manage lead</h2>

              <label className="mt-6 grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatEnumLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                  Next follow-up
                </span>
                <input
                  name="nextFollowUpDate"
                  type="date"
                  defaultValue={toDateInputValue(lead.nextFollowUpAt)}
                  disabled={lead.status === LeadStatus.CONVERTED}
                  className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-45"
                />
              </label>

              <label className="mt-5 grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                  Internal notes
                </span>
                <textarea
                  name="internalNotes"
                  defaultValue={lead.internalNotes ?? ""}
                  placeholder="Qualification context, objections, decisions, and next steps..."
                  className="min-h-36 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25"
                />
              </label>

              <OwnerFormSubmitButton
                pendingLabel="Saving..."
                className="mt-6 h-11 w-full rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Save lead
              </OwnerFormSubmitButton>
            </form>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Client conversion
              </p>

              {lead.client ? (
                <div className="mt-5">
                  <p className="text-sm leading-6 text-white/50">
                    This lead is preserved and linked to the client record.
                  </p>
                  <Link
                    href={`/owner/clients/${lead.client.id}`}
                    className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-semibold text-white/72 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {lead.client.name}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ) : canConvert ? (
                <div className="mt-5">
                  <p className="text-sm leading-6 text-white/50">
                    Create a client account and primary contact from this lead.
                    The original inquiry remains attached for traceability.
                  </p>
                  <form action={convertLead} className="mt-5">
                    <OwnerFormSubmitButton
                      pendingLabel="Converting..."
                      className="h-11 w-full rounded-full border border-emerald-200/20 bg-emerald-200/10 px-5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-200/15"
                    >
                      Convert to client
                    </OwnerFormSubmitButton>
                  </form>
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-white/45">
                  Reopen this lead as New, Contacted, or Qualified before
                  conversion.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Notifications
              </p>
              <div className="mt-5 space-y-4">
                {lead.notifications.length === 0 ? (
                  <p className="text-sm leading-6 text-white/45">
                    No notification record was created for this lead.
                  </p>
                ) : (
                  lead.notifications.map((notification) => {
                    const retryNotification = retryLeadNotificationAction.bind(
                      null,
                      notification.id,
                    );

                    return (
                      <div
                        key={notification.id}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {formatEnumLabel(notification.kind)}
                            </p>
                            <p className="mt-1 break-all text-xs text-white/35">
                              {notification.recipient}
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                              notification.status ===
                              LeadNotificationStatus.FAILED
                                ? "border-red-300/20 bg-red-300/10 text-red-100"
                                : notification.status ===
                                    LeadNotificationStatus.SENT
                                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                                  : "border-white/10 bg-white/[0.05] text-white/55"
                            }`}
                          >
                            {formatEnumLabel(notification.status)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-1 text-xs leading-5 text-white/38">
                          <p>Attempts: {notification.attemptCount}</p>
                          <p>
                            Last attempt:{" "}
                            {formatTimestamp(notification.lastAttemptAt)}
                          </p>
                          <p>Sent: {formatTimestamp(notification.sentAt)}</p>
                        </div>

                        {notification.lastError ? (
                          <p className="mt-3 break-words rounded-xl border border-red-300/10 bg-red-300/[0.05] p-3 text-xs leading-5 text-red-100/65">
                            {notification.lastError}
                          </p>
                        ) : null}

                        {notification.status ===
                        LeadNotificationStatus.FAILED ? (
                          <form action={retryNotification} className="mt-4">
                            <OwnerFormSubmitButton
                              pendingLabel="Queueing..."
                              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.06] px-4 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                              Queue retry
                            </OwnerFormSubmitButton>
                          </form>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
