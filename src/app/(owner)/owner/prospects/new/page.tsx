import Link from "next/link";

import { ProspectProfileForm } from "@/app/(owner)/owner/prospects/_components/ProspectForms";
import { requireOwner } from "@/lib/auth/require";
import { createProspectAction } from "@/server/actions/prospects";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Prospect",
};

export default async function NewProspectPage() {
  await requireOwner();

  return (
    <section className="px-5 py-8 lg:px-10">
      <Link
        href="/owner/prospects"
        className="text-sm text-white/45 transition hover:text-white"
      >
        ← Back to prospects
      </Link>

      <div className="mt-8 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Outbound pipeline
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
          Add a prospect
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
          Capture a business you intend to contact or have already approached.
          Website inquiries remain in Leads so inbound and outbound work never
          become confused.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <ProspectProfileForm
            action={createProspectAction}
            mode="create"
            values={{
              businessName: "",
              contactName: "",
              email: "",
              phone: "",
              websiteUrl: "",
              industry: "",
              location: "",
              source: "",
              valueHypothesis: "",
              status: "TO_CONTACT",
              nextFollowUpDate: "",
              internalNotes: "",
            }}
          />
        </div>
      </div>
    </section>
  );
}
