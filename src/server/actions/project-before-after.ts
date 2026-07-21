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

function revalidateProjectPublishing(projectId: string) {
  revalidatePath("/owner");
  revalidatePath("/owner/projects");
  revalidatePath(`/owner/projects/${projectId}`);
  revalidatePath(`/owner/projects/${projectId}/before-after`);
  revalidatePath(`/owner/projects/${projectId}/work-page`);
  revalidatePath("/services");
  revalidatePath("/work");
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

  const totalUploadBytes = (beforeImage?.size ?? 0) + (afterImage?.size ?? 0);

  if (totalUploadBytes > 3 * 1024 * 1024) {
    throw new Error(
      "Before and after images must total 3 MB or less per submission",
    );
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

  revalidateProjectPublishing(project.id);
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

  revalidateProjectPublishing(asset.project.id);
}
