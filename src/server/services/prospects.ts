import "server-only";

import { ClientStatus, Prisma, ProspectStatus } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";

const CONVERTIBLE_PROSPECT_STATUSES = new Set<ProspectStatus>([
  ProspectStatus.CONTACTED,
  ProspectStatus.ENGAGED,
  ProspectStatus.QUALIFIED,
]);

const MAX_TRANSACTION_ATTEMPTS = 3;

export class ProspectConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProspectConversionError";
  }
}

async function generateUniqueClientSlug(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  businessName: string,
  prospectId: string,
) {
  const base = slugify(businessName) || "client";
  const candidates = [
    base,
    `${base}-${prospectId.slice(-6).toLowerCase()}`,
    `${base}-${prospectId.slice(-10).toLowerCase()}`,
  ];

  for (const candidate of candidates) {
    const existing = await tx.client.findFirst({
      where: {
        workspaceId,
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }
  }

  return `${base}-${prospectId.toLowerCase()}`;
}

type ConvertProspectInput = {
  workspaceId: string;
  userId: string;
  prospectId: string;
};

export async function convertProspectToClient({
  workspaceId,
  userId,
  prospectId,
}: ConvertProspectInput) {
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const prospect = await tx.prospect.findFirst({
            where: {
              id: prospectId,
              workspaceId,
            },
          });

          if (!prospect) {
            throw new ProspectConversionError("Prospect not found");
          }

          if (prospect.clientId) {
            const linkedClient = await tx.client.findFirst({
              where: {
                id: prospect.clientId,
                workspaceId,
              },
              select: {
                id: true,
              },
            });

            if (!linkedClient) {
              throw new ProspectConversionError(
                "The linked client is outside this workspace",
              );
            }

            return {
              prospectId: prospect.id,
              clientId: linkedClient.id,
              alreadyConverted: true,
            };
          }

          if (!CONVERTIBLE_PROSPECT_STATUSES.has(prospect.status)) {
            throw new ProspectConversionError(
              "Only contacted, engaged, or qualified prospects can become clients",
            );
          }

          const slug = await generateUniqueClientSlug(
            tx,
            workspaceId,
            prospect.businessName,
            prospect.id,
          );
          const client = await tx.client.create({
            data: {
              workspaceId,
              name: prospect.businessName,
              slug,
              status: ClientStatus.ACTIVE,
              website: prospect.websiteUrl,
              industry: prospect.industry,
              source: prospect.source || "Outbound prospecting",
              summary: prospect.valueHypothesis,
              contacts: prospect.contactName
                ? {
                    create: {
                      name: prospect.contactName,
                      email: prospect.email,
                      phone: prospect.phone,
                      isPrimary: true,
                    },
                  }
                : undefined,
            },
          });

          const convertedAt = new Date();
          const linked = await tx.prospect.updateMany({
            where: {
              id: prospect.id,
              workspaceId,
              clientId: null,
            },
            data: {
              clientId: client.id,
              status: ProspectStatus.CONVERTED,
              convertedAt,
              closedAt: convertedAt,
              nextFollowUpAt: null,
            },
          });

          if (linked.count !== 1) {
            throw new Error(
              "Prospect changed during conversion; retry the operation",
            );
          }

          await tx.activityLog.createMany({
            data: [
              {
                workspaceId,
                actorId: userId,
                entityType: "Prospect",
                entityId: prospect.id,
                action: "prospect.converted",
                summary: `Converted ${prospect.businessName} to a client`,
                metadata: {
                  clientId: client.id,
                  previousStatus: prospect.status,
                },
              },
              {
                workspaceId,
                actorId: userId,
                entityType: "Client",
                entityId: client.id,
                action: "client.created_from_prospect",
                summary: `Created client ${client.name} from outbound prospecting`,
                metadata: {
                  prospectId: prospect.id,
                },
              },
            ],
          });

          return {
            prospectId: prospect.id,
            clientId: client.id,
            alreadyConverted: false,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      const canRetry =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2034" || error.code === "P2002") &&
        attempt < MAX_TRANSACTION_ATTEMPTS;

      if (!canRetry) {
        throw error;
      }
    }
  }

  throw new ProspectConversionError("Prospect conversion could not complete");
}
