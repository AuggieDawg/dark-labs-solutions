import { ClientStatus, Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";

const CLIENT_STATUS_VALUES = new Set<string>(Object.values(ClientStatus));

export function isClientStatus(
  value: string | undefined,
): value is ClientStatus {
  if (!value) {
    return false;
  }

  return CLIENT_STATUS_VALUES.has(value);
}

type ListClientsInput = {
  workspaceId: string;
  q?: string;
  status?: string;
};

export async function listClientsForWorkspace({
  workspaceId,
  q,
  status,
}: ListClientsInput) {
  const query = q?.trim();

  const where: Prisma.ClientWhereInput = {
    workspaceId,
  };

  if (isClientStatus(status)) {
    where.status = status;
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { company: { contains: query, mode: "insensitive" } },
      { industry: { contains: query, mode: "insensitive" } },
      { source: { contains: query, mode: "insensitive" } },
    ];
  }

  return prisma.client.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          contacts: true,
          projects: {
            where: {
              workspaceId,
            },
          },
          services: {
            where: {
              workspaceId,
            },
          },
          tasks: true,
          notes: true,
        },
      },
    },
  });
}

export async function getClientDetailForWorkspace(
  workspaceId: string,
  clientId: string,
) {
  return prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId,
    },
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      },
      services: {
        where: {
          workspaceId,
        },
        orderBy: [{ type: "asc" }],
        include: {
          _count: {
            select: {
              projects: {
                where: {
                  workspaceId,
                },
              },
            },
          },
        },
      },
      projects: {
        where: {
          workspaceId,
        },
        orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          dueDate: true,
          updatedAt: true,
          clientService: {
            select: {
              id: true,
              type: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: {
          contacts: true,
          projects: {
            where: {
              workspaceId,
            },
          },
          services: {
            where: {
              workspaceId,
            },
          },
          tasks: true,
          notes: true,
        },
      },
    },
  });
}
