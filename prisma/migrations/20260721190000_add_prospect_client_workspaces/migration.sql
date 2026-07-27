-- Separate outbound prospecting from inbound website leads, and give each
-- client durable Website, SEO, and Web Analytics workstreams.
CREATE TYPE "ProspectStatus" AS ENUM (
    'TO_CONTACT',
    'CONTACTED',
    'ENGAGED',
    'QUALIFIED',
    'NOT_INTERESTED',
    'DO_NOT_CONTACT',
    'CONVERTED',
    'ARCHIVED'
);

CREATE TYPE "ProspectChannel" AS ENUM (
    'EMAIL',
    'PHONE',
    'LINKEDIN',
    'FACEBOOK',
    'IN_PERSON',
    'REFERRAL',
    'OTHER'
);

CREATE TYPE "ClientServiceType" AS ENUM (
    'WEBSITE',
    'SEO',
    'WEB_ANALYTICS'
);

CREATE TYPE "ClientServiceStatus" AS ENUM (
    'PLANNED',
    'ONBOARDING',
    'ACTIVE',
    'PAUSED',
    'COMPLETED'
);

CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT,
    "status" "ProspectStatus" NOT NULL DEFAULT 'TO_CONTACT',
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "emailNormalized" TEXT,
    "phone" TEXT,
    "websiteUrl" TEXT,
    "industry" TEXT,
    "location" TEXT,
    "source" TEXT,
    "valueHypothesis" TEXT,
    "lastContactChannel" "ProspectChannel",
    "firstContactedAt" TIMESTAMP(3),
    "lastContactedAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientService" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "ClientServiceType" NOT NULL,
    "status" "ClientServiceStatus" NOT NULL DEFAULT 'PLANNED',
    "summary" TEXT,
    "primaryUrl" TEXT,
    "internalNotes" TEXT,
    "startedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientService_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Project" ADD COLUMN "clientServiceId" TEXT;

-- Client rows now represent actual clients. Existing LEAD rows are preserved;
-- only the default for newly created client records changes.
ALTER TABLE "Client" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

CREATE INDEX "Prospect_workspaceId_status_updatedAt_idx" ON "Prospect"("workspaceId", "status", "updatedAt");
CREATE INDEX "Prospect_workspaceId_nextFollowUpAt_idx" ON "Prospect"("workspaceId", "nextFollowUpAt");
CREATE INDEX "Prospect_workspaceId_businessName_idx" ON "Prospect"("workspaceId", "businessName");
CREATE INDEX "Prospect_workspaceId_emailNormalized_idx" ON "Prospect"("workspaceId", "emailNormalized");
CREATE INDEX "Prospect_clientId_idx" ON "Prospect"("clientId");

CREATE UNIQUE INDEX "ClientService_workspaceId_clientId_type_key" ON "ClientService"("workspaceId", "clientId", "type");
CREATE INDEX "ClientService_workspaceId_status_idx" ON "ClientService"("workspaceId", "status");
CREATE INDEX "ClientService_workspaceId_type_idx" ON "ClientService"("workspaceId", "type");
CREATE INDEX "ClientService_clientId_idx" ON "ClientService"("clientId");

CREATE INDEX "Project_clientServiceId_idx" ON "Project"("clientServiceId");

ALTER TABLE "Prospect"
ADD CONSTRAINT "Prospect_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Prospect"
ADD CONSTRAINT "Prospect_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ClientService"
ADD CONSTRAINT "ClientService_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClientService"
ADD CONSTRAINT "ClientService_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Project"
ADD CONSTRAINT "Project_clientServiceId_fkey"
FOREIGN KEY ("clientServiceId") REFERENCES "ClientService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
