"use client";

import { useActionState, useId, useMemo } from "react";

import { OwnerFormSubmitButton } from "@/components/owner/OwnerFormSubmitButton";
import {
  type ClientServiceFormState,
  upsertClientServiceAction,
} from "@/server/actions/clients";

const serviceStatusOptions = [
  "PLANNED",
  "ONBOARDING",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
] as const;

const initialState: ClientServiceFormState = {
  status: "idle",
};

const inputClass =
  "h-11 rounded-2xl border border-white/15 bg-black/40 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus-visible:border-white/45 focus-visible:ring-2 focus-visible:ring-white/20";
const textareaClass =
  "rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/35 focus-visible:border-white/45 focus-visible:ring-2 focus-visible:ring-white/20";

type ClientServiceFormProps = {
  clientId: string;
  serviceType: string;
  service: {
    status: string;
    summary: string | null;
    primaryUrl: string | null;
    internalNotes: string | null;
    startedAt: string;
    nextReviewAt: string;
    endedAt: string;
    updatedAt: string;
  } | null;
};

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function FieldError({
  state,
  name,
  id,
}: {
  state: ClientServiceFormState;
  name: string;
  id: string;
}) {
  const errors = state.fieldErrors?.[name] ?? [];

  if (errors.length === 0) {
    return null;
  }

  return (
    <div id={id} className="grid gap-1 text-xs leading-5 text-red-200">
      {errors.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

export function ClientServiceForm({
  clientId,
  serviceType,
  service,
}: ClientServiceFormProps) {
  const id = useId();
  const action = useMemo(
    () => upsertClientServiceAction.bind(null, clientId, serviceType),
    [clientId, serviceType],
  );
  const [state, formAction] = useActionState<ClientServiceFormState, FormData>(
    action,
    initialState,
  );

  const errorId = (name: string) =>
    state.fieldErrors?.[name]?.length ? `${id}-${name}-error` : undefined;

  return (
    <form action={formAction} className="mt-5 grid gap-4">
      <input type="hidden" name="updatedAt" value={service?.updatedAt ?? ""} />

      {state.status !== "idle" ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.status === "error"
              ? "border-red-200/25 bg-red-200/[0.07] text-red-100"
              : "border-emerald-200/25 bg-emerald-200/[0.07] text-emerald-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <label className="grid gap-2" htmlFor={`${id}-status`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Status
        </span>
        <select
          id={`${id}-status`}
          name="status"
          defaultValue={service?.status ?? "PLANNED"}
          aria-describedby={errorId("status")}
          className={inputClass}
        >
          {serviceStatusOptions.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
        <FieldError state={state} name="status" id={`${id}-status-error`} />
      </label>

      <label className="grid gap-2" htmlFor={`${id}-primary-url`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Primary URL
        </span>
        <input
          id={`${id}-primary-url`}
          name="primaryUrl"
          type="url"
          defaultValue={service?.primaryUrl ?? ""}
          placeholder="https://example.com"
          aria-describedby={errorId("primaryUrl")}
          className={inputClass}
        />
        <FieldError
          state={state}
          name="primaryUrl"
          id={`${id}-primaryUrl-error`}
        />
      </label>

      <label className="grid gap-2" htmlFor={`${id}-summary`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Workstream summary
        </span>
        <textarea
          id={`${id}-summary`}
          name="summary"
          defaultValue={service?.summary ?? ""}
          placeholder="Scope, current state, and intended outcome."
          aria-describedby={errorId("summary")}
          className={`min-h-24 ${textareaClass}`}
        />
        <FieldError state={state} name="summary" id={`${id}-summary-error`} />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            name: "startedAt",
            label: "Started",
            value: service?.startedAt ?? "",
          },
          {
            name: "nextReviewAt",
            label: "Next review",
            value: service?.nextReviewAt ?? "",
          },
          {
            name: "endedAt",
            label: "Ended",
            value: service?.endedAt ?? "",
          },
        ].map((field) => (
          <label
            key={field.name}
            className="grid gap-2"
            htmlFor={`${id}-${field.name}`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
              {field.label}
            </span>
            <input
              id={`${id}-${field.name}`}
              name={field.name}
              type="date"
              defaultValue={field.value}
              aria-describedby={errorId(field.name)}
              className={inputClass}
            />
            <FieldError
              state={state}
              name={field.name}
              id={`${id}-${field.name}-error`}
            />
          </label>
        ))}
      </div>

      <label className="grid gap-2" htmlFor={`${id}-internal-notes`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Internal notes
        </span>
        <textarea
          id={`${id}-internal-notes`}
          name="internalNotes"
          defaultValue={service?.internalNotes ?? ""}
          placeholder="Private operational notes; never shown publicly."
          aria-describedby={errorId("internalNotes")}
          className={`min-h-28 ${textareaClass}`}
        />
        <FieldError
          state={state}
          name="internalNotes"
          id={`${id}-internalNotes-error`}
        />
      </label>

      <OwnerFormSubmitButton
        pendingLabel="Saving workstream..."
        className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {service ? "Save workstream" : "Configure workstream"}
      </OwnerFormSubmitButton>
    </form>
  );
}
