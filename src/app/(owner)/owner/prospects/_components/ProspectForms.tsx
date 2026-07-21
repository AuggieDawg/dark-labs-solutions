"use client";

import { useActionState, useId } from "react";

import { OwnerFormSubmitButton } from "@/components/owner/OwnerFormSubmitButton";
import type { ProspectActionState } from "@/lib/prospects/form-state";
import { INITIAL_PROSPECT_ACTION_STATE } from "@/lib/prospects/form-state";
import { formatEnumLabel } from "@/lib/utils/format";

type ProspectStateAction = (
  state: ProspectActionState,
  formData: FormData,
) => Promise<ProspectActionState>;

const PROSPECT_STATUSES = [
  "TO_CONTACT",
  "CONTACTED",
  "ENGAGED",
  "QUALIFIED",
  "NOT_INTERESTED",
  "DO_NOT_CONTACT",
  "ARCHIVED",
] as const;

const PROSPECT_CHANNELS = [
  "EMAIL",
  "PHONE",
  "LINKEDIN",
  "FACEBOOK",
  "IN_PERSON",
  "REFERRAL",
  "OTHER",
] as const;

type ProspectProfileValues = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  industry: string;
  location: string;
  source: string;
  valueHypothesis: string;
  status: string;
  nextFollowUpDate: string;
  internalNotes: string;
  updatedAt?: string;
};

function FormStatus({ state }: { state: ProspectActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
        state.status === "error"
          ? "border-red-300/20 bg-red-300/[0.08] text-red-100"
          : "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100"
      }`}
    >
      {state.message}
    </div>
  );
}

function FieldError({
  state,
  field,
  idPrefix,
}: {
  state: ProspectActionState;
  field: string;
  idPrefix: string;
}) {
  const errors = state.fieldErrors?.[field];

  if (!errors?.length) {
    return null;
  }

  return (
    <span
      id={`${idPrefix}-${field}-error`}
      className="text-xs leading-5 text-red-200"
    >
      {errors.join(" ")}
    </span>
  );
}

function fieldAccessibility(
  state: ProspectActionState,
  field: string,
  idPrefix: string,
) {
  const invalid = Boolean(state.fieldErrors?.[field]?.length);

  return {
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${idPrefix}-${field}-error` : undefined,
  };
}

type ProspectProfileFormProps = {
  action: ProspectStateAction;
  values: ProspectProfileValues;
  mode: "create" | "edit";
  statusLocked?: boolean;
};

