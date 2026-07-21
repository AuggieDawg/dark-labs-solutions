# Dark Labs Solutions

Dark Labs Solutions is a Next.js application with two connected surfaces:

- a public marketing site for Dark Labs services, packages, and client-approved work;
- a private, owner-only Command Center for clients, projects, tasks, goals, notes, delivery records, and public case-study publishing.

The application uses Next.js, React, Prisma, PostgreSQL, NextAuth with Google OAuth, Vercel, and Vercel Blob.

## Business offer

The public site is organized around four defined engagements:

1. **Acquisition Blueprint** — $1,500 fixed, five business days.
2. **Conversion Website** — typical investment of $7,500–$12,000.
3. **Client Acquisition System** — typical investment of $15,000–$30,000.
4. **Growth & Optimization** — from $2,000 per month with an initial three-month term.

The ranges are qualification ranges, not automatic quotes. Final scope depends on content volume, integrations, data migration, and custom application requirements.

## Requirements

- Node.js 24
- npm
- PostgreSQL
- a Google Cloud OAuth application
- a Vercel project
- a public Vercel Blob store for persistent image uploads

## Local setup

```bash
npm install
cp .env.example .env.local
npm run db:deploy
npm run dev
```

Open `http://localhost:3000`.

The Command Center is available at `http://localhost:3000/owner` after Google authentication and owner-email authorization are configured.

## Environment variables

| Variable                              | Required          | Purpose                                                                                                             |
| ------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                        | Yes               | PostgreSQL connection used by Prisma and NextAuth.                                                                  |
| `NEXTAUTH_URL`                        | Yes               | Canonical application URL. Use `http://localhost:3000` locally.                                                     |
| `NEXTAUTH_SECRET`                     | Yes               | Secret used to secure NextAuth tokens and cookies.                                                                  |
| `GOOGLE_CLIENT_ID`                    | Yes               | Google OAuth client ID.                                                                                             |
| `GOOGLE_CLIENT_SECRET`                | Yes               | Google OAuth client secret.                                                                                         |
| `OWNER_EMAILS`                        | Yes               | Comma-separated email allowlist for owner access.                                                                   |
| `PRIMARY_WORKSPACE_SLUG`              | Recommended       | Stable workspace slug; defaults to `dark-labs`.                                                                     |
| `PRIMARY_WORKSPACE_NAME`              | Recommended       | Workspace display name; defaults to `Dark Labs`.                                                                    |
| `ALLOW_PREVIEW_MIGRATIONS`            | Preview only      | Defaults to `false`. Enable only after Preview has a database isolated from Production.                             |
| `CONTACT_FORM_ENABLED`                | Recommended       | Emergency public-intake switch. Set to `false` to stop new form submissions without removing the contact page.      |
| `LEAD_ABUSE_HASH_SECRET`              | Yes               | Private, independent secret used to sign form tokens and hash abuse identifiers. Use at least 32 random characters. |
| `LEAD_NOTIFICATION_EMAIL`             | Yes               | Private inbox that receives new-lead notifications.                                                                 |
| `LEAD_FROM_EMAIL`                     | Yes               | Sender address on a domain verified by the configured Resend account.                                               |
| `RESEND_API_KEY`                      | Yes               | Private Resend API key used only by server-side notification delivery.                                              |
| `CRON_SECRET`                         | Yes               | Private bearer secret used to authorize notification retry processing. Use at least 32 random characters.           |
| `BLOB_READ_WRITE_TOKEN`               | Local/legacy auth | Vercel Blob credential when OIDC is not available. Vercel may inject Blob credentials when the store is connected.  |
| `NEXT_PUBLIC_DARK_LABS_CONTACT_EMAIL` | Recommended       | Public project-inquiry email address.                                                                               |
| `NEXT_PUBLIC_DARK_LABS_PHONE_DISPLAY` | Recommended       | Public phone label or number.                                                                                       |
| `NEXT_PUBLIC_DARK_LABS_PHONE_HREF`    | Recommended       | Public `tel:` link.                                                                                                 |

