import Link from "next/link";

import { ClientStatus } from "@/generated/prisma";

import { createClientAction } from "@/server/actions/clients";
import { formatEnumLabel } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Client",
};

const statusOptions = Object.values(ClientStatus);

export default function NewClientPage() {
  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href="/owner/clients"
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to clients
      </Link>

      <div className="mt-8 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Client CRM
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          New Client
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          Add a lead, active client, or internal account. Projects, tasks,
          notes, and portal access will attach to this record later.
        </p>

        <form
          action={createClientAction}
          className="mt-10 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Client name
              </span>
              <input
                name="name"
                required
                placeholder="Acme Field Services"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Status
              </span>
              <select
                name="status"
                defaultValue={ClientStatus.LEAD}
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
                Company
              </span>
              <input
                name="company"
                placeholder="Company or organization"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Website
              </span>
              <input
                name="website"
                placeholder="https://example.com"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Industry
              </span>
              <input
                name="industry"
                placeholder="Oilfield, trades, local services..."
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Source
              </span>
              <input
                name="source"
                placeholder="Referral, cold outreach, website..."
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Summary
            </span>
            <textarea
              name="summary"
              placeholder="What does this client need?"
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Internal notes
            </span>
            <textarea
              name="internalNotes"
              placeholder="Owner-only context, strategy, next steps..."
              className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
