"use server";

import { revalidatePath } from "next/cache";

import { requireOwner } from "@/lib/auth/require";
import { prisma } from "@/lib/db/prisma";
import { savePublicImageUpload } from "@/lib/uploads/images";

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
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

async function requireOwnedBeforeAfterAsset(assetId: string) {
  const owner = await requireOwner();

  const asset = await prisma.projectBeforeAfterAsset.findFirst({
    where: {
      id: assetId,
      project: {
        workspaceId: owner.workspaceId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          workspaceId: true,
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Before/after asset not found");
  }

  return {
    owner,
    asset,
  };
}

export async function createProjectBeforeAfterAssetAction(
  projectId: string,
  formData: FormData,
) {
  const { owner, project } = await requireOwnedProject(projectId);

  const beforeValue = formData.get("beforeImage");
  const afterValue = formData.get("afterImage");

  const beforeImage =
    beforeValue instanceof File && beforeValue.size > 0 ? beforeValue : null;
  const afterImage =
    afterValue instanceof File && afterValue.size > 0 ? afterValue : null;

  if (!beforeImage && !afterImage) {
    throw new Error("Upload at least one before or after image");
  }

  const [beforeImageUrl, afterImageUrl] = await Promise.all([
    savePublicImageUpload({
      file: beforeImage,
      segments: ["projects", project.id, "before-after"],
    }),
    savePublicImageUpload({
      file: afterImage,
      segments: ["projects", project.id, "before-after"],
    }),
  ]);

  const asset = await prisma.projectBeforeAfterAsset.create({
    data: {
      projectId: project.id,
      label: optionalText(formData, "label"),
      notes: optionalText(formData, "notes"),
      beforeImageUrl,
      afterImageUrl,
      publicEnabled: formData.get("publicEnabled") === "on",
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectBeforeAfterAsset",
      entityId: asset.id,
      action: "project_before_after.created",
      summary: `Added before/after asset to ${project.name}`,
      metadata: {
        projectId: project.id,
        hasBefore: Boolean(beforeImageUrl),
        hasAfter: Boolean(afterImageUrl),
        publicEnabled: asset.publicEnabled,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${project.id}`);
  revalidatePath(`/owner/projects/${project.id}/before-after`);
  revalidatePath("/services");
}

export async function updateProjectBeforeAfterAssetAction(
  assetId: string,
  formData: FormData,
) {
  const { owner, asset } = await requireOwnedBeforeAfterAsset(assetId);

  const updated = await prisma.projectBeforeAfterAsset.update({
    where: {
      id: asset.id,
    },
    data: {
      label: optionalText(formData, "label"),
      notes: optionalText(formData, "notes"),
      publicEnabled: formData.get("publicEnabled") === "on",
    },
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: owner.workspaceId,
      actorId: owner.userId,
      entityType: "ProjectBeforeAfterAsset",
      entityId: updated.id,
      action: "project_before_after.updated",
      summary: `Updated before/after asset on ${asset.project.name}`,
      metadata: {
        projectId: asset.project.id,
        publicEnabled: updated.publicEnabled,
      },
    },
  });

  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${asset.project.id}`);
  revalidatePath(`/owner/projects/${asset.project.id}/before-after`);
  revalidatePath("/services");
}
