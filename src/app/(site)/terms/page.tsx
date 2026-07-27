import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export const metadata = {
  title: "Terms",
  description:
    "Terms for using the Dark Labs website and submitting a project inquiry.",
};

const sections = [
  {
    title: "Using this website",
    body: [
      "You may use this site to learn about Dark Labs, review published work, and submit a genuine business inquiry. Do not use it to break the law, interfere with the service, probe for vulnerabilities, submit harmful material, impersonate another person, or send spam or automated solicitations.",
      "Dark Labs may limit or block activity that appears abusive or threatens the site, its service providers, or other people.",
    ],
  },
  {
    title: "Project inquiries are not agreements",
    body: [
      "Submitting a form, sending an email, or joining an introductory conversation does not create a client relationship, reserve availability, or require either side to proceed. Dark Labs may accept or decline an inquiry and cannot promise a particular response time.",
      "Scope, deliverables, timing, fees, ownership, confidentiality, support, and other project terms are established only in a separate written agreement accepted by both sides. If that agreement conflicts with this page, the project agreement controls for that engagement.",
    ],
  },
  {
    title: "Published information",
    body: [
      "Service descriptions, timelines, investment ranges, availability, examples, and other website content are general information and may change. Published ranges are not automatic quotes, and past work does not guarantee a particular future result.",
      "Dark Labs aims to keep the site useful and accurate, but information may occasionally be incomplete, outdated, or unavailable. Confirm material project decisions in writing before relying on them.",
    ],
  },
  {
    title: "Content and permitted sharing",
    body: [
      "The Dark Labs name, site design, writing, graphics, software, and other original site materials are protected by applicable intellectual-property rules. You may view and share links to public pages for ordinary informational purposes. Do not copy, republish, sell, or present substantial site content as your own without permission.",
      "Client names, marks, and materials shown in published work remain subject to their respective owners' rights and any permissions governing the case study.",
    ],
  },
  {
    title: "External services and links",
    body: [
      "The site may depend on or link to third-party services. Dark Labs does not control every external service and is not responsible for its independent content, availability, security, or privacy practices. Review an external service's terms before using it.",
    ],
  },
  {
    title: "Service availability and responsibility",
    body: [
      "The public site is provided on an as-available basis. Dark Labs does not promise that every feature will always be uninterrupted or error-free. Nothing on the site is legal, financial, tax, or other regulated professional advice.",
      "To the extent allowed by applicable law, Dark Labs is not responsible for indirect or consequential loss caused solely by use of, or inability to use, the public site. This does not remove rights or responsibilities that cannot legally be limited.",
    ],
  },
  {
    title: "Changes",
    body: [
      "These terms may be updated when the website, services, or operating requirements change. The date on this page shows the latest published revision. Continued use after an update means the revised terms apply to later site use; separate signed project agreements are not changed by editing this page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-black px-6 pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/55">
          Terms
        </p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
          Clear expectations before a project begins.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
          These terms cover ordinary use of the Dark Labs public website and
          project inquiry process. A paid engagement uses its own written
          agreement.
        </p>
        <p className="mt-4 text-sm text-white/55">
          Last updated July 21, 2026.
        </p>

        <div className="mt-14 grid gap-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                {section.title}
              </h2>
              <div className="mt-5 grid gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-white/65 md:text-base md:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">
            Questions about these terms
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/65 md:text-base md:leading-8">
            Contact Dark Labs at{" "}
            <a
              href={`mailto:${APP_CONFIG.contactEmail}`}
              className="font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white"
            >
              {APP_CONFIG.contactEmail}
            </a>
            .
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start a Project Inquiry
          </Link>
        </section>
      </div>
    </main>
  );
}
