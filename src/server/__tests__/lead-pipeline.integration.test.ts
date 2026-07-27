import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db/prisma";
import { listLeadsForWorkspace } from "@/server/queries/leads";

const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
const workspaceSlug = `lead-test-${suffix}`;
const otherWorkspaceSlug = `lead-test-other-${suffix}`;

let workspaceId = "";
let otherWorkspaceId = "";
let leadId = "";

function leadData(targetWorkspaceId: string, marker: string) {
  return {
    workspaceId: targetWorkspaceId,
    reference: `TEST-${suffix}-${marker}`,
    idempotencyKey: `idempotency-${suffix}`,
    firstName: "Integration",
    lastName: "Test",
    email: `${suffix}@example.com`,
    emailNormalized: `${suffix}@example.com`,
    businessName: `Pipeline Test ${marker}`,
    businessConstraint:
      "Verify that the durable lead pipeline enforces its database invariants.",
    privacyAcknowledgedAt: new Date(),
    privacyNoticeVersion: "integration-test",
  };
}

describe("lead persistence pipeline", () => {
  beforeAll(async () => {
    const [workspace, otherWorkspace] = await Promise.all([
      prisma.workspace.create({
        data: { name: "Lead Integration Test", slug: workspaceSlug },
      }),
      prisma.workspace.create({
        data: {
          name: "Other Lead Integration Test",
          slug: otherWorkspaceSlug,
        },
      }),
    ]);

    workspaceId = workspace.id;
    otherWorkspaceId = otherWorkspace.id;

    const lead = await prisma.lead.create({
      data: leadData(workspaceId, "primary"),
    });
    leadId = lead.id;

    await prisma.lead.create({
      data: leadData(otherWorkspaceId, "other-workspace"),
    });
  });

  afterAll(async () => {
    if (workspaceId || otherWorkspaceId) {
      await prisma.workspace.deleteMany({
        where: {
          id: { in: [workspaceId, otherWorkspaceId].filter(Boolean) },
        },
      });
    }

    await prisma.$disconnect();
  });

  it("enforces idempotency within a workspace", async () => {
    await expect(
      prisma.lead.create({
        data: {
          ...leadData(workspaceId, "duplicate"),
          reference: `TEST-${suffix}-duplicate-reference`,
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("allows the same opaque idempotency key in a different workspace", async () => {
    const leads = await prisma.lead.count({
      where: {
        idempotencyKey: `idempotency-${suffix}`,
      },
    });

    expect(leads).toBe(2);
  });

  it("keeps workspace-scoped lead queries isolated", async () => {
    const visible = await listLeadsForWorkspace({ workspaceId });

    expect(visible).toHaveLength(1);
    expect(visible[0]?.businessName).toBe("Pipeline Test primary");
    expect(visible[0]?.businessName).not.toBe("Pipeline Test other-workspace");
  });

  it("allows only one owner notification of each kind per lead", async () => {
    const notification = {
      workspaceId,
      leadId,
      recipient: "leads@example.com",
    };

    await prisma.leadNotification.create({ data: notification });

    await expect(
      prisma.leadNotification.create({ data: notification }),
    ).rejects.toMatchObject({ code: "P2002" });
  });
});
