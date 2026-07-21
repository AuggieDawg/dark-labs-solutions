import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export const metadata = {
  title: "Privacy",
  description:
    "How Dark Labs handles information submitted through its website and project inquiry process.",
};

const sections = [
  {
    title: "Information you choose to provide",
    body: [
      "When you send a project inquiry, Dark Labs may collect the contact, business, and project information you enter, such as your name, email address, phone number, company, website, preferred engagement, timeline, investment range, and message.",
      "Please do not submit passwords, payment-card details, government identification numbers, health information, or other sensitive information through the project inquiry form.",
    ],
  },
  {
    title: "Information created when you use the site",
    body: [
      "The site and its hosting, security, and analytics services may process limited technical information, such as request times, referring pages, browser or device details, approximate location derived from network information, and abuse-prevention signals. Campaign parameters may also be recorded so Dark Labs can understand how an inquiry reached the site.",
      "Dark Labs does not place contact details or the contents of your project message into advertising analytics events.",
    ],
  },
  {
    title: "How information is used",
    body: [
      "Information is used to review and respond to inquiries, evaluate project fit, prepare requested proposals or conversations, operate the sales pipeline, protect the site from abuse, maintain business records, and understand whether the website is working as intended.",
      "Submitting a project inquiry does not by itself subscribe you to promotional email. If marketing communications are offered later, they should use a separate choice and include a way to opt out.",
    ],
  },
  {
    title: "Service providers and disclosure",
    body: [
      "Dark Labs may use service providers for website hosting, databases, email or notifications, analytics, security, and other infrastructure needed to operate the site and respond to inquiries. Those providers may process information on Dark Labs' behalf under their own service terms.",
      "Information may also be disclosed when reasonably necessary to comply with law, protect people or systems, investigate misuse, or complete a business transfer. Dark Labs does not treat project-inquiry information as a product for sale.",
    ],
  },
  {
    title: "Retention and security",
    body: [
      "Inquiry information is kept for as long as reasonably needed to respond, maintain business records, resolve disputes, protect the service, and meet applicable obligations. Spam and abuse records may follow a different retention period from legitimate business inquiries.",
      "Reasonable administrative and technical safeguards are used, but no internet service or storage system can promise absolute security. Email and other external services have their own security risks.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may ask Dark Labs to review, correct, or delete information connected to your inquiry. Whether a request can be completed may depend on applicable law and legitimate recordkeeping needs. You may also contact Dark Labs with a privacy question before submitting a form.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-black px-6 pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/55">
          Privacy
        </p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
          Your information should have a clear purpose.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
          This page explains, in practical terms, how Dark Labs handles
          information submitted through the website and project inquiry process.
          It may be updated as the site or its service providers change.
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
            Questions or requests
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/65 md:text-base md:leading-8">
            Contact Dark Labs at{" "}
            <a
              href={`mailto:${APP_CONFIG.contactEmail}`}
              className="font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white"
            >
              {APP_CONFIG.contactEmail}
            </a>
            . Include enough information to identify the inquiry without sending
            additional sensitive information.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Return to Contact
          </Link>
        </section>
      </div>
    </main>
  );
}
