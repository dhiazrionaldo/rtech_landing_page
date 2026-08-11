import { cn } from "@/lib/utils";

/**
 * The page's one card treatment. Every card on the page comes from here, so a
 * change to the surface is a change in one place — that consistency is most of
 * what separates a designed page from a collection of styled boxes.
 *
 * Deliberately not shadcn's `Card`. CLAUDE.md requires stock shadcn defaults to
 * be unrecognisable in the shipped page, and shadcn's card is a `bg-card` +
 * `shadow-sm` box that reads as an app surface. This one is built from the same
 * materials as the rest of the page: a hairline border, a barely-there fill,
 * and the `--radius` token. No shadow at rest.
 *
 * Elevation on hover comes from the border and the fill, not from a drop
 * shadow — on a pure-white page a shadow is the one thing that instantly reads
 * as a template, and on the pure-black dark background it is invisible anyway.
 *
 * Not glassmorphism: `bg-card` is an opaque token surface, there is no backdrop
 * blur, and nothing sits over a blurred gradient. CLAUDE.md bans that pattern
 * and this is not it.
 */
export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
  ...rest
}: {
  as?: "div" | "li" | "article";
  /** Adds the hover lift. Only for cards that are, or contain, a control. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl border border-border bg-card/60 p-7 md:p-8",
        interactive && [
          "transition-[transform,background-color,border-color] duration-300 ease-out",
          "hover:-translate-y-1 hover:border-foreground/25 hover:bg-card",
          // The lift is decoration; someone who has asked the OS for less
          // motion still gets the colour change, which is the part that
          // actually communicates "this responds".
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        ],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** The small mono label that opens a card. */
export function CardLabel({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  /** `metric` uses the teal ramp, reserved by CLAUDE.md for data and metrics. */
  tone?: "muted" | "metric" | "foreground";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.5625rem] uppercase tracking-[0.16em]",
        tone === "metric" && "text-metric",
        tone === "muted" && "text-muted-foreground",
        tone === "foreground" && "text-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
