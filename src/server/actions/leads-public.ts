"use server";

import { randomBytes } from "node:crypto";

import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  LeadBudgetRange,
  LeadNotificationStatus,
  LeadTimeline,
} from "@/generated/prisma";
import { getPrimaryWorkspaceSlug } from "@/lib/env/server";
import type { LeadFormState } from "@/lib/leads/form-state";
import {
  dispatchLeadNotification,
  getLeadNotificationRecipient,
} from "@/lib/leads/notifications";
import {
  consumeLeadRateLimit,
  hashLeadAbuseIdentifier,
  pruneExpiredLeadRateLimits,
  verifyLeadFormToken,
} from "@/lib/leads/security";
import {
  flattenLeadFieldErrors,
  leadInputFromFormData,
  leadIntakeSchema,
} from "@/lib/leads/validation";
import { prisma } from "@/lib/db/prisma";

const PRIVACY_NOTICE_VERSION = "2026-07-21";

function publicReference() {
  return `DL-${new Date().getUTCFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function requestIp(requestHeaders: Headers) {
  const forwarded = requestHeaders.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip")?.trim();

  return candidate?.slice(0, 100) || null;
}

function formError(
  message: string,
  fieldErrors?: Record<string, string[]>,
): LeadFormState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function submitLeadAction(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  if (process.env.CONTACT_FORM_ENABLED?.trim().toLowerCase() === "false") {
    return formError(
      "Project intake is temporarily unavailable. Please use the contact details on this page.",
    );
  }

  const parsed = leadIntakeSchema.safeParse(leadInputFromFormData(formData));

  if (!parsed.success) {
    return formError(
      "Review the highlighted fields and try again.",
      flattenLeadFieldErrors(parsed.error),
    );
  }

  const token = verifyLeadFormToken(parsed.data.formToken);

  if (!token) {
    return formError(
      "This form session expired or was submitted too quickly. Refresh the page and try again.",
    );
  }

  if (parsed.data.companyWebsite) {
    redirect("/contact/thank-you");
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: getPrimaryWorkspaceSlug() },
    select: { id: true },
  });

  if (!workspace) {
    return formError(
      "We could not accept the inquiry right now. Please use the contact details on this page.",
    );
  }

  const existing = await prisma.lead.findUnique({
    where: {
      workspaceId_idempotencyKey: {
        workspaceId: workspace.id,
        idempotencyKey: token.idempotencyKey,
      },
    },
    select: { reference: true },
  });

  if (existing) {
    redirect(
      `/contact/thank-you?reference=${encodeURIComponent(existing.reference)}`,
    );
  }

  const requestHeaders = await headers();
  const ip = requestIp(requestHeaders);
  const limits = [
    consumeLeadRateLimit({
      workspaceId: workspace.id,
      keyHash: hashLeadAbuseIdentifier("email", parsed.data.email),
      limit: 3,
      windowMs: 60 * 60 * 1_000,
    }),
  ];

  if (ip) {
    limits.push(
      consumeLeadRateLimit({
        workspaceId: workspace.id,
        keyHash: hashLeadAbuseIdentifier("ip", ip),
        limit: 10,
        windowMs: 15 * 60 * 1_000,
      }),
    );
  }

  const consumed = await Promise.all(limits);

  if (consumed.some((limit) => !limit.allowed)) {
    return formError(
      "We could not accept another inquiry from this form right now. Please wait and try again later.",
    );
  }

  const recipient = getLeadNotificationRecipient();
  const reference = publicReference();
  let created: { reference: string; notificationId: string | null };

  try {
    created = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          workspaceId: workspace.id,
          reference,
          idempotencyKey: token.idempotencyKey,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          emailNormalized: parsed.data.email,
          phone: parsed.data.phone,
          businessName: parsed.data.businessName,
          websiteUrl: parsed.data.websiteUrl,
          engagementSlug: parsed.data.engagementSlug,
          businessConstraint: parsed.data.businessConstraint,
          desiredOutcome: parsed.data.desiredOutcome,
          timeline: parsed.data.timeline as LeadTimeline | undefined,
          budgetRange: parsed.data.budgetRange as LeadBudgetRange | undefined,
          referralSource: parsed.data.referralSource,
          sourcePath: parsed.data.sourcePath,
          landingPath: parsed.data.landingPath,
          referrerUrl: parsed.data.referrerUrl,
          utmSource: parsed.data.utmSource,
          utmMedium: parsed.data.utmMedium,
          utmCampaign: parsed.data.utmCampaign,
          utmTerm: parsed.data.utmTerm,
          utmContent: parsed.data.utmContent,
          privacyAcknowledgedAt: new Date(),
          privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
        },
      });

      const notification = await tx.leadNotification.create({
        data: {
          workspaceId: workspace.id,
          leadId: lead.id,
          recipient: recipient ?? "unconfigured",
          status: recipient
            ? LeadNotificationStatus.PENDING
            : LeadNotificationStatus.FAILED,
          attemptCount: recipient ? 0 : 5,
          lastError: recipient
            ? null
            : "LEAD_NOTIFICATION_EMAIL is not configured.",
        },
        select: { id: true },
      });

      await tx.activityLog.create({
        data: {
          workspaceId: workspace.id,
          entityType: "Lead",
          entityId: lead.id,
          action: "lead.created",
          summary: `Accepted project inquiry ${lead.reference}`,
          metadata: {
            engagementSlug: lead.engagementSlug,
            timeline: lead.timeline,
            budgetRange: lead.budgetRange,
          },
        },
      });

      return {
        reference: lead.reference,
        notificationId: recipient ? notification.id : null,
      };
    });
  } catch {
    const duplicate = await prisma.lead.findUnique({
      where: {
        workspaceId_idempotencyKey: {
          workspaceId: workspace.id,
          idempotencyKey: token.idempotencyKey,
        },
      },
      select: { reference: true },
    });

    if (duplicate) {
      redirect(
        `/contact/thank-you?reference=${encodeURIComponent(duplicate.reference)}`,
      );
    }

    return formError(
      "We could not safely store the inquiry. Nothing was submitted; please try again or use the contact details on this page.",
    );
  }

  if (created.notificationId) {
    after(async () => {
      await dispatchLeadNotification(created.notificationId!);
    });
  }

  after(async () => {
    await pruneExpiredLeadRateLimits();
  });

  redirect(
    `/contact/thank-you?reference=${encodeURIComponent(created.reference)}`,
  );
}
