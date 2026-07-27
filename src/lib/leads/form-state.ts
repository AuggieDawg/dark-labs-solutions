export type LeadFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_LEAD_FORM_STATE: LeadFormState = {
  status: "idle",
};
