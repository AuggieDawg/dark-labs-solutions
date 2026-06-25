import Link from "next/link";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { APP_CONFIG } from "@/config/app";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export const metadata = {
  title: "Sign In",
};

function getSafeCallbackUrl(callbackUrl: string | undefined) {
  if (!callbackUrl) {
    return "/owner";
  }

  if (!callbackUrl.startsWith("/")) {
    return "/owner";
  }

  if (callbackUrl.startsWith("//")) {
    return "/owner";
  }

  return callbackUrl;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : {};
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl);

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
            Owner-only access is granted through Google authentication and the
            approved Dark Labs owner email allowlist.
          </p>

          <GoogleSignInButton callbackUrl={callbackUrl} />

          <p className="mt-5 text-xs leading-5 text-white/35">
            If your email is not listed in OWNER_EMAILS, authentication can
            succeed but owner access will still be denied.
          </p>
        </div>
      </div>
    </main>
  );
}
