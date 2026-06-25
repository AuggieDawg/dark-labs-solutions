import { WorkspaceRole } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";
import {
  getOwnerEmails,
  getPrimaryWorkspaceName,
  getPrimaryWorkspaceSlug,
  normalizeEmail,
} from "@/lib/env/server";

type EnsureOwnerWorkspaceInput = {
  userId: string;
  email: string | null | undefined;
};

export function isOwnerEmail(email: string | null | undefined) {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  return getOwnerEmails().includes(normalized);
}

export async function ensureOwnerWorkspaceForUser({
  userId,
  email,
}: EnsureOwnerWorkspaceInput) {
  if (!isOwnerEmail(email)) {
    return null;
  }

  const workspace = await prisma.workspace.upsert({
    where: {
      slug: getPrimaryWorkspaceSlug(),
    },
    update: {
      name: getPrimaryWorkspaceName(),
    },
    create: {
      slug: getPrimaryWorkspaceSlug(),
      name: getPrimaryWorkspaceName(),
    },
  });

  const membership = await prisma.workspaceMembership.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId,
      },
    },
    update: {
      role: WorkspaceRole.OWNER,
    },
    create: {
      workspaceId: workspace.id,
      userId,
      role: WorkspaceRole.OWNER,
    },
  });

  return {
    workspace,
    membership,
  };
}
