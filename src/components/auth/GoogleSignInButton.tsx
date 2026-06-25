"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type GoogleSignInButtonProps = {
  callbackUrl: string;
};

export function GoogleSignInButton({ callbackUrl }: GoogleSignInButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signIn("google", { callbackUrl });
      }}
      className="mt-8 h-12 w-full rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-wait disabled:bg-white/70"
    >
      {pending ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
