import { Prisma, ProjectStatus } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";

const PROJECT_STATUS_VALUES = new Set<string>(Object.values(ProjectStatus));

export function isProjectStatus(
  value: string | undefined,
): value is ProjectStatus {
  if (!value) {
    return false;
  }

  return PROJECT_STATUS_VALUES.has(value);
}

type ListProjectsInput = {
  workspaceId: string;
  q?: string;
  status?: string;
};

export async function listProjectsForWorkspace({
  workspaceId,
  q,
  status,
}: ListProjectsInput) {
  const query = q?.trim();

  const where: Prisma.ProjectWhereInput = {
    workspaceId,
  };

  if (isProjectStatus(status)) {
    where.status = status;
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { summary: { contains: query, mode: "insensitive" } },
      { internalNotes: { contains: query, mode: "insensitive" } },
      {
        client: {
          name: { contains: query, mode: "insensitive" },
        },
      },
      {
        client: {
          company: { contains: query, mode: "insensitive" },
        },
      },
    ];
  }

  return prisma.project.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    include: {
      client: {
        select: {
          id: true,
          name: true,
          company: true,
          logoUrl: true,
        },
      },
      _count: {
        select: {
          milestones: true,
          deliverables: true,
          updates: true,
          tasks: true,
          notes: true,
          beforeAfterAssets: true,
        },
      },
    },
  });
}

export async function getProjectDetailForWorkspace(
  workspaceId: string,
  projectId: string,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          company: true,
          logoUrl: true,
        },
      },
      milestones: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      deliverables: {
        orderBy: [{ createdAt: "desc" }],
      },
      beforeAfterAssets: {
        orderBy: [{ createdAt: "desc" }],
      },
      updates: {
        orderBy: [{ createdAt: "desc" }],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          milestones: true,
          deliverables: true,
          updates: true,
          tasks: true,
          notes: true,
          beforeAfterAssets: true,
        },
      },
    },
  });
}

export async function getClientsForProjectSelect(workspaceId: string) {
  return prisma.client.findMany({
    where: {
      workspaceId,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      company: true,
      status: true,
    },
  });
}
