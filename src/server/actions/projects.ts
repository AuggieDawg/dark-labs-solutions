"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  DeliverableStatus,
  MilestoneStatus,
  ProjectPriority,
  ProjectStatus,
  Visibility,
} from "@/generated/prisma";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";

const PROJECT_STATUS_VALUES = new Set<string>(Object.values(ProjectStatus));
const PROJECT_PRIORITY_VALUES = new Set<string>(Object.values(ProjectPriority));
const VISIBILITY_VALUES = new Set<string>(Object.values(Visibility));
const MILESTONE_STATUS_VALUES = new Set<string>(Object.values(MilestoneStatus));
const DELIVERABLE_STATUS_VALUES = new Set<string>(
  Object.values(DeliverableStatus),
);

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

function requiredText(formData: FormData, key: string, label: string) {
  const value = optionalText(formData, key);

  if (!value) {
    throw new Error(`${label} is required`);
  }

  return value;
}

function optionalDate(formData: FormData, key: string) {
  const value = optionalText(formData, key);

  if (!value) {
    return null;
  }

  return new Date(`${value}T12:00:00.000Z`);
}

function optionalBudgetCents(formData: FormData, key: string) {
  const value = optionalText(formData, key);

  if (!value) {
    return null;
  }

  const normalized = value.replace(/,/g, "");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
}

function parseProjectStatus(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return ProjectStatus.DISCOVERY;
  }

  return PROJECT_STATUS_VALUES.has(value)
    ? (value as ProjectStatus)
    : ProjectStatus.DISCOVERY;
}

function parseProjectPriority(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return ProjectPriority.MEDIUM;
  }

  return PROJECT_PRIORITY_VALUES.has(value)
    ? (value as ProjectPriority)
    : ProjectPriority.MEDIUM;
}

function parseVisibility(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return Visibility.OWNER_ONLY;
  }

  return VISIBILITY_VALUES.has(value)
    ? (value as Visibility)
    : Visibility.OWNER_ONLY;
}

function parseMilestoneStatus(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return MilestoneStatus.PLANNED;
  }

  return MILESTONE_STATUS_VALUES.has(value)
    ? (value as MilestoneStatus)
    : MilestoneStatus.PLANNED;
}

function parseDeliverableStatus(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return DeliverableStatus.DRAFT;
  }

  return DELIVERABLE_STATUS_VALUES.has(value)
    ? (value as DeliverableStatus)
    : DeliverableStatus.DRAFT;
}

async function resolveClientIdForWorkspace(
  workspaceId: string,
  clientId: string | null,
) {
  if (!clientId) {
    return null;
  }

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  return client.id;
}

