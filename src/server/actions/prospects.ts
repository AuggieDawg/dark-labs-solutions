"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProspectStatus } from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import type { ProspectActionState } from "@/lib/prospects/form-state";
import {
  createProspectSchema,
  flattenProspectFieldErrors,
  normalizeProspectEmail,
  prospectFormData,
  recordProspectOutreachSchema,
  updateProspectSchema,
} from "@/lib/prospects/validation";
import {
  convertProspectToClient,
  ProspectConversionError,
} from "@/server/services/prospects";

const CLOSED_PROSPECT_STATUSES = new Set<ProspectStatus>([
  ProspectStatus.NOT_INTERESTED,
  ProspectStatus.DO_NOT_CONTACT,
  ProspectStatus.CONVERTED,
  ProspectStatus.ARCHIVED,
]);

const CONTACTED_PROSPECT_STATUSES = new Set<ProspectStatus>([
  ProspectStatus.CONTACTED,
  ProspectStatus.ENGAGED,
  ProspectStatus.QUALIFIED,
]);

const OUTREACH_BLOCKED_STATUSES = new Set<ProspectStatus>([
  ProspectStatus.NOT_INTERESTED,
  ProspectStatus.DO_NOT_CONTACT,
  ProspectStatus.CONVERTED,
  ProspectStatus.ARCHIVED,
]);

function invalidState(
  message: string,
  fieldErrors?: Record<string, string[]>,
): ProspectActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

async function requireOwnedProspect(prospectId: string) {
  const owner = await requireOwner();
  const prospect = await prisma.prospect.findFirst({
    where: {
      id: prospectId,
      workspaceId: owner.workspaceId,
    },
    select: {
      id: true,
      workspaceId: true,
      businessName: true,
      status: true,
      clientId: true,
      firstContactedAt: true,
      closedAt: true,
      updatedAt: true,
    },
  });

  if (!prospect) {
    throw new Error("Prospect not found");
  }

  return {
    owner,
    prospect,
  };
}

function revalidateProspectPages(prospectId: string) {
  revalidatePath("/owner");
  revalidatePath("/owner/prospects");
  revalidatePath(`/owner/prospects/${prospectId}`);
}

export async function createProspectAction(
  _previousState: ProspectActionState,
  formData: FormData,
): Promise<ProspectActionState> {
  const owner = await requireOwner();
  const parsed = createProspectSchema.safeParse(prospectFormData(formData));

  if (!parsed.success) {
    return invalidState(
      "Review the highlighted prospect fields.",
      flattenProspectFieldErrors(parsed.error),
    );
  }

  if (parsed.data.status !== ProspectStatus.TO_CONTACT) {
    return invalidState(
      "Create the prospect first, then record outreach from its profile.",
      { status: ["A new prospect must begin as To contact"] },
    );
  }

  const isClosed = CLOSED_PROSPECT_STATUSES.has(parsed.data.status);

  const prospect = await prisma.$transaction(async (tx) => {
    const created = await tx.prospect.create({
      data: {
        workspaceId: owner.workspaceId,
        status: parsed.data.status,
        businessName: parsed.data.businessName,
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        emailNormalized: normalizeProspectEmail(parsed.data.email),
        phone: parsed.data.phone,
        websiteUrl: parsed.data.websiteUrl,
        industry: parsed.data.industry,
        location: parsed.data.location,
        source: parsed.data.source,
        valueHypothesis: parsed.data.valueHypothesis,
        internalNotes: parsed.data.internalNotes,
        nextFollowUpAt: isClosed ? null : parsed.data.nextFollowUpDate,
        firstContactedAt: null,
        closedAt: null,
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "Prospect",
        entityId: created.id,
        action: "prospect.created",
        summary: `Added outbound prospect ${created.businessName}`,
        metadata: {
          status: created.status,
          source: created.source,
        },
      },
    });

    return created;
  });

  revalidateProspectPages(prospect.id);
  redirect(`/owner/prospects/${prospect.id}`);
}

