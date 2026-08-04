/**
 * CLAUDE.md forbids inventing metrics, client names, or contact details.
 * Anything the client still owes us is typed as `Pending` rather than filled
 * with a plausible-looking guess, so a placeholder can never be mistaken for
 * real copy — in the source, in review, or in the shipped HTML.
 */
export type Pending = {
  readonly kind: "pending";
  /** What we need from the client, phrased so they can answer it directly. */
  readonly need: string;
};

export function pending(need: string): Pending {
  return { kind: "pending", need };
}

export function isPending(value: unknown): value is Pending {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Pending).kind === "pending"
  );
}

/** A value that is either real copy or an outstanding request to the client. */
export type Fillable = string | Pending;
