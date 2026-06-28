export const APP_CONFIG = {
  repoName: "dark-labs-solutions",
  companyName: "Dark Labs",
  platformName: "Dark Labs Platform",
  ownerAppName: "Dark Labs Command Center",
  clientPortalName: "Dark Labs Client Portal",

  // Replace these in .env for your real launch values.
  contactEmail:
    process.env.NEXT_PUBLIC_DARK_LABS_CONTACT_EMAIL ?? "contact@darklabs.dev",
  phoneDisplay:
    process.env.NEXT_PUBLIC_DARK_LABS_PHONE_DISPLAY ?? "Call Dark Labs",
  phoneHref: process.env.NEXT_PUBLIC_DARK_LABS_PHONE_HREF ?? "/contact",

  publicNav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
