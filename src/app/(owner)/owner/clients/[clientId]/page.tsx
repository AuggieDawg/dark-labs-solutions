import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientServiceType, ClientStatus } from "@/generated/prisma";

import { ClientServiceForm } from "./ClientServiceForm";
import { OwnerFormSubmitButton } from "@/components/owner/OwnerFormSubmitButton";
import { requireOwner } from "@/lib/auth/require";
import {
  formatDate,
  formatEnumLabel,
  toDateInputValue,
} from "@/lib/utils/format";
import {
  createClientContactAction,
  updateClientAction,
  uploadClientLogoAction,
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

const serviceDefinitions = [
  {
    type: ClientServiceType.WEBSITE,
    label: "Website",
    description:
      "The client website, hosting posture, conversion experience, and ongoing improvements.",
  },
  {
    type: ClientServiceType.SEO,
    label: "SEO",
    description:
      "Search visibility, technical foundations, content priorities, and review cadence.",
  },
  {
    type: ClientServiceType.WEB_ANALYTICS,
    label: "Web Analytics",
    description:
      "Measurement, conversion events, reporting, and decisions grounded in observed data.",
  },
] as const;

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
  const uploadLogo = uploadClientLogoAction.bind(null, client.id);
  const servicesByType = new Map(
    client.services.map((service) => [service.type, service]),
  );
  const statusOptions = Object.values(ClientStatus).filter(
    (status) =>
      status !== ClientStatus.LEAD || client.status === ClientStatus.LEAD,
  );

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

        <div className="flex min-w-[280px] items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-black/35">
            {client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={`${client.name} logo`}
                width={96}
                height={96}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <span className="text-xl font-semibold text-white/35">
                {client.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div>
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
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Contacts", value: client._count.contacts },
          { label: "Projects", value: client._count.projects },
          { label: "Workstreams", value: client._count.services },
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

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
            Client services
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
            Service workstreams
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Website, SEO, and Web Analytics remain unconfigured until you save
            them. A configured workstream records operational state; it does not
            publish anything to the public site.
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {serviceDefinitions.map((definition) => {
            const service = servicesByType.get(definition.type);

            return (
              <article
                key={definition.type}
                className="rounded-3xl border border-white/10 bg-black/30 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {definition.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {definition.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      service
                        ? "border-emerald-200/20 bg-emerald-200/10 text-emerald-100"
                        : "border-white/15 bg-white/[0.05] text-white/55"
                    }`}
                  >
                    {service
                      ? formatEnumLabel(service.status)
                      : "Not configured"}
                  </span>
                </div>

                {service?.summary ? (
                  <p className="mt-5 text-sm leading-6 text-white/65">
                    {service.summary}
                  </p>
                ) : null}

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <dt className="text-xs uppercase tracking-[0.14em] text-white/40">
                      Projects
                    </dt>
                    <dd className="mt-2 font-semibold text-white/75">
                      {service?._count.projects ?? 0}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                    <dt className="text-xs uppercase tracking-[0.14em] text-white/40">
                      Next review
                    </dt>
                    <dd className="mt-2 font-semibold text-white/75">
                      {formatDate(service?.nextReviewAt)}
                    </dd>
                  </div>
                </dl>

                {service?.primaryUrl ? (
                  <a
                    href={service.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-sm font-semibold text-white/70 underline decoration-white/25 underline-offset-4 transition hover:text-white"
                  >
                    Open primary URL ↗
                  </a>
                ) : null}

                <details className="group mt-5 border-t border-white/10 pt-4">
                  <summary className="cursor-pointer list-none rounded-xl text-sm font-semibold text-white/70 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {service ? "Edit workstream" : "Configure workstream"}
                      <span
                        aria-hidden
                        className="transition group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <ClientServiceForm
                    clientId={client.id}
                    serviceType={definition.type}
                    service={
                      service
                        ? {
                            status: service.status,
                            summary: service.summary,
                            primaryUrl: service.primaryUrl,
                            internalNotes: service.internalNotes,
                            startedAt: toDateInputValue(service.startedAt),
                            nextReviewAt: toDateInputValue(
                              service.nextReviewAt,
                            ),
                            endedAt: toDateInputValue(service.endedAt),
                            updatedAt: service.updatedAt.toISOString(),
                          }
                        : null
                    }
                  />
                </details>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
              Delivery
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
              Projects for {client.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Every project attached to this business is listed here.
            </p>
          </div>
          <Link
            href={`/owner/projects/new?clientId=${client.id}`}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            New project
          </Link>
        </div>

        {client.projects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/20 p-5">
            <p className="font-semibold">No projects attached yet.</p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Create the first project and connect it to a configured service
              workstream when appropriate.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {client.projects.map((project) => (
              <Link
                key={project.id}
                href={`/owner/projects/${project.id}`}
                className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="mt-2 text-sm text-white/55">
                      {formatEnumLabel(project.status)} ·{" "}
                      {formatEnumLabel(project.priority)}
                    </p>
                  </div>
                  {project.clientService ? (
                    <span className="rounded-full border border-sky-200/20 bg-sky-200/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-100">
                      {formatEnumLabel(project.clientService.type)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-xs text-white/45">
                  Due {formatDate(project.dueDate)} · Updated{" "}
                  {formatDate(project.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          action={updateClient}
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <h2 className="text-xl font-semibold">Business details</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Business name
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
                Legal / alternate name
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
                type="url"
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
            <OwnerFormSubmitButton
              pendingLabel="Saving business..."
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Save changes
            </OwnerFormSubmitButton>
          </div>
        </form>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-xl font-semibold">Client logo</h2>

            <div className="mt-5 flex items-center gap-4">
              <div className="grid h-24 w-24 place-items-center rounded-3xl border border-white/10 bg-black/35">
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt={`${client.name} logo`}
                    width={128}
                    height={128}
                    className="h-20 w-20 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-white/35">
                    {client.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <p className="max-w-sm text-sm leading-6 text-white/45">
                Upload a logo so client and project pages are easier to scan.
              </p>
            </div>

            <form action={uploadLogo} className="mt-5 grid gap-4">
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
              />

              <OwnerFormSubmitButton
                pendingLabel="Uploading logo..."
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Upload logo
              </OwnerFormSubmitButton>
            </form>
          </div>

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

              <OwnerFormSubmitButton
                pendingLabel="Adding contact..."
                className="h-11 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Add contact
              </OwnerFormSubmitButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
