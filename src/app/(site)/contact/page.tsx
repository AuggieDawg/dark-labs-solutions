import { ENGAGEMENTS } from "@/config/engagements";
import { APP_CONFIG } from "@/config/app";

export const metadata = {
  title: "Start a Project",
  description:
    "Book a fit conversation for a Dark Labs Acquisition Blueprint, Conversion Website, Client Acquisition System, or optimization engagement.",
};

type ContactPageProps = {
  searchParams?: Promise<{
    engagement?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedEngagement = ENGAGEMENTS.find(
    (engagement) => engagement.name === params.engagement,
  );

  const subject = encodeURIComponent(
    selectedEngagement
      ? `Dark Labs Inquiry — ${selectedEngagement.name}`
      : "Dark Labs Project Inquiry",
  );
  const body = encodeURIComponent(
    [
      "Tell me about the customer-acquisition constraint you want to solve:",
      "",
      `Preferred engagement: ${selectedEngagement?.name ?? "Not sure yet"}`,
      "Business name:",
      "Current website:",
      "What you sell and to whom:",
      "How customers find you today:",
      "Where the current process loses clarity, leads, or follow-up:",
      "Primary result you want:",
      "Target timeline:",
      "Comfortable investment range:",
      "",
    ].join("\n"),
  );

  const emailHref = `mailto:${APP_CONFIG.contactEmail}?subject=${subject}&body=${body}`;

  return (
    <main className="bg-black px-6 py-32 text-white md:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Start a project
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Start with the business constraint—not a feature list.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            The first conversation is used to determine whether the problem is a
            fit, which engagement is appropriate, and whether there is enough
            operational clarity to begin. No pressure, no disguised discovery
            workshop, and no proposal before the core constraint is understood.
          </p>

          {selectedEngagement ? (
            <div className="mt-8 rounded-3xl border border-white/15 bg-white/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                Selected engagement
              </p>
              <p className="mt-3 text-xl font-semibold">
                {selectedEngagement.name}
              </p>
              <p className="mt-2 text-sm text-white/50">
                {selectedEngagement.investment} · {selectedEngagement.timeline}
              </p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_CONFIG.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {APP_CONFIG.phoneDisplay}
            </a>
            <a
              href={emailHref}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Email a Project Brief
            </a>
          </div>

          <p className="mt-5 max-w-xl text-xs leading-6 text-white/35">
            Dark Labs currently qualifies projects by direct conversation. A
            structured CRM-backed intake form should replace email before paid
            traffic is sent to this page.
          </p>
        </div>

        <div className="grid gap-5">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              What to include
            </p>

            <div className="mt-8 grid gap-4">
              {[
                "What the business sells, who the best customer is, and what makes the offer meaningfully different.",
                "How prospects find the business today and what they do before becoming a qualified sales conversation.",
                "Where the current website, funnel, handoff, or measurement process creates friction.",
                "The result, timeline, and investment range that would make the engagement commercially sensible.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-black/35 p-5"
                >
                  <p className="text-sm leading-6 text-white/62">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
              Engagement guide
            </p>
            <div className="mt-6 grid gap-3">
              {ENGAGEMENTS.map((engagement) => (
                <div
                  key={engagement.slug}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-black/35 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">{engagement.name}</p>
                    <p className="mt-1 text-xs text-white/35">
                      {engagement.timeline}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white/65">
                    {engagement.investment}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
