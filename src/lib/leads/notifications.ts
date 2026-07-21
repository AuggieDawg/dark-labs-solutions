import "server-only";

import { LeadNotificationStatus } from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";
import { buildOwnerLeadEmail } from "@/lib/leads/notification-content";

const MAX_NOTIFICATION_ATTEMPTS = 5;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getLeadNotificationRecipient() {
  const value = process.env.LEAD_NOTIFICATION_EMAIL?.trim().toLowerCase() || "";

  return isEmail(value) ? value : null;
}

function getNotificationFromEmail() {
  const value = process.env.LEAD_FROM_EMAIL?.trim() || "";
  return isEmail(value) ? value : null;
}

function retryAt(attemptCount: number) {
  const minutes = Math.min(60, 2 ** Math.max(0, attemptCount - 1));
  return new Date(Date.now() + minutes * 60 * 1_000);
}

function safeProviderError(value: unknown) {
  const message =
    value instanceof Error ? value.message : "Unknown provider error";
  return message.replace(/[\r\n]+/g, " ").slice(0, 500);
}

async function markNotificationFailed(
  notificationId: string,
  attemptCount: number,
  error: unknown,
) {
  await prisma.$transaction(async (tx) => {
    const notification = await tx.leadNotification.update({
      where: { id: notificationId },
      data: {
        status: LeadNotificationStatus.FAILED,
        lastError: safeProviderError(error),
        nextAttemptAt:
          attemptCount < MAX_NOTIFICATION_ATTEMPTS
            ? retryAt(attemptCount)
            : null,
      },
      select: {
        workspaceId: true,
        leadId: true,
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId: notification.workspaceId,
        entityType: "Lead",
        entityId: notification.leadId,
        action: "lead_notification.failed",
        summary: "Lead notification delivery failed",
        metadata: {
          notificationId,
          attemptCount,
        },
      },
    });
  });
}

export async function dispatchLeadNotification(notificationId: string) {
  const now = new Date();
  const claimed = await prisma.leadNotification.updateMany({
    where: {
      id: notificationId,
      status: {
        in: [LeadNotificationStatus.PENDING, LeadNotificationStatus.FAILED],
      },
      attemptCount: {
        lt: MAX_NOTIFICATION_ATTEMPTS,
      },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
    },
    data: {
      status: LeadNotificationStatus.PROCESSING,
      attemptCount: { increment: 1 },
      lastAttemptAt: now,
      nextAttemptAt: null,
    },
  });

  if (claimed.count !== 1) {
    return { delivered: false, skipped: true } as const;
  }

  const notification = await prisma.leadNotification.findUnique({
    where: { id: notificationId },
    include: { lead: true },
  });

  if (!notification) {
    return { delivered: false, skipped: true } as const;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getNotificationFromEmail();
  const recipient = isEmail(notification.recipient)
    ? notification.recipient
    : getLeadNotificationRecipient();

  if (!apiKey || !from || !recipient) {
    await markNotificationFailed(
      notification.id,
      notification.attemptCount,
      new Error("Lead notification email is not fully configured."),
    );
    return { delivered: false, skipped: false } as const;
  }

  const email = buildOwnerLeadEmail(notification.lead);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `lead-owner-${notification.id}`,
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: notification.lead.email,
        subject: email.subject,
        text: email.text,
      }),
      signal: AbortSignal.timeout(8_000),
    });

    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    if (!response.ok || !payload?.id) {
      throw new Error(
        `Resend rejected the notification (${response.status}): ${payload?.message ?? "no provider message"}`,
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.leadNotification.update({
        where: { id: notification.id },
        data: {
          status: LeadNotificationStatus.SENT,
          provider: "resend",
          recipient,
          providerMessageId: payload.id,
          sentAt: new Date(),
          nextAttemptAt: null,
          lastError: null,
        },
      });

      await tx.activityLog.create({
        data: {
          workspaceId: notification.workspaceId,
          entityType: "Lead",
          entityId: notification.leadId,
          action: "lead_notification.sent",
          summary: "Lead notification accepted by email provider",
          metadata: {
            notificationId: notification.id,
            provider: "resend",
            attemptCount: notification.attemptCount,
          },
        },
      });
    });

    return { delivered: true, skipped: false } as const;
  } catch (error) {
    await markNotificationFailed(
      notification.id,
      notification.attemptCount,
      error,
    );
    return { delivered: false, skipped: false } as const;
  }
}

export async function dispatchDueLeadNotifications(limit = 10) {
  const staleClaimThreshold = new Date(Date.now() - 10 * 60 * 1_000);

  await prisma.leadNotification.updateMany({
    where: {
      status: LeadNotificationStatus.PROCESSING,
      lastAttemptAt: { lte: staleClaimThreshold },
    },
    data: {
      status: LeadNotificationStatus.FAILED,
      lastError: "A previous notification attempt did not finish.",
      nextAttemptAt: new Date(),
    },
  });

  const due = await prisma.leadNotification.findMany({
    where: {
      status: {
        in: [LeadNotificationStatus.PENDING, LeadNotificationStatus.FAILED],
      },
      attemptCount: { lt: MAX_NOTIFICATION_ATTEMPTS },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }],
    },
    orderBy: { createdAt: "asc" },
    take: Math.min(Math.max(limit, 1), 25),
    select: { id: true },
  });

  const results = [];

  for (const notification of due) {
    results.push(await dispatchLeadNotification(notification.id));
  }

  return {
    attempted: results.filter((result) => !result.skipped).length,
    delivered: results.filter((result) => result.delivered).length,
  };
}
