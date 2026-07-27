import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Inquiry Received",
  description: "Confirmation for a Dark Labs project inquiry.",
  robots: {
    index: false,
    follow: false,
  },
};

type ThankYouPageProps = {
  searchParams?: Promise<{
    reference?: string;
  }>;
};

function validReference(value: string | undefined) {
  const normalized = value?.trim().toUpperCase() ?? "";

  return /^DL-\d{4}-[A-F0-9]{10}$/.test(normalized) ? normalized : null;
}

export default async function ContactThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const params = searchParams ? await searchParams : {};
  const reference = validReference(params.reference);

  return (
    <main className="flex min-h-[85svh] items-center bg-black px-6 pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto w-full max-w-4xl rounded-[2.25rem] border border-white/12 bg-white/[0.045] p-7 shadow-2xl shadow-black/40 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
          Project inquiry
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
          Thank you for the context.
        </h1>

        {reference ? (
          <>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Your inquiry was accepted and stored for review. Dark Labs will
              use the contact details you provided if a conversation is the
              right next step.
            </p>
            <div className="mt-8 rounded-2xl border border-white/12 bg-black/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Confirmation reference
              </p>
              <p className="mt-3 font-mono text-lg font-semibold tracking-[0.08em] text-white">
                {reference}
              </p>
              <p className="mt-3 text-xs leading-5 text-white/55">
                Keep this reference if you need to identify the inquiry later.
              </p>
            </div>
          </>
        ) : (
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            The form has finished processing. If an inquiry was accepted, it is
            now available for review. No confirmation reference is available on
            this page.
          </p>
        )}

        <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60">
          This confirmation does not mean a project has been accepted, promise a
          response time, or reserve availability. Any engagement begins only
          after both sides accept a separate written agreement.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Return Home
          </Link>
          <Link
            href="/services"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Review Engagements
          </Link>
        </div>
      </div>
    </main>
  );
}
