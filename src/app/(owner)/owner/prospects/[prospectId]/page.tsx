import Link from "next/link";
import { notFound } from "next/navigation";

import { ProspectStatus } from "@/generated/prisma";

import {
  ProspectConversionForm,
  ProspectOutreachForm,
  ProspectProfileForm,
} from "@/app/(owner)/owner/prospects/_components/ProspectForms";
import { requireOwner } from "@/lib/auth/require";
import {
  formatDate,
  formatEnumLabel,
  formatTimestamp,
  toDateInputValue,
} from "@/lib/utils/format";
import {
  convertProspectToClientAction,
  recordProspectOutreachAction,
  updateProspectAction,
} from "@/server/actions/prospects";
import {
  getProspectActivityForWorkspace,
  getProspectDetailForWorkspace,
} from "@/server/queries/prospects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prospect Detail",
};

type ProspectDetailPageProps = {
  params: Promise<{
    prospectId: string;
  }>;
};

const statusStyles: Record<ProspectStatus, string> = {
  TO_CONTACT: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  CONTACTED: "border-violet-300/20 bg-violet-300/10 text-violet-100",
  ENGAGED: "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-100",
  QUALIFIED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  NOT_INTERESTED: "border-orange-300/20 bg-orange-300/10 text-orange-100",
  DO_NOT_CONTACT: "border-red-300/20 bg-red-300/10 text-red-100",
  CONVERTED: "border-teal-300/20 bg-teal-300/10 text-teal-100",
  ARCHIVED: "border-white/10 bg-white/[0.04] text-white/45",
};

const outreachAllowedStatuses = new Set<ProspectStatus>([
  ProspectStatus.TO_CONTACT,
  ProspectStatus.CONTACTED,
  ProspectStatus.ENGAGED,
  ProspectStatus.QUALIFIED,
]);

const convertibleStatuses = new Set<ProspectStatus>([
  ProspectStatus.CONTACTED,
  ProspectStatus.ENGAGED,
  ProspectStatus.QUALIFIED,
]);

function safeWebsiteUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

function readOutreachMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const values = metadata as Record<string, unknown>;
  const outcome = typeof values.outcome === "string" ? values.outcome : null;
  const channel = typeof values.channel === "string" ? values.channel : null;
  const nextFollowUpAt =
    typeof values.nextFollowUpAt === "string" ? values.nextFollowUpAt : null;

  if (!outcome && !channel && !nextFollowUpAt) {
    return null;
  }

  return {
    outcome,
    channel,
    nextFollowUpAt,
  };
}

