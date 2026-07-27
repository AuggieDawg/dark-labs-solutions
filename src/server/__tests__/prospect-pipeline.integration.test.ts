import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ClientStatus, ProspectStatus } from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";
import { listProspectsForWorkspace } from "@/server/queries/prospects";
import {
  convertProspectToClient,
  ProspectConversionError,
} from "@/server/services/prospects";

const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
const workspaceSlug = `prospect-test-${suffix}`;
const otherWorkspaceSlug = `prospect-test-other-${suffix}`;

let workspaceId = "";
let otherWorkspaceId = "";
let userId = "";
let convertibleProspectId = "";
let closedProspectId = "";
let foreignProspectId = "";

describe("outbound prospect pipeline", () => {
  beforeAll(async () => {
    const [workspace, otherWorkspace, user] = await Promise.all([
      prisma.workspace.create({
        data: { name: "Prospect Integration Test", slug: workspaceSlug },
      }),
      prisma.workspace.create({
        data: {
          name: "Other Prospect Integration Test",
          slug: otherWorkspaceSlug,
        },
      }),
      prisma.user.create({
        data: {
          name: "Prospect Test Owner",
          email: `prospect-test-${suffix}@example.com`,
        },
      }),
    ]);

    workspaceId = workspace.id;
    otherWorkspaceId = otherWorkspace.id;
    userId = user.id;

    const [convertible, closed, foreign] = await Promise.all([
      prisma.prospect.create({
        data: {
          workspaceId,
          status: ProspectStatus.ENGAGED,
          businessName: `Prospect Business ${suffix}`,
          contactName: "Primary Owner",
          email: `owner-${suffix}@example.com`,
          emailNormalized: `owner-${suffix}@example.com`,
          websiteUrl: "https://example.com",
          industry: "Professional services",
          source: "Integration test",
          valueHypothesis: "A durable conversion opportunity.",
          firstContactedAt: new Date(),
          lastContactedAt: new Date(),
          nextFollowUpAt: new Date(Date.now() - 60_000),
        },
      }),
      prisma.prospect.create({
        data: {
          workspaceId,
          status: ProspectStatus.DO_NOT_CONTACT,
          businessName: `Closed Prospect ${suffix}`,
          closedAt: new Date(),
        },
      }),
      prisma.prospect.create({
        data: {
          workspaceId: otherWorkspaceId,
          status: ProspectStatus.QUALIFIED,
          businessName: `Foreign Prospect ${suffix}`,
          firstContactedAt: new Date(),
        },
      }),
    ]);

    convertibleProspectId = convertible.id;
    closedProspectId = closed.id;
    foreignProspectId = foreign.id;
  });

  afterAll(async () => {
    if (workspaceId || otherWorkspaceId) {
      await prisma.workspace.deleteMany({
        where: {
          id: { in: [workspaceId, otherWorkspaceId].filter(Boolean) },
        },
      });
    }

    if (userId) {
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    }

    await prisma.$disconnect();
  });

  it("keeps prospect list queries inside the requested workspace", async () => {
    const visible = await listProspectsForWorkspace({ workspaceId });

    expect(visible).toHaveLength(2);
    expect(visible.map((prospect) => prospect.id)).not.toContain(
      foreignProspectId,
    );
  });

  it("rejects conversion through another workspace", async () => {
    await expect(
      convertProspectToClient({
        workspaceId,
        userId,
        prospectId: foreignProspectId,
      }),
    ).rejects.toBeInstanceOf(ProspectConversionError);
  });

  it("converts a prospect atomically into an active client", async () => {
    const result = await convertProspectToClient({
      workspaceId,
      userId,
      prospectId: convertibleProspectId,
    });

    const [prospect, client, activity] = await Promise.all([
      prisma.prospect.findFirst({
        where: { id: convertibleProspectId, workspaceId },
      }),
      prisma.client.findFirst({
        where: { id: result.clientId, workspaceId },
        include: { contacts: true },
      }),
      prisma.activityLog.findMany({
        where: {
          workspaceId,
          OR: [
            {
              entityType: "Prospect",
              entityId: convertibleProspectId,
              action: "prospect.converted",
            },
            {
              entityType: "Client",
              action: "client.created_from_prospect",
            },
          ],
        },
      }),
    ]);

    expect(result.alreadyConverted).toBe(false);
    expect(prospect).toMatchObject({
      status: ProspectStatus.CONVERTED,
      clientId: result.clientId,
      nextFollowUpAt: null,
    });
    expect(prospect?.convertedAt).toBeInstanceOf(Date);
    expect(client).toMatchObject({
      name: `Prospect Business ${suffix}`,
      company: null,
      status: ClientStatus.ACTIVE,
    });
    expect(client?.contacts).toHaveLength(1);
    expect(client?.contacts[0]).toMatchObject({
      name: "Primary Owner",
      isPrimary: true,
    });
    expect(activity).toHaveLength(2);
  });

  it("returns the same client when conversion is retried", async () => {
    const before = await prisma.client.count({ where: { workspaceId } });
    const first = await convertProspectToClient({
      workspaceId,
      userId,
      prospectId: convertibleProspectId,
    });
    const second = await convertProspectToClient({
      workspaceId,
      userId,
      prospectId: convertibleProspectId,
    });
    const after = await prisma.client.count({ where: { workspaceId } });

    expect(first.alreadyConverted).toBe(true);
    expect(second.alreadyConverted).toBe(true);
    expect(second.clientId).toBe(first.clientId);
    expect(after).toBe(before);
  });

  it("does not convert a do-not-contact record", async () => {
    await expect(
      convertProspectToClient({
        workspaceId,
        userId,
        prospectId: closedProspectId,
      }),
    ).rejects.toThrow(
      "Only contacted, engaged, or qualified prospects can become clients",
    );
  });
});
