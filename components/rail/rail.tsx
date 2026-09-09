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
  banner,
  sceneZone = false,
  children,
  className,
}: {
  id: string;
  title: string;
  titleId: string;
  labels: { prev: string; next: string };
  /**
   * Optional decorative band between the heading and the track. Takes the
   * same container and lane clearance as the heading row, so it lines up with
   * the page grid rather than with the full-bleed track below it. Nothing
   * load-bearing goes here — see `SystemStream`.
   */
  banner?: React.ReactNode;
  /**
   * Reserve the fixed scene's lane, and declare this section one of the two
   * zones the scene is visible over. Opt-in rather than automatic: the scene
   * only covers the top of the page now, so every rail below it takes the
   * full measure back. See `FixedScene`.
   */
  sceneZone?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const trackId = `${id}-track`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-scene-zone={sceneZone ? "" : undefined}
      className={cn("scroll-mt-24 py-10 md:py-14", className)}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1400px] items-end justify-between gap-6 px-3 md:px-6",
          sceneZone && "lg:pr-[var(--scene-lane)]",
        )}
      >
        <h2
          id={titleId}
          className="font-heading text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[-0.02em]"
        >
          {title}
        </h2>
        <RailControls trackId={trackId} labels={labels} />
      </div>

      {banner ? (
        <div
          className={cn(
            "mx-auto mt-5 w-full max-w-[1400px] px-3 md:px-6",
            sceneZone && "lg:pr-[var(--scene-lane)]",
          )}
        >
          {banner}
        </div>
      ) : null}

      <Reveal
        as="ul"
        id={trackId}
        stagger={0.06}
        y={16}
        // motion-safe: a reduced-motion user gets an instant jump rather than a
        // 400ms glide they did not ask for.
        // `lg:mr-[var(--scene-inset)]` rather than padding: this element is
        // the scroll viewport, so shrinking it is what stops cards travelling
        // underneath the fixed scene. Padding would sit inside the scrollable
        // area and cards would still pass through it. Measured from the
        // viewport edge because this track is full-bleed by design and has no
        // max-width to hang the lane off — see `--scene-inset` in globals.css.
        // Below `lg` the token is 0 and the rail keeps its full bleed.
        className={cn(
          "rail-track mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 motion-safe:scroll-smooth",
          // Only the scene's own zone gives up the lane; every rail below it
          // bleeds to the viewport edge again, which is the shape the track
          // was designed for.
          sceneZone && "rail-track-lane lg:mr-[var(--scene-inset)]",
        )}
      >
        {children}
      </Reveal>
    </section>
  );
}
