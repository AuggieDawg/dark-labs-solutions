export const APP_CONFIG = {
  repoName: "dark-lab-solutions",
  companyName: "Dark Labs",
  platformName: "Dark Labs Platform",
  ownerAppName: "Dark Labs Command Center",
  clientPortalName: "Dark Labs Client Portal",
  workspaceSlug: process.env.PRIMARY_WORKSPACE_SLUG ?? "dark-labs",
  publicNav: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
