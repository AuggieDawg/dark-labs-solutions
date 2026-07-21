export type ProspectActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_PROSPECT_ACTION_STATE: ProspectActionState = {
  status: "idle",
};
