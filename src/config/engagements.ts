export const ENGAGEMENTS = [
  {
    name: "Acquisition Blueprint",
    slug: "acquisition-blueprint",
    investment: "$1,500 fixed",
    timeline: "5 business days",
    summary:
      "A paid diagnostic that defines the offer, customer path, measurement plan, and correct build scope before production begins.",
    includes: [
      "Current website and funnel assessment",
      "Offer, audience, and conversion-path definition",
      "Technical and measurement recommendations",
      "Prioritized scope, timeline, and implementation plan",
    ],
    note: "Credited toward a larger build started within 30 days.",
  },
  {
    name: "Conversion Website",
    slug: "conversion-website",
    investment: "$7,500–$12,000",
    timeline: "Typical timeline: 4–6 weeks",
    summary:
      "A custom website for an established business that needs stronger positioning, trust, search foundations, and a clear path to inquiry.",
    includes: [
      "Strategy and conversion-focused content structure",
      "Custom responsive design and development",
      "Core service, proof, and contact paths",
      "Technical SEO, performance, and analytics foundation",
    ],
    note: "Best for businesses whose primary constraint is the quality and clarity of the website.",
  },
  {
    name: "Client Acquisition System",
    slug: "client-acquisition-system",
    investment: "$15,000–$30,000",
    timeline: "Typical timeline: 6–10 weeks",
    summary:
      "The flagship engagement: website, funnel, lead routing, integrations, attribution, and launch stabilization built as one system.",
    includes: [
      "Everything in the Conversion Website engagement",
      "Dedicated campaign or service funnels",
      "CRM, booking, inventory, email, or notification integrations",
      "Conversion events, attribution, reporting, and 60-day stabilization",
    ],
    note: "Best for businesses that already generate demand but lose visibility or momentum between click, inquiry, and follow-up.",
    featured: true,
  },
  {
    name: "Growth & Optimization",
    slug: "growth-optimization",
    investment: "From $2,000/month",
    timeline: "Initial term: 3 months",
    summary:
      "Ongoing improvement for a live acquisition system using measured behavior, operational feedback, and a prioritized experiment backlog.",
    includes: [
      "Monthly conversion and acquisition review",
      "Landing-page, funnel, and content improvements",
      "Technical maintenance and integration monitoring",
      "Prioritized experiments and implementation",
    ],
    note: "Available after a Dark Labs build or a paid technical onboarding of an existing system.",
  },
] as const;
