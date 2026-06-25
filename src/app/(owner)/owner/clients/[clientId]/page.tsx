import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { formatDate, formatEnumLabel } from "@/lib/utils/format";
import {
  createClientContactAction,
  updateClientAction,
} from "@/server/actions/clients";
import { getClientDetailForWorkspace } from "@/server/queries/clients";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Detail",
};

type ClientDetailPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

const statusOptions = Object.values(ClientStatus);

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const owner = await requireOwner();
  const { clientId } = await params;

  const client = await getClientDetailForWorkspace(owner.workspaceId, clientId);

  if (!client) {
    notFound();
  }

  const updateClient = updateClientAction.bind(null, client.id);
  const createContact = createClientContactAction.bind(null, client.id);

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href="/owner/clients"
        className="text-sm text-white/45 hover:text-white"
      >
        ← Back to clients
      </Link>

      <div className="mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Client
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            {client.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            {client.summary || "No client summary has been written yet."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/35">
            Status
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatEnumLabel(client.status)}
          </p>
          <p className="mt-2 text-xs text-white/35">
            Updated {formatDate(client.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          { label: "Contacts", value: client._count.contacts },
          { label: "Projects", value: client._count.projects },
          { label: "Tasks", value: client._count.tasks },
          { label: "Notes", value: client._count.notes },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
          >
            <p className="text-sm text-white/45">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          action={updateClient}
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <h2 className="text-xl font-semibold">Client details</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Client name
              </span>
              <input
                name="name"
                required
                defaultValue={client.name}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Status
              </span>
              <select
                name="status"
                defaultValue={client.status}
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
                defaultValue={client.company ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Website
              </span>
              <input
                name="website"
                defaultValue={client.website ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Industry
              </span>
              <input
                name="industry"
                defaultValue={client.industry ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Source
              </span>
              <input
                name="source"
                defaultValue={client.source ?? ""}
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
            </label>
          </div>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Summary
            </span>
            <textarea
              name="summary"
              defaultValue={client.summary ?? ""}
              className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Internal notes
            </span>
            <textarea
              name="internalNotes"
              defaultValue={client.internalNotes ?? ""}
              className="min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
            />
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Save Changes
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Contacts</h2>

            <div className="mt-5 space-y-3">
              {client.contacts.length === 0 ? (
                <p className="text-sm leading-6 text-white/45">
                  No contacts yet. Add the primary person for this client.
                </p>
              ) : (
                client.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="mt-1 text-sm text-white/45">
                          {contact.roleTitle || "No role title"}
                        </p>
                      </div>
                      {contact.isPrimary ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs text-white/70">
                          Primary
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-white/50">
                      {contact.email || "No email"} ·{" "}
                      {contact.phone || "No phone"}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form action={createContact} className="mt-6 grid gap-4">
              <input
                name="name"
                required
                placeholder="Contact name"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
              <input
                name="email"
                type="email"
                placeholder="email@example.com"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />
              <input
                name="roleTitle"
                placeholder="Role title"
                className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              />

              <label className="flex items-center gap-3 text-sm text-white/55">
                <input
                  name="isPrimary"
                  type="checkbox"
                  className="h-4 w-4 accent-white"
                />
                Set as primary contact
              </label>

              <button
                type="submit"
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Add Contact
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Recent projects</h2>

            <div className="mt-5 space-y-3">
              {client.projects.length === 0 ? (
                <p className="text-sm leading-6 text-white/45">
                  No projects attached yet. The Projects module comes next.
                </p>
              ) : (
                client.projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <p className="font-semibold">{project.name}</p>
                    <p className="mt-2 text-sm text-white/45">
                      {formatEnumLabel(project.status)} ·{" "}
                      {formatEnumLabel(project.priority)}
                    </p>
                    <p className="mt-2 text-xs text-white/35">
                      Due {formatDate(project.dueDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
