export function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function getOwnerEmails() {
  return (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

export function getPrimaryWorkspaceSlug() {
  return process.env.PRIMARY_WORKSPACE_SLUG?.trim() || "dark-labs";
}

export function getPrimaryWorkspaceName() {
  return process.env.PRIMARY_WORKSPACE_NAME?.trim() || "Dark Labs";
}
