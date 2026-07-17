import { ServiceCategory } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";
import { getPrimaryWorkspaceSlug } from "@/lib/env/server";

export async function getPublicShowcaseProjects() {
  return prisma.project.findMany({
    where: {
      showcaseEnabled: true,
      showcaseService: {
        not: null,
      },
      workspace: {
        slug: getPrimaryWorkspaceSlug(),
      },
    },
    orderBy: [{ showcaseSortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      client: {
        select: {
          id: true,
          name: true,
          company: true,
          logoUrl: true,
          website: true,
        },
      },
      beforeAfterAssets: {
        where: {
          publicEnabled: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}

export function groupShowcaseProjectsByService<
  T extends { showcaseService: ServiceCategory | null },
>(projects: T[]) {
  return {
    WEBSITES: projects.filter(
      (project) => project.showcaseService === "WEBSITES",
    ),
    AUTOMATIONS: projects.filter(
      (project) => project.showcaseService === "AUTOMATIONS",
    ),
    DASHBOARDS: projects.filter(
      (project) => project.showcaseService === "DASHBOARDS",
    ),
    PLATFORMS: projects.filter(
      (project) => project.showcaseService === "PLATFORMS",
    ),
  };
}
