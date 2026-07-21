import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  ClientServiceStatus,
  ClientServiceType,
  ClientStatus,
} from "@/generated/prisma";
import { prisma } from "@/lib/db/prisma";
import {
  getClientDetailForWorkspace,
  listClientsForWorkspace,
} from "@/server/queries/clients";
import { resolveProjectClientAssignmentForWorkspace } from "@/server/queries/projects";

const suffix = randomUUID().replaceAll("-", "").slice(0, 12);

let workspaceId = "";
let otherWorkspaceId = "";
let clientId = "";
let secondClientId = "";
let otherClientId = "";
let websiteServiceId = "";
let secondClientServiceId = "";
let otherWorkspaceServiceId = "";

describe("client business workspaces", () => {
  beforeAll(async () => {
    const [workspace, otherWorkspace] = await Promise.all([
      prisma.workspace.create({
        data: {
          name: "Client Workspace Integration Test",
          slug: `client-workspace-${suffix}`,
        },
      }),
      prisma.workspace.create({
        data: {
          name: "Other Client Workspace Integration Test",
          slug: `client-workspace-other-${suffix}`,
        },
      }),
    ]);

    workspaceId = workspace.id;
    otherWorkspaceId = otherWorkspace.id;

    const [client, secondClient, otherClient] = await Promise.all([
      prisma.client.create({
        data: {
          workspaceId,
          name: `Primary Business ${suffix}`,
          status: ClientStatus.ACTIVE,
        },
      }),
      prisma.client.create({
        data: {
          workspaceId,
          name: `Second Business ${suffix}`,
          status: ClientStatus.ACTIVE,
        },
      }),
      prisma.client.create({
        data: {
          workspaceId: otherWorkspaceId,
          name: `Other Workspace Business ${suffix}`,
          status: ClientStatus.ACTIVE,
        },
      }),
    ]);

    clientId = client.id;
    secondClientId = secondClient.id;
    otherClientId = otherClient.id;

    const [websiteService, secondService, otherService] = await Promise.all([
      prisma.clientService.create({
        data: {
          workspaceId,
          clientId,
          type: ClientServiceType.WEBSITE,
          status: ClientServiceStatus.ACTIVE,
          primaryUrl: "https://primary.example.com/",
        },
      }),
      prisma.clientService.create({
        data: {
          workspaceId,
          clientId: secondClientId,
          type: ClientServiceType.WEBSITE,
          status: ClientServiceStatus.PLANNED,
        },
      }),
      prisma.clientService.create({
        data: {
          workspaceId: otherWorkspaceId,
          clientId: otherClientId,
          type: ClientServiceType.WEBSITE,
          status: ClientServiceStatus.ACTIVE,
        },
      }),
    ]);

    websiteServiceId = websiteService.id;
    secondClientServiceId = secondService.id;
    otherWorkspaceServiceId = otherService.id;

    await Promise.all([
      prisma.project.create({
        data: {
          workspaceId,
          clientId,
          clientServiceId: websiteServiceId,
          name: `Website Project ${suffix}`,
        },
      }),
      prisma.project.create({
        data: {
          workspaceId,
          clientId,
          name: `Unassigned Project ${suffix}`,
        },
      }),
      prisma.project.create({
        data: {
          workspaceId: otherWorkspaceId,
          clientId: otherClientId,
          clientServiceId: otherWorkspaceServiceId,
          name: `Other Workspace Project ${suffix}`,
        },
      }),
    ]);
  });

  afterAll(async () => {
    await prisma.workspace.deleteMany({
      where: {
        id: {
          in: [workspaceId, otherWorkspaceId].filter(Boolean),
        },
      },
    });

    await prisma.$disconnect();
  });

  it("returns business names with project and workstream counts", async () => {
    const clients = await listClientsForWorkspace({ workspaceId });
    const primary = clients.find((client) => client.id === clientId);

    expect(primary?.name).toBe(`Primary Business ${suffix}`);
    expect(primary?._count.projects).toBe(2);
    expect(primary?._count.services).toBe(1);
  });

  it("returns every owned project and configured service on client detail", async () => {
    const detail = await getClientDetailForWorkspace(workspaceId, clientId);

    expect(detail?.projects).toHaveLength(2);
    expect(detail?.projects.map((project) => project.name).sort()).toEqual(
      [`Unassigned Project ${suffix}`, `Website Project ${suffix}`].sort(),
    );
    expect(detail?.services).toHaveLength(1);
    expect(detail?.services[0]?.type).toBe(ClientServiceType.WEBSITE);
    expect(detail?.services[0]?._count.projects).toBe(1);
  });

  it("keeps client detail queries isolated by workspace", async () => {
    await expect(
      getClientDetailForWorkspace(otherWorkspaceId, clientId),
    ).resolves.toBeNull();
  });

  it("allows only one workstream of a given type per client", async () => {
    await expect(
      prisma.clientService.create({
        data: {
          workspaceId,
          clientId,
          type: ClientServiceType.WEBSITE,
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });

    await expect(
      prisma.clientService.count({
        where: {
          type: ClientServiceType.WEBSITE,
        },
      }),
    ).resolves.toBeGreaterThanOrEqual(3);
  });

  it("accepts only a workstream owned by the selected client and workspace", async () => {
    await expect(
      resolveProjectClientAssignmentForWorkspace(
        workspaceId,
        clientId,
        websiteServiceId,
      ),
    ).resolves.toEqual({
      clientId,
      clientServiceId: websiteServiceId,
    });

    await expect(
      resolveProjectClientAssignmentForWorkspace(
        workspaceId,
        clientId,
        secondClientServiceId,
      ),
    ).rejects.toThrow("selected client and workspace");

    await expect(
      resolveProjectClientAssignmentForWorkspace(
        workspaceId,
        clientId,
        otherWorkspaceServiceId,
      ),
    ).rejects.toThrow("selected client and workspace");
  });
});
