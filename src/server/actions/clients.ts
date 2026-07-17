"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ClientStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { savePublicImageUpload } from "@/lib/uploads/images";
import { slugify } from "@/lib/utils/slug";

const CLIENT_STATUS_VALUES = new Set<string>(Object.values(ClientStatus));

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

function requiredText(formData: FormData, key: string, label: string) {
  const value = optionalText(formData, key);

  if (!value) {
    throw new Error(`${label} is required`);
  }

  return value;
}

function parseClientStatus(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return ClientStatus.LEAD;
  }

  return CLIENT_STATUS_VALUES.has(value)
    ? (value as ClientStatus)
    : ClientStatus.LEAD;
}

async function generateUniqueClientSlug(workspaceId: string, name: string) {
  const base = slugify(name) || "client";
  let candidate = base;
  let suffix = 2;

  while (
    await prisma.client.findFirst({
      where: {
        workspaceId,
        slug: candidate,
      },
      select: {
        id: true,
      },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function requireOwnedClient(clientId: string) {
  const owner = await requireOwner();

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId: owner.workspaceId,
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  return {
    owner,
    client,
  };
}

export async function createClientAction(formData: FormData) {
  const owner = await requireOwner();

  const name = requiredText(formData, "name", "Client name");
  const status = parseClientStatus(formData.get("status"));
  const slug = await generateUniqueClientSlug(owner.workspaceId, name);

  const client = await prisma.client.create({
    data: {
      workspaceId: owner.workspaceId,
      name,
      slug,
      status,
      company: optionalText(formData, "company"),
      website: optionalText(formData, "website"),
      industry: optionalText(formData, "industry"),
      source: optionalText(formData, "source"),
      summary: optionalText(formData, "summary"),
      internalNotes: optionalText(formData, "internalNotes"),
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Client",
      entityId: client.id,
      action: "client.created",
      summary: `Created client ${client.name}`,
      metadata: {
        status: client.status,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/clients");

  redirect(`/owner/clients/${client.id}`);
}

export async function updateClientAction(clientId: string, formData: FormData) {
  const { owner, client } = await requireOwnedClient(clientId);

  const name = requiredText(formData, "name", "Client name");
  const status = parseClientStatus(formData.get("status"));

  const updated = await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      name,
      status,
      company: optionalText(formData, "company"),
      website: optionalText(formData, "website"),
      industry: optionalText(formData, "industry"),
      source: optionalText(formData, "source"),
      summary: optionalText(formData, "summary"),
      internalNotes: optionalText(formData, "internalNotes"),
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Client",
      entityId: updated.id,
      action: "client.updated",
      summary: `Updated client ${updated.name}`,
      metadata: {
        previousName: client.name,
        status: updated.status,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${client.id}`);
}

export async function createClientContactAction(
  clientId: string,
  formData: FormData,
) {
  const { owner, client } = await requireOwnedClient(clientId);

  const name = requiredText(formData, "name", "Contact name");
  const isPrimary = formData.get("isPrimary") === "on";

  await prisma.$transaction(async (tx) => {
    if (isPrimary) {
      await tx.clientContact.updateMany({
        where: {
          clientId: client.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const created = await tx.clientContact.create({
      data: {
        clientId: client.id,
        name,
        email: optionalText(formData, "email"),
        phone: optionalText(formData, "phone"),
        roleTitle: optionalText(formData, "roleTitle"),
        isPrimary,
        notes: optionalText(formData, "notes"),
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "ClientContact",
        entityId: created.id,
        action: "client_contact.created",
        summary: `Added contact ${created.name} to ${client.name}`,
        metadata: {
          clientId: client.id,
          isPrimary,
        },
      },
    });
  });

  revalidatePath("/owner");
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${client.id}`);
}

export async function uploadClientLogoAction(
  clientId: string,
  formData: FormData,
) {
  const { owner, client } = await requireOwnedClient(clientId);

  const logoValue = formData.get("logo");

  const logo =
    logoValue instanceof File && logoValue.size > 0 ? logoValue : null;

  if (!logo) {
    throw new Error("Upload a logo image");
  }

  const logoUrl = await savePublicImageUpload({
    file: logo,
    segments: ["clients", client.id, "logo"],
  });

  if (!logoUrl) {
    throw new Error("Logo upload failed");
  }

  const updated = await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      logoUrl,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Client",
      entityId: updated.id,
      action: "client.logo_uploaded",
      summary: `Uploaded logo for ${updated.name}`,
      metadata: {
        logoUrl,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${client.id}`);
  revalidatePath("/owner/projects");
}
