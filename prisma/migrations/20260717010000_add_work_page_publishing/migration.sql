-- Add an explicit public publishing layer for project case studies.
ALTER TABLE "Project"
ADD COLUMN "workPageEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "workTitle" TEXT,
ADD COLUMN "workClientLabel" TEXT,
ADD COLUMN "workSummary" TEXT,
ADD COLUMN "workDescription" TEXT,
ADD COLUMN "workChallenge" TEXT,
ADD COLUMN "workSolution" TEXT,
ADD COLUMN "workOutcome" TEXT,
ADD COLUMN "workWebsiteUrl" TEXT,
ADD COLUMN "workSortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "workPublishedAt" TIMESTAMP(3);

ALTER TABLE "ProjectUpdate"
ADD COLUMN "showOnWorkPage" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Project_workPageEnabled_workSortOrder_idx"
ON "Project"("workPageEnabled", "workSortOrder");

CREATE INDEX "ProjectUpdate_projectId_showOnWorkPage_idx"
ON "ProjectUpdate"("projectId", "showOnWorkPage");