export async function updateProspectAction(
  prospectId: string,
  _previousState: ProspectActionState,
  formData: FormData,
): Promise<ProspectActionState> {
  const { owner, prospect } = await requireOwnedProspect(prospectId);
  const parsed = updateProspectSchema.safeParse(prospectFormData(formData));

  if (!parsed.success) {
    return invalidState(
      "Review the highlighted prospect fields.",
      flattenProspectFieldErrors(parsed.error),
    );
  }

  if (parsed.data.updatedAt.getTime() !== prospect.updatedAt.getTime()) {
    return invalidState(
      "This prospect changed while you were editing it. Refresh and try again.",
    );
  }

  if (
    prospect.status === ProspectStatus.CONVERTED &&
    parsed.data.status !== ProspectStatus.CONVERTED
  ) {
    return invalidState("A converted prospect cannot return to the pipeline.");
  }

  if (
    prospect.status === ProspectStatus.DO_NOT_CONTACT &&
    parsed.data.status !== ProspectStatus.DO_NOT_CONTACT
  ) {
    return invalidState(
      "A do-not-contact record cannot be reopened from this workflow.",
    );
  }

  if (parsed.data.status === ProspectStatus.CONVERTED && !prospect.clientId) {
    return invalidState("Use Convert to client to complete this transition.", {
      status: ["Conversion must create and link a client atomically"],
    });
  }

  if (
    !prospect.firstContactedAt &&
    CONTACTED_PROSPECT_STATUSES.has(parsed.data.status)
  ) {
    return invalidState("Record outreach before advancing this prospect.", {
      status: ["Use Record outreach to establish the first contact time"],
    });
  }

  const now = new Date();
  const isClosed = CLOSED_PROSPECT_STATUSES.has(parsed.data.status);

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.prospect.updateMany({
      where: {
        id: prospect.id,
        workspaceId: owner.workspaceId,
        updatedAt: parsed.data.updatedAt,
      },
      data: {
        status: parsed.data.status,
        businessName: parsed.data.businessName,
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        emailNormalized: normalizeProspectEmail(parsed.data.email),
        phone: parsed.data.phone,
        websiteUrl: parsed.data.websiteUrl,
        industry: parsed.data.industry,
        location: parsed.data.location,
        source: parsed.data.source,
        valueHypothesis: parsed.data.valueHypothesis,
        internalNotes: parsed.data.internalNotes,
        nextFollowUpAt: isClosed ? null : parsed.data.nextFollowUpDate,
        closedAt: isClosed ? (prospect.closedAt ?? now) : null,
      },
    });

    if (updated.count !== 1) {
      return false;
    }

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "Prospect",
        entityId: prospect.id,
        action: "prospect.updated",
        summary:
          parsed.data.status === prospect.status
            ? `Updated prospect ${parsed.data.businessName}`
            : `Moved ${parsed.data.businessName} from ${prospect.status} to ${parsed.data.status}`,
        metadata: {
          previousStatus: prospect.status,
          status: parsed.data.status,
          nextFollowUpAt:
            (isClosed ? null : parsed.data.nextFollowUpDate)?.toISOString() ??
            null,
        },
      },
    });

    return true;
  });

  if (!result) {
    return invalidState(
      "This prospect changed while you were editing it. Refresh and try again.",
    );
  }

  revalidateProspectPages(prospect.id);

  return {
    status: "success",
    message: "Prospect saved.",
  };
}

export async function recordProspectOutreachAction(
  prospectId: string,
  _previousState: ProspectActionState,
  formData: FormData,
): Promise<ProspectActionState> {
  const { owner, prospect } = await requireOwnedProspect(prospectId);
  const parsed = recordProspectOutreachSchema.safeParse(
    prospectFormData(formData),
  );

  if (!parsed.success) {
    return invalidState(
      "Review the outreach details.",
      flattenProspectFieldErrors(parsed.error),
    );
  }

  if (parsed.data.updatedAt.getTime() !== prospect.updatedAt.getTime()) {
    return invalidState(
      "This prospect changed while you were recording outreach. Refresh and try again.",
    );
  }

  if (OUTREACH_BLOCKED_STATUSES.has(prospect.status)) {
    return invalidState(
      "Reopen this prospect before recording outreach. Do-not-contact and converted records cannot be reopened.",
    );
  }

  const contactedAt = new Date();
  const status =
    prospect.status === ProspectStatus.TO_CONTACT
      ? ProspectStatus.CONTACTED
      : prospect.status;

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.prospect.updateMany({
      where: {
        id: prospect.id,
        workspaceId: owner.workspaceId,
        updatedAt: parsed.data.updatedAt,
      },
      data: {
        status,
        lastContactChannel: parsed.data.channel,
        firstContactedAt: prospect.firstContactedAt ?? contactedAt,
        lastContactedAt: contactedAt,
        nextFollowUpAt: parsed.data.nextFollowUpDate,
        closedAt: null,
      },
    });

    if (updated.count !== 1) {
      return false;
    }

    await tx.activityLog.create({
      data: {
        workspaceId: owner.workspaceId,
        actorId: owner.userId,
        entityType: "Prospect",
        entityId: prospect.id,
        action: "prospect.outreach_recorded",
        summary: `Recorded ${parsed.data.channel.toLowerCase().replaceAll("_", " ")} outreach for ${prospect.businessName}`,
        metadata: {
          channel: parsed.data.channel,
          outcome: parsed.data.outcome,
          contactedAt: contactedAt.toISOString(),
          nextFollowUpAt: parsed.data.nextFollowUpDate?.toISOString() ?? null,
        },
      },
    });

    return true;
  });

  if (!result) {
    return invalidState(
      "This prospect changed while you were recording outreach. Refresh and try again.",
    );
  }

  revalidateProspectPages(prospect.id);

  return {
    status: "success",
    message: "Outreach recorded.",
  };
}

export async function convertProspectToClientAction(
  prospectId: string,
  _previousState: ProspectActionState,
  _formData: FormData,
): Promise<ProspectActionState> {
  void _formData;
  const owner = await requireOwner();
  let result;

  try {
    result = await convertProspectToClient({
      workspaceId: owner.workspaceId,
      userId: owner.userId,
      prospectId,
    });
  } catch (error) {
    if (error instanceof ProspectConversionError) {
      return invalidState(error.message);
    }

    throw error;
  }

  revalidateProspectPages(result.prospectId);
  revalidatePath("/owner/clients");
  revalidatePath(`/owner/clients/${result.clientId}`);

  redirect(`/owner/clients/${result.clientId}`);
}
