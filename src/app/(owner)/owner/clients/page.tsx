import Link from "next/link";

import { ClientStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { formatDate, formatEnumLabel } from "@/lib/utils/format";
import {
  isClientStatus,
  listClientsForWorkspace,
} from "@/server/queries/clients";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clients",
};

type OwnerClientsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

const statusOptions = Object.values(ClientStatus);

export default async function OwnerClientsPage({
  searchParams,
}: OwnerClientsPageProps) {
  const owner = await requireOwner();
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim() ?? "";
  const status = isClientStatus(params.status) ? params.status : "";

  const clients = await listClientsForWorkspace({
    workspaceId: owner.workspaceId,
    q,
    status,
  });

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Owner Only
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Clients
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            Open a business workspace to manage its contacts, service
            workstreams, projects, and delivery history.
          </p>
        </div>

        <Link
          href="/owner/clients/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          New Client
        </Link>
      </div>

      <form
        action="/owner/clients"
        className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_220px_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search business names, industries, and sources..."
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
        />

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

        <button
          type="submit"
          className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025]">
        {clients.length === 0 ? (
          <div className="p-8">
            <p className="text-lg font-semibold">No clients found.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Create your first client to start building the Dark Labs operating
              system around real business relationships.
            </p>
            <Link
              href="/owner/clients/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create first client
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/owner/clients/${client.id}`}
                className="grid gap-4 p-5 transition hover:bg-white/[0.035] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/70 lg:grid-cols-[1.2fr_0.8fr_1fr_0.8fr]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    Business
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {client.name}
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {client.industry ||
                      client.website ||
                      client.company ||
                      "Business details not added"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Status
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatEnumLabel(client.status)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Related
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {client._count.projects} projects · {client._count.services}{" "}
                    workstreams · {client._count.contacts} contacts
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Updated
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {formatDate(client.updatedAt)}
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
