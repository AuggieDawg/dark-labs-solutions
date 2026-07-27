export const dynamic = "force-dynamic";

import { GoalWorkspace } from "@/components/owner/goals/GoalWorkspace";
import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Goals",
};

export default async function OwnerGoalsPage() {
  const owner = await requireOwner();
  const goals = await prisma.goal.findMany({
    where: {
      workspaceId: owner.workspaceId,
      status: {
        not: "ARCHIVED",
      },
    },
    orderBy: [
      {
        isMaster: "desc",
      },
      {
        priority: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      parentGoalId: true,
      title: true,
      description: true,
      area: true,
      status: true,
      priority: true,
      targetDate: true,
      progress: true,
      isMaster: true,
      mapX: true,
      mapY: true,
    },
  });

  return (
    <GoalWorkspace
      initialGoals={goals.map((goal) => ({
        ...goal,
        targetDate: goal.targetDate?.toISOString() ?? null,
      }))}
    />
  );
}
