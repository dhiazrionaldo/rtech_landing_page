import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

import { RailControls } from "./rail-controls";

/**
 * A Netflix row: title, paging controls, and a horizontal scroll-snap track.
 *
 * Native `overflow-x` plus CSS scroll-snap does all the scrolling. There is no
 * carousel library and no JavaScript in the scroll path, so the track works
 * with JavaScript disabled and every card is in the initial HTML.
 *
 * The track is a plain <ul> of <li>. Nothing is hidden, nothing is virtualised,
 * and tab order is source order.
 */
export function Rail({
  id,
  title,
  titleId,
  labels,
  objectX,
  children,
  className,
}: {
  id: string;
  title: string;
  titleId: string;
  labels: { prev: string; next: string };
  /**
   * Where this rail wants the fixed architecture layer, -1 (left) to 1
   * (right). See `Section`'s `objectX` for the mechanism — this is the same
   * `data-object-x` contract on a `<section>` that isn't built with `Section`.
   */
  objectX?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const trackId = `${id}-track`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-object-x={objectX}
      className={cn("scroll-mt-24 py-10 md:py-14", className)}
    >
      {/* z-30: elevated above the fixed architecture layer's z-20 (Task 10c) —
          the rail title and its prev/next controls are text and controls,
          not the section's own background. */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1400px] items-end justify-between gap-6 px-3 md:px-6">
        <h2
          id={titleId}
          className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[-0.02em]"
        >
          {title}
        </h2>
        <RailControls trackId={trackId} labels={labels} />
      </div>

      <Reveal
        as="ul"
        id={trackId}
        stagger={0.06}
        y={16}
        // motion-safe: a reduced-motion user gets an instant jump rather than a
        // 400ms glide they did not ask for.
        className="rail-track mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 motion-safe:scroll-smooth"
      >
        {children}
      </Reveal>
    </section>
  );
}
