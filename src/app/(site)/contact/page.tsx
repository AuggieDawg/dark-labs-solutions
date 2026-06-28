import { APP_CONFIG } from "@/config/app";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const subject = encodeURIComponent("Dark Labs Project Inquiry");
  const body = encodeURIComponent(
    "Tell me about the system you want to build:\n\nBusiness name:\nWebsite:\nWhat you need:\nTimeline:\nBudget range:\n",
  );

  const emailHref = `mailto:${APP_CONFIG.contactEmail}?subject=${subject}&body=${body}`;

  return (
    <main className="bg-black px-6 py-32 text-white md:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-white/35">
            Contact
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
            Start with the system you actually need.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Call directly or send a project inquiry. The goal is to understand
            the business, the current bottleneck, and what kind of system would
            create the most leverage.
          </p>

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
              Email Project Inquiry
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
            Best-fit projects
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "You need a better website that creates trust and drives calls.",
              "You need forms, automations, or dashboards to reduce admin chaos.",
              "You need a client portal or private operating platform.",
              "You want a long-term technical partner to build systems around the business.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/35 p-5"
              >
                <p className="text-sm leading-6 text-white/62">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-5">
            <p className="text-sm font-semibold text-white">What to include</p>
            <p className="mt-3 text-sm leading-6 text-white/48">
              Business name, current website, what is not working, what you want
              the system to do, timeline, and budget range. Better context means
              a better first conversation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
