"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { ATTRIBUTION_STORAGE_KEY } from "@/components/site/AttributionCapture";
import { ENGAGEMENTS } from "@/config/engagements";
import {
  LEAD_BUDGET_OPTIONS,
  LEAD_TIMELINE_OPTIONS,
} from "@/lib/leads/validation";
import {
  INITIAL_LEAD_FORM_STATE,
  type LeadFormState,
} from "@/lib/leads/form-state";
import { submitLeadAction } from "@/server/actions/leads-public";

type ContactAttribution = {
  sourcePath: string;
  landingPath: string;
  referrerUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

type ContactFormProps = {
  formToken: string;
  selectedEngagementSlug: string;
  attribution: ContactAttribution;
};

const attributionFieldNames: (keyof ContactAttribution)[] = [
  "landingPath",
  "referrerUrl",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
];

const fieldLabels: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Work email",
  phone: "Phone",
  businessName: "Business name",
  websiteUrl: "Current website",
  engagementSlug: "Preferred engagement",
  businessConstraint: "Business constraint",
  desiredOutcome: "Desired outcome",
  timeline: "Target timeline",
  budgetRange: "Comfortable investment range",
  referralSource: "How you heard about Dark Labs",
  privacyAcknowledged: "Privacy acknowledgement",
  formToken: "Form session",
};

const controlClass =
  "mt-2 w-full rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/35 focus-visible:border-white/50 focus-visible:ring-2 focus-visible:ring-white/25";
const labelClass = "text-sm font-semibold text-white/85";
const helpClass = "mt-2 text-xs leading-5 text-white/55";

function fieldErrors(state: LeadFormState, name: string) {
  return state.fieldErrors?.[name] ?? [];
}