export default async function ProspectDetailPage({
  params,
}: ProspectDetailPageProps) {
  const owner = await requireOwner();
  const { prospectId } = await params;
  const [prospect, activity] = await Promise.all([
    getProspectDetailForWorkspace(owner.workspaceId, prospectId),
    getProspectActivityForWorkspace(owner.workspaceId, prospectId),
  ]);

  if (!prospect) {
    notFound();
  }

  const updateProspect = updateProspectAction.bind(null, prospect.id);
  const recordOutreach = recordProspectOutreachAction.bind(null, prospect.id);
  const convertProspect = convertProspectToClientAction.bind(null, prospect.id);
  const canRecordOutreach = outreachAllowedStatuses.has(prospect.status);
  const canConvert =
    !prospect.clientId && convertibleStatuses.has(prospect.status);
  const websiteUrl = safeWebsiteUrl(prospect.websiteUrl);
  const statusLocked =
    prospect.status === ProspectStatus.CONVERTED ||
    prospect.status === ProspectStatus.DO_NOT_CONTACT;

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="max-w-7xl">
        <Link
          href="/owner/prospects"
          className="text-sm text-white/45 transition hover:text-white"
        >
          ← Back to prospects
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                Outbound prospect
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusStyles[prospect.status]}`}
              >
                {formatEnumLabel(prospect.status)}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              {prospect.businessName}
            </h1>
            <p className="mt-4 text-lg text-white/55">
              {prospect.contactName || "Contact not identified"}
            </p>
            <p className="mt-2 text-sm text-white/35">
              Added {formatTimestamp(prospect.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {prospect.email ? (
              <a
                href={`mailto:${prospect.email}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Email prospect
              </a>
            ) : null}
            {prospect.phone ? (
              <a
                href={`tel:${prospect.phone}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Call prospect
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid content-start gap-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Prospect profile
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                Business and relationship context
              </h2>
              <div className="mt-6">
                <ProspectProfileForm
                  action={updateProspect}
                  mode="edit"
                  statusLocked={statusLocked}
                  values={{
                    businessName: prospect.businessName,
                    contactName: prospect.contactName ?? "",
                    email: prospect.email ?? "",
                    phone: prospect.phone ?? "",
                    websiteUrl: prospect.websiteUrl ?? "",
                    industry: prospect.industry ?? "",
                    location: prospect.location ?? "",
                    source: prospect.source ?? "",
                    valueHypothesis: prospect.valueHypothesis ?? "",
                    status: prospect.status,
                    nextFollowUpDate: toDateInputValue(prospect.nextFollowUpAt),
                    internalNotes: prospect.internalNotes ?? "",
                    updatedAt: prospect.updatedAt.toISOString(),
                  }}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Relationship activity
              </p>
              <div className="mt-5 divide-y divide-white/10">
                {activity.length === 0 ? (
                  <p className="py-3 text-sm leading-6 text-white/42">
                    Outreach and pipeline changes will appear here.
                  </p>
                ) : (
                  activity.map((item) => {
                    const outreach = readOutreachMetadata(item.metadata);

                    return (
                      <article key={item.id} className="py-5">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                          <div>
                            <p className="text-sm font-medium text-white/72">
                              {item.summary || item.action}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/28">
                              {item.action}
                            </p>
                          </div>
                          <p className="shrink-0 text-xs text-white/32">
                            {formatTimestamp(item.createdAt)}
                          </p>
                        </div>

                        {item.action === "prospect.outreach_recorded" &&
                        outreach ? (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                            {outreach.channel ? (
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                                {formatEnumLabel(outreach.channel)} outcome
                              </p>
                            ) : null}
                            {outreach.outcome ? (
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/62">
                                {outreach.outcome}
                              </p>
                            ) : null}
                            {outreach.nextFollowUpAt ? (
                              <p className="mt-3 text-xs text-white/38">
                                Next step due{" "}
                                {formatDate(outreach.nextFollowUpAt)}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <div className="grid content-start gap-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Contact snapshot
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  { label: "Email", value: prospect.email || "Not provided" },
                  { label: "Phone", value: prospect.phone || "Not provided" },
                  {
                    label: "Industry",
                    value: prospect.industry || "Not provided",
                  },
                  {
                    label: "Location",
                    value: prospect.location || "Not provided",
                  },
                  { label: "Source", value: prospect.source || "Not provided" },
                  {
                    label: "First contacted",
                    value: formatTimestamp(prospect.firstContactedAt),
                  },
                  {
                    label: "Last contacted",
                    value: formatTimestamp(prospect.lastContactedAt),
                  },
                  {
                    label: "Next follow-up",
                    value: formatDate(prospect.nextFollowUpAt),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                      {item.label}
                    </p>
                    <p className="mt-2 break-words text-sm text-white/68">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-semibold text-white/60 underline decoration-white/20 underline-offset-8 transition hover:text-white"
                >
                  Open business website ↗
                </a>
              ) : null}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Record outreach
              </p>
              {canRecordOutreach ? (
                <div className="mt-5">
                  <p className="mb-5 text-sm leading-6 text-white/48">
                    This records the current time, channel, outcome, and next
                    follow-up in the permanent activity timeline.
                  </p>
                  <ProspectOutreachForm
                    action={recordOutreach}
                    updatedAt={prospect.updatedAt.toISOString()}
                    nextFollowUpDate={toDateInputValue(prospect.nextFollowUpAt)}
                  />
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-white/45">
                  Outreach is disabled for closed, converted, and do-not-contact
                  records. Reopen an archived or not-interested prospect from
                  the profile when contact is appropriate.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
                Client conversion
              </p>

              {prospect.client ? (
                <div className="mt-5">
                  <p className="text-sm leading-6 text-white/50">
                    The prospect history is preserved and linked to this client.
                  </p>
                  <Link
                    href={`/owner/clients/${prospect.client.id}`}
                    className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-semibold text-white/72 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {prospect.client.name}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              ) : canConvert ? (
                <div className="mt-5">
                  <p className="mb-5 text-sm leading-6 text-white/50">
                    Create an active client and, when a contact name is present,
                    its primary contact. This prospect remains linked for
                    traceability.
                  </p>
                  <ProspectConversionForm action={convertProspect} />
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-white/45">
                  Record outreach and move this prospect to Contacted, Engaged,
                  or Qualified before conversion.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
