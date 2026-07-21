"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ClientStatus,
  LeadNotificationStatus,
  LeadStatus,
  Prisma,
} from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";

const LEAD_STATUS_VALUES = new Set<string>(Object.values(LeadStatus));
const CONTACTED_STATUSES = new Set<LeadStatus>([
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.DISQUALIFIED,
]);
const CLOSED_STATUSES = new Set<LeadStatus>([
  LeadStatus.DISQUALIFIED,
  LeadStatus.SPAM,
  LeadStatus.ARCHIVED,
]);
const CONVERTIBLE_STATUSES = new Set<LeadStatus>([
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
]);

function optionalText(formData: FormData, key: string, maxLength = 12_000) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${key} is too long`);
  }

  return trimmed;
}

function parseLeadStatus(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !LEAD_STATUS_VALUES.has(value)) {
    throw new Error("Select a valid lead status");
  }

  return value as LeadStatus;
}

function optionalFollowUpDate(formData: FormData) {
  const value = optionalText(formData, "nextFollowUpDate", 10);

  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Follow-up date is invalid");
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Follow-up date is invalid");
  }

  return parsed;
}

async function requireOwnedLead(leadId: string) {
  const owner = await requireOwner();
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      workspaceId: owner.workspaceId,
    },
    select: {
      id: true,
      workspaceId: true,
      reference: true,
      status: true,
      clientId: true,
      firstContactedAt: true,
      nextFollowUpAt: true,
      internalNotes: true,
      updatedAt: true,
    },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  return {
    owner,
    lead,
  };
}

function revalidateLeadPages(leadId: string) {
  revalidatePath("/owner");
  revalidatePath("/owner/leads");
  revalidatePath(`/owner/leads/${leadId}`);
}

export async function updateLeadAction(leadId: string, formData: FormData) {
  const { owner, lead } = await requireOwnedLead(leadId);
  const status = parseLeadStatus(formData.get("status"));
  const internalNotes = optionalText(formData, "internalNotes");
  const requestedFollowUpAt = optionalFollowUpDate(formData);

  if (status === LeadStatus.CONVERTED && !lead.clientId) {
    throw new Error("Use Convert to client to mark this lead as converted");
  }

  if (lead.status === LeadStatus.CONVERTED && status !== LeadStatus.CONVERTED) {
    throw new Error("A converted lead cannot be moved back into the pipeline");
  }

  const now = new Date();
  const nextFollowUpAt =
    CLOSED_STATUSES.has(status) || status === LeadStatus.CONVERTED
      ? null
      : requestedFollowUpAt;
  const firstContactedAt =
    CONTACTED_STATUSES.has(status) && !lead.firstContactedAt
      ? now
      : lead.firstContactedAt;
  const closedAt = CLOSED_STATUSES.has(status) ? now : null;

  await prisma.$transaction(async (tx) => {
    const updated = await tx.lead.updateMany({
      where: {
        id: lead.id,
        workspaceId: owner.workspaceId,
        updatedAt: lead.updatedAt,
      },
      data: {
        status,
        internalNotes,
        nextFollowUpAt,
        firstContactedAt,
        closedAt,
      },
    });

    if (updated.count !== 1) {
      throw new Error(
        "This lead changed while you were editing it. Refresh and try again.",
      );
    }

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "Lead",
        entityId: lead.id,
        action: "lead.updated",
        summary:
          status === lead.status
            ? `Updated lead ${lead.reference}`
            : `Moved lead ${lead.reference} from ${lead.status} to ${status}`,
        metadata: {
          previousStatus: lead.status,
          status,
          previousFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null,
          nextFollowUpAt: nextFollowUpAt?.toISOString() ?? null,
          notesChanged: internalNotes !== lead.internalNotes,
        },
      },
    });
  });

  revalidateLeadPages(lead.id);
}

async function generateUniqueClientSlug(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  businessName: string,
  reference: string,
) {
  const base = slugify(businessName) || "client";
  let candidate = base;

  const existing = await tx.client.findFirst({
    where: {
      workspaceId,
      slug: candidate,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    candidate = `${base}-${reference.toLowerCase()}`;
  }

  return candidate;
}

export async function convertLeadToClientAction(
  leadId: string,
  _formData: FormData,
) {
  void _formData;
  const owner = await requireOwner();

  const result = await prisma.$transaction(
    async (tx) => {
      const lead = await tx.lead.findFirst({
        where: {
          id: leadId,
          workspaceId: owner.workspaceId,
        },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (lead.clientId) {
        const linkedClient = await tx.client.findFirst({
          where: {
            id: lead.clientId,
            workspaceId: owner.workspaceId,
          },
          select: {
            id: true,
          },
        });

        if (!linkedClient) {
          throw new Error("The linked client is outside this workspace");
        }

        return {
          clientId: linkedClient.id,
          leadId: lead.id,
          alreadyConverted: true,
        };
      }

      if (!CONVERTIBLE_STATUSES.has(lead.status)) {
        throw new Error(
          "Only new, contacted, or qualified leads can be converted",
        );
      }

      const slug = await generateUniqueClientSlug(
        tx,
        owner.workspaceId,
        lead.businessName,
        lead.reference,
      );
      const client = await tx.client.create({
        data: {
          workspaceId: owner.workspaceId,
          name: lead.businessName,
          slug,
          status: ClientStatus.ACTIVE,
          website: lead.websiteUrl,
          source: lead.referralSource || "Website inquiry",
          summary: lead.desiredOutcome
            ? `${lead.businessConstraint}\n\nDesired outcome: ${lead.desiredOutcome}`
            : lead.businessConstraint,
          internalNotes: `Created from lead ${lead.reference}.`,
          contacts: {
            create: {
              name: `${lead.firstName} ${lead.lastName}`.trim(),
              email: lead.email,
              phone: lead.phone,
              isPrimary: true,
            },
          },
        },
      });

      const convertedAt = new Date();

      await tx.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          clientId: client.id,
          status: LeadStatus.CONVERTED,
          firstContactedAt: lead.firstContactedAt ?? convertedAt,
          convertedAt,
          closedAt: convertedAt,
          nextFollowUpAt: null,
        },
      });

      await tx.activityLog.createMany({
        data: [
          {
            workspaceId: owner.workspaceId,
            actorId: owner.userId,
            entityType: "Lead",
            entityId: lead.id,
            action: "lead.converted",
            summary: `Converted lead ${lead.reference} to client ${client.name}`,
            metadata: {
              clientId: client.id,
              previousStatus: lead.status,
            },
          },
          {
            workspaceId: owner.workspaceId,
            actorId: owner.userId,
            entityType: "Client",
            entityId: client.id,
            action: "client.created_from_lead",
            summary: `Created client ${client.name} from lead ${lead.reference}`,
            metadata: {
              leadId: lead.id,
              leadReference: lead.reference,
            },
          },
        ],
      });

      return {
        clientId: client.id,
        leadId: lead.id,
        alreadyConverted: false,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );

  revalidateLeadPages(result.leadId);
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${result.clientId}`);

  redirect(`/owner/clients/${result.clientId}`);
}

