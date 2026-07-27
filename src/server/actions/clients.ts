"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ClientServiceStatus,
  ClientServiceType,
  ClientStatus,
} from "@/generated/prisma";
import { z } from "zod";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { savePublicImageUpload } from "@/lib/uploads/images";
import { slugify } from "@/lib/utils/slug";

const CLIENT_STATUS_VALUES = new Set<string>(Object.values(ClientStatus));
const CLIENT_SERVICE_TYPE_VALUES = new Set<string>(
  Object.values(ClientServiceType),
);

const dateInputSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.")
  .refine((value) => {
    const date = new Date(`${value}T12:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Use a valid date.");

const optionalDateInputSchema = z
  .string()
  .trim()
  .transform((value) => value || null)
  .pipe(dateInputSchema.nullable())
  .transform((value) => (value ? new Date(`${value}T12:00:00.000Z`) : null));

const optionalServiceText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Use ${maxLength.toLocaleString()} characters or fewer.`)
    .transform((value) => value || null);

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(2_048, "URL must be 2,048 characters or fewer.")
  .transform((value) => value || null)
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a complete http(s) URL.")
  .transform((value) => (value ? new URL(value).toString() : null));

const optionalUpdatedAtSchema = z
  .string()
  .trim()
  .max(64)
  .refine(
    (value) => !value || !Number.isNaN(new Date(value).getTime()),
    "The workstream changed. Refresh and try again.",
  )
  .transform((value) => value || null);

const clientServiceFormSchema = z
  .object({
    status: z.enum(ClientServiceStatus),
    summary: optionalServiceText(2_000),
    primaryUrl: optionalHttpUrlSchema,
    internalNotes: optionalServiceText(12_000),
    startedAt: optionalDateInputSchema,
    nextReviewAt: optionalDateInputSchema,
    endedAt: optionalDateInputSchema,
    updatedAt: optionalUpdatedAtSchema,
  })
  .superRefine((value, context) => {
    if (
      value.startedAt &&
      value.endedAt &&
      value.endedAt.getTime() < value.startedAt.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "End date cannot be earlier than the start date.",
      });
    }
  });

export type ClientServiceFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

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

function optionalHttpUrl(formData: FormData, key: string) {
  const value = formData.get(key);
  const parsed = optionalHttpUrlSchema.safeParse(
    typeof value === "string" ? value : "",
  );

  if (!parsed.success) {
    throw new Error("Website must be a complete http(s) URL");
  }

  return parsed.data;
}

function parseClientStatus(
  value: FormDataEntryValue | null,
  allowLegacyLead = false,
) {
  if (typeof value !== "string") {
    return ClientStatus.ACTIVE;
  }

  if (value === ClientStatus.LEAD && !allowLegacyLead) {
    return ClientStatus.ACTIVE;
  }

  return CLIENT_STATUS_VALUES.has(value)
    ? (value as ClientStatus)
    : ClientStatus.ACTIVE;
}

function flattenFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return fieldErrors;
}

function isClientServiceType(value: string): value is ClientServiceType {
  return CLIENT_SERVICE_TYPE_VALUES.has(value);
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
      status: true,
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
      website: optionalHttpUrl(formData, "website"),
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
  const status = parseClientStatus(
    formData.get("status"),
    client.status === ClientStatus.LEAD,
  );

  const updated = await prisma.client.update({
    where: {
      id: client.id,
    },
    data: {
      name,
      status,
      company: optionalText(formData, "company"),
      website: optionalHttpUrl(formData, "website"),
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

export async function upsertClientServiceAction(
  clientId: string,
  serviceTypeValue: string,
  _previousState: ClientServiceFormState,
  formData: FormData,
): Promise<ClientServiceFormState> {
  const { owner, client } = await requireOwnedClient(clientId);

  if (!isClientServiceType(serviceTypeValue)) {
    return {
      status: "error",
      message: "Select a valid client service.",
    };
  }

  const parsed = clientServiceFormSchema.safeParse({
    status: formData.get("status"),
    summary: formData.get("summary") ?? "",
    primaryUrl: formData.get("primaryUrl") ?? "",
    internalNotes: formData.get("internalNotes") ?? "",
    startedAt: formData.get("startedAt") ?? "",
    nextReviewAt: formData.get("nextReviewAt") ?? "",
    endedAt: formData.get("endedAt") ?? "",
    updatedAt: formData.get("updatedAt") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted workstream details.",
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const existing = await prisma.clientService.findUnique({
    where: {
      workspaceId_clientId_type: {
        workspaceId: owner.workspaceId,
        clientId: client.id,
        type: serviceTypeValue,
      },
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  if (
    (existing && parsed.data.updatedAt !== existing.updatedAt.toISOString()) ||
    (!existing && parsed.data.updatedAt)
  ) {
    return {
      status: "error",
      message: "This workstream changed. Refresh the page and try again.",
    };
  }

  const data = {
    status: parsed.data.status,
    summary: parsed.data.summary,
    primaryUrl: parsed.data.primaryUrl,
    internalNotes: parsed.data.internalNotes,
    startedAt: parsed.data.startedAt,
    nextReviewAt: parsed.data.nextReviewAt,
    endedAt: parsed.data.endedAt,
  };

  try {
    await prisma.$transaction(async (tx) => {
      let serviceId: string;

      if (existing) {
        const updated = await tx.clientService.updateMany({
          where: {
            id: existing.id,
            workspaceId: owner.workspaceId,
            clientId: client.id,
            updatedAt: existing.updatedAt,
          },
          data,
        });

        if (updated.count !== 1) {
          throw new Error("CLIENT_SERVICE_CONFLICT");
        }

        serviceId = existing.id;
      } else {
        const created = await tx.clientService.create({
          data: {
            workspaceId: owner.workspaceId,
            clientId: client.id,
            type: serviceTypeValue,
            ...data,
          },
          select: {
            id: true,
          },
        });

        serviceId = created.id;
      }

      await tx.activityLog.create({
        data: {
          workspaceId: owner.workspaceId,
          actorId: owner.userId,
          entityType: "ClientService",
          entityId: serviceId,
          action: existing
            ? "client_service.updated"
            : "client_service.created",
          summary: `${existing ? "Updated" : "Configured"} ${serviceTypeValue.replaceAll("_", " ").toLowerCase()} for ${client.name}`,
          metadata: {
            clientId: client.id,
            serviceType: serviceTypeValue,
            previousStatus: existing?.status ?? null,
            status: parsed.data.status,
          },
        },
      });
    });
  } catch (error) {
    if (
      (error instanceof Error && error.message === "CLIENT_SERVICE_CONFLICT") ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002")
    ) {
      return {
        status: "error",
        message: "This workstream changed. Refresh the page and try again.",
      };
    }

    throw error;
  }

  revalidatePath("/owner");
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${client.id}`);
  revalidatePath("/owner/projects");

  return {
    status: "success",
    message: "Workstream saved.",
  };
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
