-- Add a durable, workspace-scoped lead intake pipeline. Email delivery is
-- intentionally modeled as an outbox so a provider failure cannot lose a lead.
CREATE TYPE "LeadStatus" AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'DISQUALIFIED',
    'CONVERTED',
    'SPAM',
    'ARCHIVED'
);

CREATE TYPE "LeadTimeline" AS ENUM (
    'IMMEDIATELY',
    'ONE_TO_THREE_MONTHS',
    'THREE_TO_SIX_MONTHS',
    'EXPLORING'
);

CREATE TYPE "LeadBudgetRange" AS ENUM (
    'UNDER_5000',
    'FROM_5000_TO_10000',
    'FROM_10000_TO_20000',
    'FROM_20000_TO_30000',
    'ABOVE_30000',
    'NOT_SURE'
);

CREATE TYPE "LeadNotificationKind" AS ENUM ('OWNER_NEW_LEAD');

CREATE TYPE "LeadNotificationStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SENT',
    'FAILED'
);

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "clientId" TEXT,
    "reference" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "phone" TEXT,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "engagementSlug" TEXT,
    "businessConstraint" TEXT NOT NULL,
    "desiredOutcome" TEXT,
    "timeline" "LeadTimeline",
    "budgetRange" "LeadBudgetRange",
    "referralSource" TEXT,
    "sourcePath" TEXT,
    "landingPath" TEXT,
    "referrerUrl" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "privacyAcknowledgedAt" TIMESTAMP(3) NOT NULL,
    "privacyNoticeVersion" TEXT NOT NULL,
    "firstContactedAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadNotification" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" "LeadNotificationKind" NOT NULL DEFAULT 'OWNER_NEW_LEAD',
    "status" "LeadNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "recipient" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "nextAttemptAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNotification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadRateLimit" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadRateLimit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Lead_reference_key" ON "Lead"("reference");
CREATE UNIQUE INDEX "Lead_workspaceId_idempotencyKey_key" ON "Lead"("workspaceId", "idempotencyKey");
CREATE INDEX "Lead_workspaceId_status_createdAt_idx" ON "Lead"("workspaceId", "status", "createdAt");
CREATE INDEX "Lead_workspaceId_nextFollowUpAt_idx" ON "Lead"("workspaceId", "nextFollowUpAt");
CREATE INDEX "Lead_workspaceId_emailNormalized_idx" ON "Lead"("workspaceId", "emailNormalized");
CREATE INDEX "Lead_clientId_idx" ON "Lead"("clientId");

CREATE UNIQUE INDEX "LeadNotification_leadId_kind_key" ON "LeadNotification"("leadId", "kind");
CREATE INDEX "LeadNotification_workspaceId_status_nextAttemptAt_idx" ON "LeadNotification"("workspaceId", "status", "nextAttemptAt");
CREATE INDEX "LeadNotification_leadId_idx" ON "LeadNotification"("leadId");

CREATE UNIQUE INDEX "LeadRateLimit_workspaceId_keyHash_windowStartedAt_key" ON "LeadRateLimit"("workspaceId", "keyHash", "windowStartedAt");
CREATE INDEX "LeadRateLimit_expiresAt_idx" ON "LeadRateLimit"("expiresAt");

ALTER TABLE "Lead"
ADD CONSTRAINT "Lead_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Lead"
ADD CONSTRAINT "Lead_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LeadNotification"
ADD CONSTRAINT "LeadNotification_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadNotification"
ADD CONSTRAINT "LeadNotification_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadRateLimit"
ADD CONSTRAINT "LeadRateLimit_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
