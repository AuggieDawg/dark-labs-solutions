-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('WEBSITES', 'AUTOMATIONS', 'DASHBOARDS', 'PLATFORMS');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "showcaseEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showcaseProblem" TEXT,
ADD COLUMN     "showcaseResults" TEXT,
ADD COLUMN     "showcaseService" "ServiceCategory",
ADD COLUMN     "showcaseSolution" TEXT,
ADD COLUMN     "showcaseSortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showcaseSummary" TEXT,
ADD COLUMN     "showcaseTitle" TEXT;

-- AlterTable
ALTER TABLE "ProjectBeforeAfterAsset" ADD COLUMN     "publicEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Project_workspaceId_showcaseEnabled_idx" ON "Project"("workspaceId", "showcaseEnabled");

-- CreateIndex
CREATE INDEX "Project_workspaceId_showcaseService_idx" ON "Project"("workspaceId", "showcaseService");
