import { Prisma, ProspectStatus } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";

const PROSPECT_STATUS_VALUES = new Set<string>(Object.values(ProspectStatus));

export const ACTIVE_PROSPECT_STATUSES = [
  ProspectStatus.TO_CONTACT,
  ProspectStatus.CONTACTED,
  ProspectStatus.ENGAGED,
  ProspectStatus.QUALIFIED,
] as const;

export function isProspectStatus(
  value: string | undefined,
): value is ProspectStatus {
  return Boolean(value && PROSPECT_STATUS_VALUES.has(value));
}

type ListProspectsInput = {
  workspaceId: string;
  q?: string;
  status?: string;
  followUp?: string;
};

export async function listProspectsForWorkspace({
  workspaceId,
  q,
  status,
  followUp,
}: ListProspectsInput) {
  const query = q?.trim();
  const where: Prisma.ProspectWhereInput = {
    workspaceId,
  };

  if (isProspectStatus(status)) {
    where.status = status;
  }

  if (followUp === "due") {
    where.AND = [
      {
        status: {
          in: [...ACTIVE_PROSPECT_STATUSES],
        },
      },
    ];

    where.nextFollowUpAt = {
      lte: new Date(),
    };
  }

  if (query) {
    where.OR = [
      { businessName: { contains: query, mode: "insensitive" } },
      { contactName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phone: { contains: query, mode: "insensitive" } },
      { industry: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
      { source: { contains: query, mode: "insensitive" } },
    ];
  }

  return prisma.prospect.findMany({
    where,
    orderBy:
      followUp === "due"
        ? [{ nextFollowUpAt: "asc" }, { updatedAt: "desc" }]
        : [{ updatedAt: "desc" }],
    take: 250,
    select: {
      id: true,
      businessName: true,
      contactName: true,
      email: true,
      phone: true,
      status: true,
      lastContactChannel: true,
      lastContactedAt: true,
      nextFollowUpAt: true,
      clientId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getProspectDetailForWorkspace(
  workspaceId: string,
  prospectId: string,
) {
  const prospect = await prisma.prospect.findFirst({
    where: {
      id: prospectId,
      workspaceId,
    },
  });

  if (!prospect) {
    return null;
  }

  const client = prospect.clientId
    ? await prisma.client.findFirst({
        where: {
          id: prospect.clientId,
          workspaceId,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      })
    : null;

  return {
    ...prospect,
    client,
  };
}

export async function getProspectActivityForWorkspace(
  workspaceId: string,
  prospectId: string,
) {
  return prisma.activityLog.findMany({
    where: {
      workspaceId,
      entityType: "Prospect",
      entityId: prospectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      action: true,
      summary: true,
      metadata: true,
      createdAt: true,
    },
  });
}
