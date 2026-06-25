"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut({ callbackUrl: "/" });
      }}
      className="mt-4 text-left text-xs font-semibold text-white/60 transition hover:text-white disabled:cursor-wait disabled:text-white/30"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