export async function retryLeadNotificationAction(
  notificationId: string,
  _formData: FormData,
) {
  void _formData;
  const owner = await requireOwner();

  const notification = await prisma.leadNotification.findFirst({
    where: {
      id: notificationId,
      workspaceId: owner.workspaceId,
      lead: {
        workspaceId: owner.workspaceId,
      },
    },
    select: {
      id: true,
      leadId: true,
      status: true,
    },
  });

  if (!notification) {
    throw new Error("Lead notification not found");
  }

  if (notification.status === LeadNotificationStatus.SENT) {
    throw new Error("This notification has already been sent");
  }

  if (notification.status === LeadNotificationStatus.PROCESSING) {
    throw new Error("This notification is currently being processed");
  }

  if (notification.status === LeadNotificationStatus.PENDING) {
    revalidateLeadPages(notification.leadId);
    return;
  }

  await prisma.$transaction(async (tx) => {
    const queued = await tx.leadNotification.updateMany({
      where: {
        id: notification.id,
        workspaceId: owner.workspaceId,
        status: LeadNotificationStatus.FAILED,
      },
      data: {
        status: LeadNotificationStatus.PENDING,
        attemptCount: 0,
        nextAttemptAt: null,
        lastError: null,
      },
    });

    if (queued.count !== 1) {
      throw new Error(
        "This notification changed while you were retrying it. Refresh and try again.",
      );
    }

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "Lead",
        entityId: notification.leadId,
        action: "lead_notification.retry_queued",
        summary: "Queued a failed lead notification for retry",
        metadata: {
          notificationId: notification.id,
          previousStatus: notification.status,
        },
      },
    });
  });

  revalidateLeadPages(notification.leadId);
}
