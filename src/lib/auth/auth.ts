import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

import { ensureOwnerWorkspaceForUser } from "@/lib/auth/owner";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(
    prisma as unknown as Parameters<typeof PrismaAdapter>[0],
  ) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const ownerAccess = await ensureOwnerWorkspaceForUser({
          userId: user.id,
          email: user.email,
        });

        session.user.workspaceId = ownerAccess?.workspace.id ?? null;
        session.user.workspaceRole = ownerAccess?.membership.role ?? null;
      }

      return session;
    },
  },
};
