import Link from "next/link";

import { APP_CONFIG } from "@/config/app";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-black px-6 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center">
        <Link href="/" className="mb-10 text-sm text-white/45 hover:text-white">
          Back to {APP_CONFIG.companyName}
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Secure Access
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
            Enter the Command Center.
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/50">
            Google authentication and owner email authorization will be wired in
            the next batch. This page is the visual shell.
          </p>

          <button
            type="button"
            disabled
            className="mt-8 h-12 w-full cursor-not-allowed rounded-full bg-white/25 px-6 text-sm font-semibold text-white/50"
          >
            Continue with Google soon
          </button>

          <Link
            href="/owner"
            className="mt-4 inline-flex text-sm font-semibold text-white/60 hover:text-white"
          >
            Preview owner shell
          </Link>
        </div>
      </div>
    </main>
  );
}
