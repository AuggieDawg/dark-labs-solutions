import type { DefaultSession } from "next-auth";

import type { WorkspaceRole } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      workspaceId?: string | null;
      workspaceRole?: WorkspaceRole | null;
    } & DefaultSession["user"];
  }
}