function FieldError({ state, name }: { state: LeadFormState; name: string }) {
  const messages = fieldErrors(state, name);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div id={`${name}-error`} className="mt-2 grid gap-1 text-sm text-red-200">
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

function describedBy(state: LeadFormState, name: string, helpId?: string) {
  return (
    [helpId, fieldErrors(state, name).length ? `${name}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? "Sending project inquiry…" : "Send Project Inquiry"}
    </button>
  );
}

export function ContactForm({
  formToken,
  selectedEngagementSlug,
  attribution,
}: ContactFormProps) {
  const [state, formAction] = useActionState<LeadFormState, FormData>(
    submitLeadAction,
    INITIAL_LEAD_FORM_STATE,
  );
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "null",
        ) as Partial<ContactAttribution> | null;

        if (!stored) {
          return;
        }

        for (const name of attributionFieldNames) {
          const value = stored[name];
          const control = formRef.current?.elements.namedItem(name);

          if (
            control instanceof HTMLInputElement &&
            typeof value === "string"
          ) {
            control.value = value;
          }
        }
      } catch {
        // Keep the server-captured values when session storage is unavailable or
        // contains an invalid value.
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (state.status === "error") {
      errorSummaryRef.current?.focus();
    }
  }, [state]);

  const summaryErrors = Object.entries(state.fieldErrors ?? {}).flatMap(
    ([name, messages]) =>
      messages.map((message) => ({
        name,
        label: fieldLabels[name] ?? "Form field",
        message,
      })),
  );

  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
        Project inquiry
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
        Give the first conversation a useful starting point.
      </h2>
      <p
        id="contact-form-description"
        className="mt-4 text-sm leading-7 text-white/65"
      >
        Required fields are marked with an asterisk. Qualification details are
        optional; share only what you know today.
      </p>

      {state.status === "error" ? (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          tabIndex={-1}
          className="mt-6 rounded-2xl border border-red-200/25 bg-red-200/[0.07] p-4 outline-none focus-visible:ring-2 focus-visible:ring-red-100/60"
        >
          <p className="font-semibold text-red-100">
            {state.message ?? "Review the form and try again."}
          </p>
          {summaryErrors.length > 0 ? (
            <ul className="mt-3 grid gap-2 text-sm text-red-100/85">
              {summaryErrors.map((error, index) => (
                <li key={`${error.name}-${error.message}-${index}`}>
                  <a
                    href={`#${error.name}`}
                    className="underline decoration-red-100/45 underline-offset-4 hover:decoration-red-100"
                  >
                    {error.label}: {error.message}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <form
        ref={formRef}
        action={formAction}
        aria-describedby="contact-form-description"
        className="mt-8 grid gap-6"
      >
        <input type="hidden" name="formToken" value={formToken} />
        <input
          type="hidden"
          name="sourcePath"
          defaultValue={attribution.sourcePath}
        />
        <input
          type="hidden"
          name="landingPath"
          defaultValue={attribution.landingPath}
        />
        <input
          type="hidden"
          name="referrerUrl"
          defaultValue={attribution.referrerUrl}
        />
        <input
          type="hidden"
          name="utmSource"
          defaultValue={attribution.utmSource}
        />
        <input
          type="hidden"
          name="utmMedium"
          defaultValue={attribution.utmMedium}
        />
        <input
          type="hidden"
          name="utmCampaign"
          defaultValue={attribution.utmCampaign}
        />
        <input
          type="hidden"
          name="utmTerm"
          defaultValue={attribution.utmTerm}
        />
        <input
          type="hidden"
          name="utmContent"
          defaultValue={attribution.utmContent}
        />

        <div
          aria-hidden="true"
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="companyWebsite">Leave this field empty</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First name <span aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              maxLength={80}
              autoComplete="given-name"
              aria-invalid={fieldErrors(state, "firstName").length > 0}
              aria-describedby={describedBy(state, "firstName")}
              className={controlClass}
            />
            <FieldError state={state} name="firstName" />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last name <span aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              maxLength={80}
              autoComplete="family-name"
              aria-invalid={fieldErrors(state, "lastName").length > 0}
              aria-describedby={describedBy(state, "lastName")}
              className={controlClass}
            />
            <FieldError state={state} name="lastName" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>
              Work email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              inputMode="email"
              aria-invalid={fieldErrors(state, "email").length > 0}
              aria-describedby={describedBy(state, "email")}
              className={controlClass}
            />
            <FieldError state={state} name="email" />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone{" "}
              <span className="font-normal text-white/55">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={40}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={fieldErrors(state, "phone").length > 0}
              aria-describedby={describedBy(state, "phone")}
              className={controlClass}
            />
            <FieldError state={state} name="phone" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="businessName" className={labelClass}>
              Business name <span aria-hidden="true">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              minLength={2}
              maxLength={120}
              autoComplete="organization"
              aria-invalid={fieldErrors(state, "businessName").length > 0}
              aria-describedby={describedBy(state, "businessName")}
              className={controlClass}
            />
            <FieldError state={state} name="businessName" />
          </div>

          <div>
            <label htmlFor="websiteUrl" className={labelClass}>
              Current website{" "}
              <span className="font-normal text-white/55">(optional)</span>
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="text"
              maxLength={500}
              autoComplete="url"
              inputMode="url"
              placeholder="example.com"
              aria-invalid={fieldErrors(state, "websiteUrl").length > 0}
              aria-describedby={describedBy(state, "websiteUrl")}
              className={controlClass}
            />
            <FieldError state={state} name="websiteUrl" />
          </div>
        </div>

        <div>
          <label htmlFor="engagementSlug" className={labelClass}>
            Preferred engagement{" "}
            <span className="font-normal text-white/55">(optional)</span>
          </label>
          <select
            id="engagementSlug"
            name="engagementSlug"
            defaultValue={selectedEngagementSlug}
            aria-invalid={fieldErrors(state, "engagementSlug").length > 0}
            aria-describedby={describedBy(state, "engagementSlug")}
            className={controlClass}
          >
            <option value="">Not sure yet</option>
            {ENGAGEMENTS.map((engagement) => (
              <option key={engagement.slug} value={engagement.slug}>
                {engagement.name}
              </option>
            ))}
          </select>
          <FieldError state={state} name="engagementSlug" />
        </div>

        <div>
          <label htmlFor="businessConstraint" className={labelClass}>
            What business constraint are you trying to solve?{" "}
            <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="businessConstraint"
            name="businessConstraint"
            required
            minLength={20}
            maxLength={2000}
            rows={6}
            placeholder="Describe where the current website, funnel, handoff, or measurement process is losing clarity, leads, or momentum."
            aria-invalid={fieldErrors(state, "businessConstraint").length > 0}
            aria-describedby={describedBy(
              state,
              "businessConstraint",
              "businessConstraint-help",
            )}
            className={controlClass}
          />
          <p id="businessConstraint-help" className={helpClass}>
            Use 20–2,000 characters. Do not include passwords, payment details,
            or other sensitive information.
          </p>
          <FieldError state={state} name="businessConstraint" />
        </div>

        <div>
          <label htmlFor="desiredOutcome" className={labelClass}>
            What result would make this project worthwhile?{" "}
            <span className="font-normal text-white/55">(optional)</span>
          </label>
          <textarea
            id="desiredOutcome"
            name="desiredOutcome"
            maxLength={1000}
            rows={4}
            aria-invalid={fieldErrors(state, "desiredOutcome").length > 0}
            aria-describedby={describedBy(
              state,
              "desiredOutcome",
              "desiredOutcome-help",
            )}
            className={controlClass}
          />
          <p id="desiredOutcome-help" className={helpClass}>
            A measurable outcome is useful, but a clear practical result is
            enough.
          </p>
          <FieldError state={state} name="desiredOutcome" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="timeline" className={labelClass}>
              Target timeline{" "}
              <span className="font-normal text-white/55">(optional)</span>
            </label>
            <select
              id="timeline"
              name="timeline"
              defaultValue=""
              aria-invalid={fieldErrors(state, "timeline").length > 0}
              aria-describedby={describedBy(state, "timeline")}
              className={controlClass}
            >
              <option value="">Select a timeline</option>
              {LEAD_TIMELINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError state={state} name="timeline" />
          </div>

          <div>
            <label htmlFor="budgetRange" className={labelClass}>
              Comfortable investment range{" "}
              <span className="font-normal text-white/55">(optional)</span>
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              defaultValue=""
              aria-invalid={fieldErrors(state, "budgetRange").length > 0}
              aria-describedby={describedBy(state, "budgetRange")}
              className={controlClass}
            >
              <option value="">Select a range</option>
              {LEAD_BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError state={state} name="budgetRange" />
          </div>
        </div>

        <div>
          <label htmlFor="referralSource" className={labelClass}>
            How did you hear about Dark Labs?{" "}
            <span className="font-normal text-white/55">(optional)</span>
          </label>
          <input
            id="referralSource"
            name="referralSource"
            type="text"
            maxLength={200}
            aria-invalid={fieldErrors(state, "referralSource").length > 0}
            aria-describedby={describedBy(state, "referralSource")}
            className={controlClass}
          />
          <FieldError state={state} name="referralSource" />
        </div>

        <div className="rounded-2xl border border-white/12 bg-black/30 p-4">
          <div className="flex items-start gap-3">
            <input
              id="privacyAcknowledged"
              name="privacyAcknowledged"
              type="checkbox"
              required
              aria-invalid={
                fieldErrors(state, "privacyAcknowledged").length > 0
              }
              aria-describedby={describedBy(
                state,
                "privacyAcknowledged",
                "privacy-help",
              )}
              className="mt-1 h-5 w-5 shrink-0 accent-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            />
            <label
              htmlFor="privacyAcknowledged"
              className="text-sm leading-6 text-white/70"
            >
              I have read the{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                privacy notice
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>{" "}
              and understand how my project inquiry will be handled.{" "}
              <span aria-hidden="true">*</span>
            </label>
          </div>
          <p id="privacy-help" className="mt-3 text-xs leading-5 text-white/55">
            Submitting an inquiry does not subscribe you to promotional email.
          </p>
          <FieldError state={state} name="privacyAcknowledged" />
        </div>

        <SubmitButton />

        <p className="text-center text-xs leading-5 text-white/55">
          A successful confirmation means the inquiry was stored for review. It
          does not create a client relationship or reserve project availability.
        </p>
      </form>
    </section>
  );
}
