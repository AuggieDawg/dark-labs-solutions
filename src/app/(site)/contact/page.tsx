import { headers } from "next/headers";

import { ContactForm } from "@/components/site/contact/ContactForm";
import { APP_CONFIG } from "@/config/app";
import { ENGAGEMENTS } from "@/config/engagements";
import { createLeadFormToken } from "@/lib/leads/security";

export const metadata = {
  title: "Start a Project",
  description:
    "Request a fit conversation for a Dark Labs Acquisition Blueprint, Conversion Website, Client Acquisition System, or optimization engagement.",
};

type ContactSearchParams = {
  engagement?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

type ContactPageProps = {
  searchParams?: Promise<ContactSearchParams>;
};

function limited(value: string | null | undefined) {
  return value?.trim().slice(0, 500) ?? "";
}

function internalReferrerPath(referrer: string, host: string) {
  if (!referrer || !host) {
    return "";
  }

  try {
    const url = new URL(referrer);

    if (url.host !== host) {
      return "";
    }

    return limited(url.pathname);
  } catch {
    return "";
  }
}

function safeReferrerUrl(referrer: string | null) {
  try {
    const url = new URL(referrer ?? "");

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }

    return limited(`${url.origin}${url.pathname}`);
  } catch {
    return "";
  }
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestHeaders = await headers();
  const params = searchParams ? await searchParams : {};
  const selectedEngagement = ENGAGEMENTS.find(
    (engagement) => engagement.slug === params.engagement,
  );
  const formToken = createLeadFormToken();
  const rawReferrer = requestHeaders.get("referer");
  const referrerUrl = safeReferrerUrl(rawReferrer);
  const host = limited(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
  );
  const sourcePath =
    limited(params.source) || internalReferrerPath(rawReferrer ?? "", host);

  const campaignParams = new URLSearchParams();

  if (selectedEngagement) {
    campaignParams.set("engagement", selectedEngagement.slug);
  }

  for (const [key, value] of [
    ["utm_source", params.utm_source],
    ["utm_medium", params.utm_medium],
    ["utm_campaign", params.utm_campaign],
    ["utm_term", params.utm_term],
    ["utm_content", params.utm_content],
  ] as const) {
    const normalized = limited(value);

    if (normalized) {
      campaignParams.set(key, normalized);
    }
  }

  const landingPath = limited(
    `/contact${campaignParams.size ? `?${campaignParams.toString()}` : ""}`,
  );

  return (
    <main className="bg-black px-6 pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/60">
            Start a project
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Start with the business constraint—not a feature list.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            Share enough context for a useful first review. Dark Labs will look
            at the offer, customer path, current friction, and desired outcome
            before deciding whether a conversation is the right next step.
          </p>

          {selectedEngagement ? (
            <div className="mt-8 rounded-3xl border border-white/15 bg-white/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Selected engagement
              </p>
              <p className="mt-3 text-xl font-semibold">
                {selectedEngagement.name}
              </p>
              <p className="mt-2 text-sm text-white/65">
                {selectedEngagement.investment} · {selectedEngagement.timeline}
              </p>
            </div>
          ) : null}

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <h2 className="text-sm font-semibold text-white">
              Prefer to make direct contact?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              The structured form is the best way to preserve project context,
              but phone and email remain available when they are a better fit.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={APP_CONFIG.phoneHref}
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {APP_CONFIG.phoneDisplay}
              </a>
              <a
                href={`mailto:${APP_CONFIG.contactEmail}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Email Dark Labs
              </a>
            </div>
          </section>
        </div>

        <ContactForm
          formToken={formToken}
          selectedEngagementSlug={selectedEngagement?.slug ?? ""}
          attribution={{
            sourcePath,
            landingPath,
            referrerUrl,
            utmSource: limited(params.utm_source),
            utmMedium: limited(params.utm_medium),
            utmCampaign: limited(params.utm_campaign),
            utmTerm: limited(params.utm_term),
            utmContent: limited(params.utm_content),
          }}
        />
      </div>
    </main>
  );
}