export function ProspectProfileForm({
  action,
  values,
  mode,
  statusLocked = false,
}: ProspectProfileFormProps) {
  const errorIdPrefix = useId();
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROSPECT_ACTION_STATE,
  );
  const statusOptions = statusLocked
    ? ([values.status] as const)
    : mode === "create"
      ? (["TO_CONTACT"] as const)
      : PROSPECT_STATUSES;
  const inputClassName =
    "h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 aria-[invalid=true]:border-red-300/40";
  const textareaClassName =
    "rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25 aria-[invalid=true]:border-red-300/40";

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormStatus state={state} />

      {values.updatedAt ? (
        <input type="hidden" name="updatedAt" value={values.updatedAt} />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Business name
          </span>
          <input
            name="businessName"
            required
            maxLength={160}
            autoComplete="organization"
            defaultValue={values.businessName}
            placeholder="Basin Family Counseling LLC"
            className={inputClassName}
            {...fieldAccessibility(state, "businessName", errorIdPrefix)}
          />
          <FieldError
            state={state}
            field="businessName"
            idPrefix={errorIdPrefix}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Contact name
          </span>
          <input
            name="contactName"
            maxLength={120}
            autoComplete="name"
            defaultValue={values.contactName}
            placeholder="Owner or decision-maker"
            className={inputClassName}
            {...fieldAccessibility(state, "contactName", errorIdPrefix)}
          />
          <FieldError
            state={state}
            field="contactName"
            idPrefix={errorIdPrefix}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Email
          </span>
          <input
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            defaultValue={values.email}
            placeholder="owner@example.com"
            className={inputClassName}
            {...fieldAccessibility(state, "email", errorIdPrefix)}
          />
          <FieldError state={state} field="email" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            defaultValue={values.phone}
            placeholder="385-555-0100"
            className={inputClassName}
            {...fieldAccessibility(state, "phone", errorIdPrefix)}
          />
          <FieldError state={state} field="phone" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Website
          </span>
          <input
            name="websiteUrl"
            type="url"
            maxLength={2048}
            autoComplete="url"
            defaultValue={values.websiteUrl}
            placeholder="https://example.com"
            className={inputClassName}
            {...fieldAccessibility(state, "websiteUrl", errorIdPrefix)}
          />
          <FieldError
            state={state}
            field="websiteUrl"
            idPrefix={errorIdPrefix}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Industry
          </span>
          <input
            name="industry"
            maxLength={120}
            defaultValue={values.industry}
            placeholder="Counseling, dealership, trades..."
            className={inputClassName}
            {...fieldAccessibility(state, "industry", errorIdPrefix)}
          />
          <FieldError state={state} field="industry" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Location
          </span>
          <input
            name="location"
            maxLength={160}
            defaultValue={values.location}
            placeholder="Vernal, Utah"
            className={inputClassName}
            {...fieldAccessibility(state, "location", errorIdPrefix)}
          />
          <FieldError state={state} field="location" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Source
          </span>
          <input
            name="source"
            maxLength={160}
            defaultValue={values.source}
            placeholder="Referral, Facebook research, local outreach..."
            className={inputClassName}
            {...fieldAccessibility(state, "source", errorIdPrefix)}
          />
          <FieldError state={state} field="source" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Status
          </span>
          <select
            name="status"
            defaultValue={values.status}
            disabled={statusLocked}
            className={inputClassName}
            {...fieldAccessibility(state, "status", errorIdPrefix)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
          {statusLocked ? (
            <input type="hidden" name="status" value={values.status} />
          ) : null}
          <FieldError state={state} field="status" idPrefix={errorIdPrefix} />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Next follow-up
          </span>
          <input
            name="nextFollowUpDate"
            type="date"
            defaultValue={values.nextFollowUpDate}
            disabled={statusLocked}
            className={inputClassName}
            {...fieldAccessibility(state, "nextFollowUpDate", errorIdPrefix)}
          />
          <FieldError
            state={state}
            field="nextFollowUpDate"
            idPrefix={errorIdPrefix}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Why Dark Labs may be a fit
        </span>
        <textarea
          name="valueHypothesis"
          maxLength={4000}
          defaultValue={values.valueHypothesis}
          placeholder="What business problem or growth opportunity could Dark Labs help with?"
          className={`min-h-28 ${textareaClassName}`}
          {...fieldAccessibility(state, "valueHypothesis", errorIdPrefix)}
        />
        <FieldError
          state={state}
          field="valueHypothesis"
          idPrefix={errorIdPrefix}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Internal notes
        </span>
        <textarea
          name="internalNotes"
          maxLength={12000}
          defaultValue={values.internalNotes}
          placeholder="Private research, objections, decision context, and next steps..."
          className={`min-h-36 ${textareaClassName}`}
          {...fieldAccessibility(state, "internalNotes", errorIdPrefix)}
        />
        <FieldError
          state={state}
          field="internalNotes"
          idPrefix={errorIdPrefix}
        />
      </label>

      <div className="flex justify-end">
        <OwnerFormSubmitButton
          pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
          className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {mode === "create" ? "Create prospect" : "Save prospect"}
        </OwnerFormSubmitButton>
      </div>
    </form>
  );
}

type ProspectOutreachFormProps = {
  action: ProspectStateAction;
  updatedAt: string;
  nextFollowUpDate: string;
};

export function ProspectOutreachForm({
  action,
  updatedAt,
  nextFollowUpDate,
}: ProspectOutreachFormProps) {
  const errorIdPrefix = useId();
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROSPECT_ACTION_STATE,
  );

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <FormStatus state={state} />
      <input type="hidden" name="updatedAt" value={updatedAt} />

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Channel
        </span>
        <select
          name="channel"
          defaultValue="EMAIL"
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25 aria-[invalid=true]:border-red-300/40"
          {...fieldAccessibility(state, "channel", errorIdPrefix)}
        >
          {PROSPECT_CHANNELS.map((channel) => (
            <option key={channel} value={channel}>
              {formatEnumLabel(channel)}
            </option>
          ))}
        </select>
        <FieldError state={state} field="channel" idPrefix={errorIdPrefix} />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Outcome or next step
        </span>
        <textarea
          name="outcome"
          required
          maxLength={2000}
          placeholder="What happened, and what should happen next?"
          className="min-h-28 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/25 aria-[invalid=true]:border-red-300/40"
          {...fieldAccessibility(state, "outcome", errorIdPrefix)}
        />
        <FieldError state={state} field="outcome" idPrefix={errorIdPrefix} />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
          Next follow-up
        </span>
        <input
          name="nextFollowUpDate"
          type="date"
          defaultValue={nextFollowUpDate}
          className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-white/25 aria-[invalid=true]:border-red-300/40"
          {...fieldAccessibility(state, "nextFollowUpDate", errorIdPrefix)}
        />
        <FieldError
          state={state}
          field="nextFollowUpDate"
          idPrefix={errorIdPrefix}
        />
      </label>

      <OwnerFormSubmitButton
        pendingLabel="Recording..."
        className="h-11 w-full rounded-full border border-sky-200/20 bg-sky-200/10 px-5 text-sm font-semibold text-sky-100 transition hover:bg-sky-200/15"
      >
        Record outreach now
      </OwnerFormSubmitButton>
    </form>
  );
}

export function ProspectConversionForm({
  action,
}: {
  action: ProspectStateAction;
}) {
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROSPECT_ACTION_STATE,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <FormStatus state={state} />
      <OwnerFormSubmitButton
        pendingLabel="Converting..."
        className="h-11 w-full rounded-full border border-emerald-200/20 bg-emerald-200/10 px-5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-200/15"
      >
        Convert to client
      </OwnerFormSubmitButton>
    </form>
  );
}
