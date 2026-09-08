import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

/**
 * Every rail card is this width, so three rails read as one system.
 *
 * Must stay a plain string literal, exactly as written below. Tailwind v4
 * finds classes by scanning source files for literal strings — it does not
 * evaluate JavaScript. Derive this from a shared breakpoint object, build it
 * with a template, or compute it any other indirect way, and Tailwind can no
 * longer see the classes: it silently omits them from the generated CSS. The
 * result is every rail card rendering at zero width. No error, no build
 * warning, no failing test — the page just looks broken.
 *
 * RAIL_CARD_SIZES below repeats these same breakpoints for next/image. The
 * two are not derived from each other for the same reason; keep them in sync
 * by hand whenever either changes.
 */
export const RAIL_CARD_WIDTH =
  "w-[78vw] sm:w-[46vw] lg:w-[31vw] xl:w-[22rem]";

/**
 * Mirrors the breakpoints in RAIL_CARD_WIDTH so next/image requests the
 * right source size at each width instead of over-fetching. Same literal-
 * string constraint as RAIL_CARD_WIDTH above, for the same reason — Tailwind
 * only sees classes it can find as text, and this is passed straight into
 * next/image's `sizes` prop rather than a class, but keeping it a plain
 * string here matches RAIL_CARD_WIDTH's pattern and keeps both easy to diff
 * against each other when one changes.
 */
export const RAIL_CARD_SIZES =
  "(max-width: 640px) 78vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 22rem";

/**
 * The page's core unit.
 *
 * The metadata strip is the whole idea: Netflix's "2019 · TV-MA · 4 Seasons"
 * becomes "PERTAMINA · OIL & GAS · IN PRODUCTION · 2024", set in mono the way a
 * SCADA channel labels a signal. That is what stops this being a dark landing
 * page with rows on it.
 */
export function RailCard({
  href,
  poster,
  alt,
  meta,
  title,
  priority,
  children,
  className,
  ...rest
}: {
  href: string;
  poster: StaticImageData;
  alt: string;
  /** Already joined with the separator by the caller. */
  meta: string;
  title: string;
  priority?: boolean;
  /** Rendered under the title. The blurb, a play affordance, a preview slot. */
  children?: React.ReactNode;
  className?: string;
} & Record<`data-${string}`, string | undefined>) {
  return (
    <li
      // z-30: elevated above the fixed architecture layer's z-20 (Task 10c),
      // same reasoning as components/ui/card.tsx.
      className={cn("relative z-30 shrink-0 snap-start", RAIL_CARD_WIDTH, className)}
      {...rest}
    >
      <a
        href={href}
        className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card">
          <Image
            src={poster}
            alt={alt}
            fill
            sizes={RAIL_CARD_SIZES}
            priority={priority}
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        </div>

        <p className="mt-3 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
          {meta}
        </p>
        <h3 className="mt-1 font-heading text-base font-semibold tracking-[-0.01em]">
          {title}
        </h3>
      </a>
      {children}
    </li>
  );
}
