# RBAC Model

## Roles

- OWNER: full control of the Dark Labs workspace
- ADMIN: future trusted operator
- MEMBER: future internal team member
- CLIENT: external client user

## Owner Access

Owner access is granted only to emails listed in OWNER_EMAILS.

The app must normalize emails to lowercase before comparison.

## Rules

- `/owner/*` requires OWNER role.
- `/portal/*` requires authenticated user with client/project access.
- `/api/owner/*` requires OWNER role.
- `/api/portal/*` requires scoped client/project access.
- Public site routes require no authentication.

## Non-Negotiable

No private data is protected only by hiding buttons.
Server-side authorization is mandatory.
