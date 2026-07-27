"use server";

import { revalidatePath } from "next/cache";

import {
  GoalArea,
  GoalPriority,
  GoalStatus,
  Visibility,
} from "@/generated/prisma";
import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";

const AREA_VALUES = new Set<string>(Object.values(GoalArea));
const PRIORITY_VALUES = new Set<string>(Object.values(GoalPriority));

export type CreateGoalInput = {
  title: string;
  description?: string;
  area: GoalArea;
  priority: GoalPriority;
  targetDate?: string;
  isMaster: boolean;
  parentGoalId?: string;
};

function cleanText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function parseTargetDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Target date is invalid");
  }

  return date;
}

function finiteCoordinate(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Map position is invalid");
  }

  return Math.min(5000, Math.max(-5000, value));
}

export async function createGoalAction(input: CreateGoalInput) {
  const owner = await requireOwner();
  const title = cleanText(input.title);

  if (!title) {
    throw new Error("Goal title is required");
  }

  if (title.length > 140) {
    throw new Error("Goal title must be 140 characters or fewer");
  }

  const area = AREA_VALUES.has(input.area) ? input.area : GoalArea.BUSINESS;
  const priority = PRIORITY_VALUES.has(input.priority)
    ? input.priority
    : GoalPriority.MEDIUM;

  let parentGoal:
    | {
        id: string;
        mapX: number;
        mapY: number;
        _count: { childGoals: number };
      }
    | null = null;

  if (!input.isMaster && input.parentGoalId) {
    parentGoal = await prisma.goal.findFirst({
      where: {
        id: input.parentGoalId,
        workspaceId: owner.workspaceId,
        isMaster: true,
      },
      select: {
        id: true,
        mapX: true,
        mapY: true,
        _count: {
          select: {
            childGoals: true,
          },
        },
      },
    });

    if (!parentGoal) {
      throw new Error("Master goal not found");
    }
  }

  const matchingGoalCount = await prisma.goal.count({
    where: {
      workspaceId: owner.workspaceId,
      isMaster: input.isMaster,
    },
  });

  const childOffset = parentGoal
    ? parentGoal._count.childGoals * 250
    : 0;
  const mapX = parentGoal
    ? parentGoal.mapX + childOffset
    : 80 + (matchingGoalCount % 4) * 280;
  const mapY = parentGoal
    ? parentGoal.mapY + 230
    : input.isMaster
      ? 70 + Math.floor(matchingGoalCount / 4) * 220
      : 330 + Math.floor(matchingGoalCount / 4) * 190;

  const goal = await prisma.goal.create({
    data: {
      workspaceId: owner.workspaceId,
      parentGoalId: input.isMaster ? null : parentGoal?.id,
      title,
      description: cleanText(input.description),
      area,
      priority,
      status: GoalStatus.ACTIVE,
      targetDate: parseTargetDate(input.targetDate),
      isMaster: input.isMaster,
      mapX,
      mapY,
      visibility: Visibility.OWNER_ONLY,
    },
    select: {
      id: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "Goal",
      entityId: goal.id,
      action: "created",
      summary: input.isMaster
        ? `Created master goal: ${title}`
        : `Created goal: ${title}`,
    },
  });

  revalidatePath("/owner/goals");

  return goal;
}

export async function moveGoalAction(input: {
  goalId: string;
  mapX: number;
  mapY: number;
}) {
  const owner = await requireOwner();
  const result = await prisma.goal.updateMany({
    where: {
      id: input.goalId,
      workspaceId: owner.workspaceId,
    },
    data: {
      mapX: finiteCoordinate(input.mapX),
      mapY: finiteCoordinate(input.mapY),
    },
  });

  if (result.count !== 1) {
    throw new Error("Goal not found");
  }
}

export async function assignGoalToMasterAction(input: {
  goalId: string;
  masterGoalId: string | null;
}) {
  const owner = await requireOwner();
  const goal = await prisma.goal.findFirst({
    where: {
      id: input.goalId,
      workspaceId: owner.workspaceId,
      isMaster: false,
    },
    select: {
      id: true,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  if (input.masterGoalId) {
    const masterGoal = await prisma.goal.findFirst({
      where: {
        id: input.masterGoalId,
        workspaceId: owner.workspaceId,
        isMaster: true,
      },
      select: {
        id: true,
      },
    });

    if (!masterGoal) {
      throw new Error("Master goal not found");
    }
  }

  await prisma.goal.update({
    where: {
      id: goal.id,
    },
    data: {
      parentGoalId: input.masterGoalId,
    },
  });

  revalidatePath("/owner/goals");
}
