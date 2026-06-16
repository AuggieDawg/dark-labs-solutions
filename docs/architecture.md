# Architecture

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth with Google OAuth
- Workspace-based RBAC
- React Three Fiber for premium visual systems

## Route Groups

- `(site)` — public website
- `(auth)` — sign-in and auth UX
- `(portal)` — authenticated client portal
- `(owner)` — owner-only command center

## Security Model

Frontend navigation is not security.

Every owner-only page, server action, and API route must enforce server-side authorization.

## Ownership Model

Users do not directly own the business data.

A Workspace owns business data.
Users gain access through WorkspaceMembership.
This allows multiple owner emails to access the same Dark Labs workspace.

## Data Isolation

Client-visible data and owner-only data must be explicitly separated with visibility and access rules.
