import "server-only";

import { prisma } from "@/lib/db/prisma";
export {
  createLeadFormToken,
  hashLeadAbuseIdentifier,
  verifyLeadFormToken,
} from "@/lib/leads/security-core";

type RateLimitInput = {
  workspaceId: string;
  keyHash: string;
  limit: number;
  windowMs: number;
  now?: Date;
};

export async function consumeLeadRateLimit({
  workspaceId,
  keyHash,
  limit,
  windowMs,
  now = new Date(),
}: RateLimitInput) {
  const windowStartedAt = new Date(
    Math.floor(now.getTime() / windowMs) * windowMs,
  );
  const expiresAt = new Date(windowStartedAt.getTime() + windowMs * 2);

  const record = await prisma.leadRateLimit.upsert({
    where: {
      workspaceId_keyHash_windowStartedAt: {
        workspaceId,
        keyHash,
        windowStartedAt,
      },
    },
    create: {
      workspaceId,
      keyHash,
      windowStartedAt,
      expiresAt,
    },
    update: {
      count: {
        increment: 1,
      },
      expiresAt,
    },
    select: {
      count: true,
    },
  });

  return {
    allowed: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
  };
}

export async function pruneExpiredLeadRateLimits(now = new Date()) {
  await prisma.leadRateLimit.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}
