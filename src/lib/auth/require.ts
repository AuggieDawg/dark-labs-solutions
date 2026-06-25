import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { WorkspaceRole } from "@/generated/prisma";
import { authOptions } from "@/lib/auth/auth";
import { ensureOwnerWorkspaceForUser } from "@/lib/auth/owner";

export type OwnerContext = {
  userId: string;
  email: string;
  workspaceId: string;
  workspaceSlug: string;
  role: WorkspaceRole;
};

export async function getOwnerContext(): Promise<OwnerContext | null> {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  const email = session?.user?.email;

  if (!userId || !email) {
    return null;
  }

  const ownerAccess = await ensureOwnerWorkspaceForUser({
    userId,
    email,
  });

  if (!ownerAccess || ownerAccess.membership.role !== WorkspaceRole.OWNER) {
    return null;
  }

  return {
    userId,
    email,
    workspaceId: ownerAccess.workspace.id,
    workspaceSlug: ownerAccess.workspace.slug,
    role: ownerAccess.membership.role,
  };
}

export async function requireOwner() {
  const context = await getOwnerContext();

  if (!context) {
    redirect("/sign-in?callbackUrl=/owner");
  }

  return context;
}
