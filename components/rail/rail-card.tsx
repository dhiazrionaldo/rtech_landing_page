import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

/** Every rail card is this width, so three rails read as one system. */
export const RAIL_CARD_WIDTH =
  "w-[78vw] sm:w-[46vw] lg:w-[31vw] xl:w-[22rem]";

/** Matches RAIL_CARD_WIDTH. Passed to next/image so it never over-fetches. */
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
}) {
  return (
    <li className={cn("shrink-0 snap-start", RAIL_CARD_WIDTH, className)}>
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
