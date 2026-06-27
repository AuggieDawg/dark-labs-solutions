-- CreateTable
CREATE TABLE "ProjectBeforeAfterAsset" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "label" TEXT,
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectBeforeAfterAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectBeforeAfterAsset_projectId_idx" ON "ProjectBeforeAfterAsset"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectBeforeAfterAsset" ADD CONSTRAINT "ProjectBeforeAfterAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
