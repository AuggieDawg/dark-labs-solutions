-- Add goal hierarchy and persisted relationship-map positions.
ALTER TABLE "Goal"
ADD COLUMN "parentGoalId" TEXT,
ADD COLUMN "isMaster" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mapX" DOUBLE PRECISION NOT NULL DEFAULT 80,
ADD COLUMN "mapY" DOUBLE PRECISION NOT NULL DEFAULT 80;

CREATE INDEX "Goal_workspaceId_isMaster_idx" ON "Goal"("workspaceId", "isMaster");
CREATE INDEX "Goal_parentGoalId_idx" ON "Goal"("parentGoalId");

ALTER TABLE "Goal"
ADD CONSTRAINT "Goal_parentGoalId_fkey"
FOREIGN KEY ("parentGoalId") REFERENCES "Goal"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
