import Link from "next/link";

import { ProspectStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import {
  formatDate,
  formatEnumLabel,
  formatTimestamp,
} from "@/lib/utils/format";
import {
  isProspectStatus,
  listProspectsForWorkspace,
} from "@/server/queries/prospects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prospects",
};

type ProspectsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    followUp?: string;
  }>;
};

const statusOptions = Object.values(ProspectStatus);

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

export default async function ProspectsPage({
  searchParams,
}: ProspectsPageProps) {
  const owner = await requireOwner();
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim().slice(0, 200) ?? "";
  const status = isProspectStatus(params.status) ? params.status : "";
  const followUp = params.followUp === "due" ? "due" : "";
  const prospects = await listProspectsForWorkspace({
    workspaceId: owner.workspaceId,
    q,
    status,
    followUp,
  });

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Outbound pipeline
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Prospects
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            Track businesses Dark Labs has identified or approached, keep the
            next follow-up visible, and promote a real opportunity into a client
            record without losing its history.
          </p>
        </div>

        <Link
          href="/owner/prospects/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          New Prospect
        </Link>
      </div>

      <form
        action="/owner/prospects"
        className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[1fr_210px_210px_auto]"
      >
        <label className="grid gap-2">
          <span className="sr-only">Search prospects</span>
          <input
            name="q"
            maxLength={200}
            defaultValue={q}
            placeholder="Search business, contact, location, source..."
            className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
          />
        </label>

        <label className="grid gap-2">
          <span className="sr-only">Filter by status</span>
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
        </label>

        <label className="grid gap-2">
          <span className="sr-only">Filter by follow-up</span>
          <select
            name="followUp"
            defaultValue={followUp}
            className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25"
          >
            <option value="">Any follow-up</option>
            <option value="due">Follow-ups due</option>
          </select>
        </label>

        <button
          type="submit"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025]">
        {prospects.length === 0 ? (
          <div className="p-8">
            <p className="text-lg font-semibold">No prospects found.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              {q || status || followUp
                ? "Try clearing a filter or changing the search."
                : "Add a business before or after your first outreach so the next step never depends on memory."}
            </p>
            <Link
              href="/owner/prospects/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Add a prospect
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {prospects.map((prospect) => (
              <Link
                key={prospect.id}
                href={`/owner/prospects/${prospect.id}`}
                className="grid gap-4 p-5 transition hover:bg-white/[0.035] xl:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-white">
                      {prospect.businessName}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyles[prospect.status]}`}
                    >
                      {formatEnumLabel(prospect.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/45">
                    {prospect.contactName || "Contact not identified"}
                    {prospect.email ? ` · ${prospect.email}` : ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Last outreach
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatTimestamp(prospect.lastContactedAt)}
                  </p>
                  {prospect.lastContactChannel ? (
                    <p className="mt-1 text-xs text-white/35">
                      {formatEnumLabel(prospect.lastContactChannel)}
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Next follow-up
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatDate(prospect.nextFollowUpAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Updated
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatTimestamp(prospect.updatedAt)}
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