Never commit production credentials. `.env.example` contains names and placeholders only.

## Google OAuth configuration

Create a Google OAuth web application and add these authorized redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
https://YOUR-PRODUCTION-DOMAIN/api/auth/callback/google
```

For Vercel preview deployments, either add the required preview callback URLs or test owner authentication through the production domain. The signed-in Google email must also appear in `OWNER_EMAILS`.

## Database and migrations

Development migration workflow:

```bash
npm run db:migrate
```

Apply committed migrations without creating new migration files:

```bash
npm run db:deploy
```

The default `build` script runs:

```text
prisma generate → prisma migrate deploy → next build
```

The Vercel build uses a stricter environment policy:

```text
prisma generate → conditional migration deploy → next build
```

Production always applies committed migrations before building. Preview skips
migrations by default; it applies them only when `ALLOW_PREVIEW_MIGRATIONS=true`.
This prevents a schema-changing preview from writing to a shared production
database by accident.

### Preview-database warning

A preview deployment must use a separate preview database before migrations are
enabled. Configure the Preview-scoped `DATABASE_URL`, verify that it does not
match Production, and only then set Preview-scoped
`ALLOW_PREVIEW_MIGRATIONS=true`. Leave the flag false if Preview is not intended
to exercise database-backed features.

The lead pipeline adds database-backed intake, rate limiting, notification state,
and activity records, so this separation is a release requirement rather than an
optional optimization. Configure Preview with its own `DATABASE_URL`, test
notification recipient, and Resend credentials. Production must have separate
values scoped only to the Production environment. Never point a branch-specific
Preview variable at the production database.

The notification retry route is scheduled every five minutes in `vercel.json`.
That schedule requires a Vercel plan that permits sub-daily cron execution. If
the project uses Vercel Hobby, change the schedule to a supported daily interval
or upgrade before deployment; Hobby rejects more-frequent cron schedules.

## Persistent uploads

Client logos and project before/after images are stored in Vercel Blob. Runtime writes to `public/uploads` are not used in production because a serverless filesystem is not durable between invocations.

In Vercel:

1. Open the project.
2. Create or connect a **public Blob store**.
3. Confirm the Blob credentials are available to Production and Preview as intended.
4. Redeploy the application.

The server-side upload path accepts JPG, PNG, and WebP images with up to 3 MB of image data per form submission. Public URLs are stored in PostgreSQL, and `next/image` is configured for Vercel Blob hosts.

## Command Center

The Command Center is owner-only and workspace-scoped. Its primary modules are:

- **Leads** — persisted website inquiries, qualification, follow-up, conversion, and notification health.
- **Clients** — qualified prospect and active client accounts, contacts, and client metadata.
- **Projects** — delivery status, budgets, milestones, deliverables, updates, and proof assets.
- **Tasks** — execution queue and project/client-linked work.
- **Goals** — business and personal operating goals.
- **Notes** — workspace knowledge and project/client context.
- **Activity** — an audit-oriented stream of important workspace changes.

The dashboard exposes live operational counts and links directly into each module. Mobile navigation is included in the owner layout.

## Lead intake and notification delivery

The public contact form is the first stage of the Dark Labs sales funnel. A
successful confirmation means the inquiry was committed to PostgreSQL. Email is
an operational notification channel, not the source of truth.

Submission processing follows this order:

1. Validate and normalize the allowlisted form fields.
2. Verify the signed form token, honeypot, and database-backed rate limits.
3. Store the lead, activity entry, and notification record in one transaction.
4. Show a confirmation containing the public lead reference.
5. Send the owner notification with an idempotency key and record the provider
   message ID or a retryable failure.

If Resend is unavailable or misconfigured, the stored lead remains available in
the Command Center and the notification is visibly marked failed. The retry
route processes pending and retryable notifications without creating a second
lead or duplicate provider request.

## Public proof and case-study publishing

The repository has two intentional public-proof surfaces:

### Services-page proof card

Project fields prefixed with `showcase` publish a compact proof card on `/services`. A project must have `showcaseEnabled` set to true.

### Full Work-page case study

Project fields prefixed with `work` publish the full narrative on `/work`. A project must have `workPageEnabled` set to true.

Only project updates with `showOnWorkPage` enabled are shown publicly. Only before/after assets with `publicEnabled` enabled are shown publicly. Internal notes, budgets, tasks, client-visible fields, and unapproved assets are never selected by public-page queries.

## Quality checks

```bash
npm run db:deploy
npm test
npm run test:integration
npm run lint
npm run typecheck
npm run build:check
```

GitHub Actions starts an ephemeral PostgreSQL 16 service, applies every committed
migration, and then runs unit tests, database invariant/isolation tests, linting,
type-checking, and the non-migrating `build:check` validation on pull requests
and pushes to `main`. Vercel supplies preview deployments and the production
deployment from the configured production branch.

## Controlled lead-submission runbook

Run this procedure first against Preview and again once against Production after
deployment. Do not use a real prospect's information for a test.

1. Confirm the deployment uses the intended environment-scoped `DATABASE_URL`,
   `LEAD_NOTIFICATION_EMAIL`, `LEAD_FROM_EMAIL`, and `RESEND_API_KEY`. Confirm
   `CONTACT_FORM_ENABLED` is not `false`.
2. Submit `/contact` with a recognizable non-sensitive marker in the business
   constraint, such as `CONTROLLED-TEST-YYYYMMDD-HHMM`.
3. Record the confirmation reference. Do not treat inbox arrival alone as proof
   that the form was accepted.
4. In `/owner/leads`, confirm exactly one lead exists with that reference and
   that the submitted values and attribution are correct.
5. Confirm the associated notification reaches `SENT` and has a provider message
   ID. Confirm the configured inbox receives the message and that Reply-To points
   to the submitted test address.
6. Submit the same browser form twice and verify its signed idempotency identity
   resolves to one lead rather than duplicates.
7. Exercise the failure path in Preview by using a deliberately invalid test API
   key or sender, then restore the configuration. Verify the lead remains stored,
   the notification shows the sanitized failure, and a retry succeeds.
8. If a pending or failed notification is due, invoke the protected retry route
   from a secure shell without printing the secret:

   ```bash
   curl --fail-with-body \
     --header "Authorization: Bearer ${CRON_SECRET}" \
     "${SITE_URL}/api/cron/lead-notifications"
   ```

9. Review Vercel runtime logs by confirmation reference and request time. Never
   log the form body, API keys, raw IP addresses, or full provider responses.
10. After the production smoke test passes, remove the test lead or mark it as
    test/spam according to the operating policy, and record the result in the
    release notes.

If acceptance fails, stop the release. If persistence succeeds but notification
delivery fails, keep the lead in the Command Center, correct the delivery
configuration, and retry the notification; do not resubmit the customer inquiry.

## Deployment checklist

Before production launch, verify:

- all required environment variables are configured by environment;
- `npm run db:deploy` succeeds against the intended database;
- Google OAuth redirects match the final domain;
- the owner email is listed in `OWNER_EMAILS`;
- the public Blob store is connected;
- client logos and proof images survive a fresh deployment;
- `/owner`, `/owner/projects`, `/services`, and `/work` load without runtime errors;
- an unpublished project remains absent from public pages;
- a published project exposes only approved copy, updates, and media;
- public contact email and phone values are no longer using defaults;
- the privacy and terms pages match the deployed intake behavior;
- a controlled lead submission is stored once, appears in `/owner/leads`, and
  produces a traceable notification provider result;
- analytics consent and conversion measurement are configured before paid
  traffic begins.
