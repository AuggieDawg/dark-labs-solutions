import { LeadNotificationStatus, LeadStatus, Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";

const LEAD_STATUS_VALUES = new Set<string>(Object.values(LeadStatus));

export const ACTIVE_LEAD_STATUSES = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
] as const;

export function isLeadStatus(value: string | undefined): value is LeadStatus {
  return Boolean(value && LEAD_STATUS_VALUES.has(value));
}

type ListLeadsInput = {
  workspaceId: string;
  q?: string;
  status?: string;
  followUp?: string;
  notification?: string;
};

export async function listLeadsForWorkspace({
  workspaceId,
  q,
  status,
  followUp,
  notification,
}: ListLeadsInput) {
  const query = q?.trim();
  const where: Prisma.LeadWhereInput = {
    workspaceId,
  };

  if (isLeadStatus(status)) {
    where.status = status;
  }

  if (followUp === "due") {
    if (!isLeadStatus(status)) {
      where.status = {
        in: [...ACTIVE_LEAD_STATUSES],
      };
    }

    where.nextFollowUpAt = {
      lte: new Date(),
    };
  }

  if (notification === "failed") {
    where.notifications = {
      some: {
        status: LeadNotificationStatus.FAILED,
      },
    };
  }

  if (query) {
    where.OR = [
      { reference: { contains: query, mode: "insensitive" } },
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { businessName: { contains: query, mode: "insensitive" } },
      { businessConstraint: { contains: query, mode: "insensitive" } },
    ];
  }

  return prisma.lead.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      reference: true,
      status: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      businessName: true,
      engagementSlug: true,
      nextFollowUpAt: true,
      createdAt: true,
      updatedAt: true,
      clientId: true,
      notifications: {
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

export async function getLeadPipelineSummaryForWorkspace(workspaceId: string) {
  const rows = await prisma.lead.groupBy({
    by: ["status"],
    where: {
      workspaceId,
    },
    _count: {
      _all: true,
    },
  });

  const counts = Object.fromEntries(
    Object.values(LeadStatus).map((status) => [status, 0]),
  ) as Record<LeadStatus, number>;

  for (const row of rows) {
    counts[row.status] = row._count._all;
  }

  return counts;
}

export async function getLeadDetailForWorkspace(
  workspaceId: string,
  leadId: string,
) {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      workspaceId,
    },
    include: {
      notifications: {
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!lead) {
    return null;
  }

  const client = lead.clientId
    ? await prisma.client.findFirst({
        where: {
          id: lead.clientId,
          workspaceId,
        },
        select: {
          id: true,
          name: true,
          company: true,
          status: true,
        },
      })
    : null;

  return {
    ...lead,
    client,
  };
}

export async function getLeadActivityForWorkspace(
  workspaceId: string,
  leadId: string,
) {
  return prisma.activityLog.findMany({
    where: {
      workspaceId,
      entityType: "Lead",
      entityId: leadId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 30,
    select: {
      id: true,
      action: true,
      summary: true,
      metadata: true,
      createdAt: true,
    },
  });
}

export async function getLeadDashboardForWorkspace(workspaceId: string) {
  const now = new Date();

  const [total, newCount, followUpsDue, failedNotifications, recent] =
    await Promise.all([
      prisma.lead.count({
        where: {
          workspaceId,
        },
      }),
      prisma.lead.count({
        where: {
          workspaceId,
          status: LeadStatus.NEW,
        },
      }),
      prisma.lead.count({
        where: {
          workspaceId,
          status: {
            in: [...ACTIVE_LEAD_STATUSES],
          },
          nextFollowUpAt: {
            lte: now,
          },
        },
      }),
      prisma.leadNotification.count({
        where: {
          workspaceId,
          status: LeadNotificationStatus.FAILED,
        },
      }),
      prisma.lead.findMany({
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          reference: true,
          status: true,
          firstName: true,
          lastName: true,
          businessName: true,
          createdAt: true,
        },
      }),
    ]);

  return {
    total,
    newCount,
    followUpsDue,
    failedNotifications,
    recent,
  };
}
