export const APP_CONFIG = {
  repoName: "dark-labs-solutions",
  companyName: "Dark Labs",
  platformName: "Dark Labs Platform",
  ownerAppName: "Dark Labs Command Center",
  clientPortalName: "Dark Labs Client Portal",

  contactEmail:
    process.env.NEXT_PUBLIC_DARK_LABS_CONTACT_EMAIL ??
    "agustin03036944@gmail.com",
  phoneDisplay:
    process.env.NEXT_PUBLIC_DARK_LABS_PHONE_DISPLAY ?? "385-233-7824",
  phoneHref: process.env.NEXT_PUBLIC_DARK_LABS_PHONE_HREF ?? "tel:+13852337824",
  facebookUrl:
    process.env.NEXT_PUBLIC_DARK_LABS_FACEBOOK_URL ??
    "https://www.facebook.com/agustin.rosas.448455",

  publicNav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
