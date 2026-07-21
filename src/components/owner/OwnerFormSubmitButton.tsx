"use client";

import { useFormStatus } from "react-dom";

type OwnerFormSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
};

export function OwnerFormSubmitButton({
  children,
  pendingLabel,
  className,
}: OwnerFormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`${className} disabled:cursor-wait disabled:opacity-55`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
