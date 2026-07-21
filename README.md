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

| Variable                              | Required          | Purpose                                                                                                            |
| ------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                        | Yes               | PostgreSQL connection used by Prisma and NextAuth.                                                                 |
| `NEXTAUTH_URL`                        | Yes               | Canonical application URL. Use `http://localhost:3000` locally.                                                    |
| `NEXTAUTH_SECRET`                     | Yes               | Secret used to secure NextAuth tokens and cookies.                                                                 |
| `GOOGLE_CLIENT_ID`                    | Yes               | Google OAuth client ID.                                                                                            |
| `GOOGLE_CLIENT_SECRET`                | Yes               | Google OAuth client secret.                                                                                        |
| `OWNER_EMAILS`                        | Yes               | Comma-separated email allowlist for owner access.                                                                  |
| `PRIMARY_WORKSPACE_SLUG`              | Recommended       | Stable workspace slug; defaults to `dark-labs`.                                                                    |
| `PRIMARY_WORKSPACE_NAME`              | Recommended       | Workspace display name; defaults to `Dark Labs`.                                                                   |
| `BLOB_READ_WRITE_TOKEN`               | Local/legacy auth | Vercel Blob credential when OIDC is not available. Vercel may inject Blob credentials when the store is connected. |
| `NEXT_PUBLIC_DARK_LABS_CONTACT_EMAIL` | Recommended       | Public project-inquiry email address.                                                                              |
| `NEXT_PUBLIC_DARK_LABS_PHONE_DISPLAY` | Recommended       | Public phone label or number.                                                                                      |
| `NEXT_PUBLIC_DARK_LABS_PHONE_HREF`    | Recommended       | Public `tel:` link.                                                                                                |

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

The default `build` script (and the equivalent `vercel-build` script) runs:

```text
prisma generate → prisma migrate deploy → next build
```

This prevents a successful application build from deploying code that expects database columns that have not been created yet.

### Preview-database warning

A preview deployment should use a separate preview database. If Preview and Production share the same `DATABASE_URL`, preview builds can apply committed migrations to the production database. Configure environment-scoped Vercel variables before using previews for schema-changing branches.

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

- **Clients** — leads, active clients, contacts, and client metadata.
- **Projects** — delivery status, budgets, milestones, deliverables, updates, and proof assets.
- **Tasks** — execution queue and project/client-linked work.
- **Goals** — business and personal operating goals.
- **Notes** — workspace knowledge and project/client context.
- **Activity** — an audit-oriented stream of important workspace changes.

The dashboard exposes live operational counts and links directly into each module. Mobile navigation is included in the owner layout.

## Public proof and case-study publishing

The repository has two intentional public-proof surfaces:

### Services-page proof card

Project fields prefixed with `showcase` publish a compact proof card on `/services`. A project must have `showcaseEnabled` set to true.

### Full Work-page case study

Project fields prefixed with `work` publish the full narrative on `/work`. A project must have `workPageEnabled` set to true.

Only project updates with `showOnWorkPage` enabled are shown publicly. Only before/after assets with `publicEnabled` enabled are shown publicly. Internal notes, budgets, tasks, client-visible fields, and unapproved assets are never selected by public-page queries.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build:check
```

GitHub Actions runs linting, type-checking, and the non-migrating `build:check` validation on pull requests and pushes to `main`. Vercel supplies preview deployments and production deployment from the configured production branch.

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
- privacy, terms, analytics consent, and a CRM-backed lead form are added before paid traffic begins.