async function generateUniqueProjectSlug(workspaceId: string, name: string) {
  const base = slugify(name) || "project";
  let candidate = base;
  let suffix = 2;

  while (
    await prisma.project.findFirst({
      where: {
        workspaceId,
        slug: candidate,
      },
      select: {
        id: true,
      },
    })
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function requireOwnedProject(projectId: string) {
  const owner = await requireOwner();

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: owner.workspaceId,
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    owner,
    project,
  };
}

export async function createProjectAction(formData: FormData) {
  const owner = await requireOwner();

  const name = requiredText(formData, "name", "Project name");
  const clientId = await resolveClientIdForWorkspace(
    owner.workspaceId,
    optionalText(formData, "clientId"),
  );

  const slug = await generateUniqueProjectSlug(owner.workspaceId, name);

  const project = await prisma.project.create({
    data: {
      workspaceId: owner.workspaceId,
      clientId,
      name,
      slug,
      status: parseProjectStatus(formData.get("status")),
      priority: parseProjectPriority(formData.get("priority")),
      visibility: parseVisibility(formData.get("visibility")),
      summary: optionalText(formData, "summary"),
      clientVisibleSummary: optionalText(formData, "clientVisibleSummary"),
      internalNotes: optionalText(formData, "internalNotes"),
      startDate: optionalDate(formData, "startDate"),
      dueDate: optionalDate(formData, "dueDate"),
      budgetCents: optionalBudgetCents(formData, "budgetDollars"),
      currency: optionalText(formData, "currency") || "USD",
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Project",
      entityId: project.id,
      action: "project.created",
      summary: `Created project ${project.name}`,
      metadata: {
        clientId,
        status: project.status,
        priority: project.priority,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath("/owner/clients");

  redirect(`/owner/projects/${project.id}`);
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const name = requiredText(formData, "name", "Project name");
  const clientId = await resolveClientIdForWorkspace(
    owner.workspaceId,
    optionalText(formData, "clientId"),
  );

  const updated = await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      clientId,
      name,
      status: parseProjectStatus(formData.get("status")),
      priority: parseProjectPriority(formData.get("priority")),
      visibility: parseVisibility(formData.get("visibility")),
      summary: optionalText(formData, "summary"),
      clientVisibleSummary: optionalText(formData, "clientVisibleSummary"),
      internalNotes: optionalText(formData, "internalNotes"),
      startDate: optionalDate(formData, "startDate"),
      dueDate: optionalDate(formData, "dueDate"),
      budgetCents: optionalBudgetCents(formData, "budgetDollars"),
      currency: optionalText(formData, "currency") || "USD",
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Project",
      entityId: updated.id,
      action: "project.updated",
      summary: `Updated project ${updated.name}`,
      metadata: {
        previousName: project.name,
        status: updated.status,
        priority: updated.priority,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
  revalidatePath("/owner/clients");
}

export async function createProjectMilestoneAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const title = requiredText(formData, "title", "Milestone title");

  const existingCount = await prisma.projectMilestone.count({
    where: {
      projectId: project.id,
    },
  });

  const milestone = await prisma.projectMilestone.create({
    data: {
      projectId: project.id,
      title,
      description: optionalText(formData, "description"),
      status: parseMilestoneStatus(formData.get("status")),
      dueDate: optionalDate(formData, "dueDate"),
      visibility: parseVisibility(formData.get("visibility")),
      sortOrder: existingCount,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectMilestone",
      entityId: milestone.id,
      action: "project_milestone.created",
      summary: `Added milestone ${milestone.title} to ${project.name}`,
      metadata: {
        projectId: project.id,
        status: milestone.status,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
}

export async function createProjectDeliverableAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const title = requiredText(formData, "title", "Deliverable title");

  const deliverable = await prisma.projectDeliverable.create({
    data: {
      projectId: project.id,
      title,
      description: optionalText(formData, "description"),
      url: optionalText(formData, "url"),
      status: parseDeliverableStatus(formData.get("status")),
      visibility: parseVisibility(formData.get("visibility")),
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectDeliverable",
      entityId: deliverable.id,
      action: "project_deliverable.created",
      summary: `Added deliverable ${deliverable.title} to ${project.name}`,
      metadata: {
        projectId: project.id,
        status: deliverable.status,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
}

export async function createProjectUpdateAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const body = requiredText(formData, "body", "Update body");

  const update = await prisma.projectUpdate.create({
    data: {
      projectId: project.id,
      authorId: owner.userId,
      title: optionalText(formData, "title"),
      body,
      visibility: parseVisibility(formData.get("visibility")),
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectUpdate",
      entityId: update.id,
      action: "project_update.created",
      summary: `Added update to ${project.name}`,
      metadata: {
        projectId: project.id,
        visibility: update.visibility,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
}

export async function updateProjectMilestoneAction(
  milestoneId: string,
  formData: FormData,
) {
  const owner = await requireOwner();

  const milestone = await prisma.projectMilestone.findFirst({
    where: {
      id: milestoneId,
      project: {
        workspaceId: owner.workspaceId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!milestone) {
    throw new Error("Milestone not found");
  }

  const title = requiredText(formData, "title", "Milestone title");

  const updated = await prisma.projectMilestone.update({
    where: {
      id: milestone.id,
    },
    data: {
      title,
      description: optionalText(formData, "description"),
      status: parseMilestoneStatus(formData.get("status")),
      dueDate: optionalDate(formData, "dueDate"),
      visibility: parseVisibility(formData.get("visibility")),
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectMilestone",
      entityId: updated.id,
      action: "project_milestone.updated",
      summary: `Updated milestone ${updated.title} on ${milestone.project.name}`,
      metadata: {
        projectId: milestone.project.id,
        status: updated.status,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${milestone.project.id}`);
  revalidatePath(
    `/owner/projects/${milestone.project.id}/milestones/${milestone.id}`,
  );
}
