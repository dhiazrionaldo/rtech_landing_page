import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

/**
 * Section shell. The page stays one continuous surface — no background change
 * between sections — so structure has to come from spacing and hairlines.
 */
export function Section({
  id,
  headingId,
  objectX,
  children,
  className,
}: {
  id?: string;
  headingId: string;
  /**
   * Where this section wants the fixed architecture layer, -1 (left) to 1
   * (right). Rendered as `data-object-x` — the scene reads every one of these
   * on scroll and eases toward whichever sits nearest the viewport centre.
   * Omit on a section that shouldn't be a choreography stop.
   */
  objectX?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-object-x={objectX}
      className={cn("scroll-mt-24 px-3 py-20 md:px-6 md:py-28", className)}
    >
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}

/**
 * The default section masthead: a full-bleed hairline with the section label
 * hung in the left gutter and the heading set against it.
 *
 * This replaced a centred pill-over-heading block that every section shared.
 * Three consecutive centred headers is the single loudest "template" signal a
 * page can send — the eye finds the same shape at the same x-position each time
 * and stops reading. An asymmetric masthead does the opposite: the label column
 * gives the page a visible left edge, and the heading column can then carry
 * longer, more specific copy without becoming a centred paragraph.
 *
 * The label is `sticky` on large screens, so on a tall section it stays beside
 * the content it names. That is a small thing that reads as considered.
 */
/**
 * The black rounded panel. Three sections wear it now — about, products, and
 * contact — so it is defined once here rather than copied into each.
 *
 * The mechanism is the `dark` class, not a set of hardcoded colours. Everything
 * inside resolves its tokens to their dark values, which means `bg-card`,
 * `text-muted-foreground`, the Card component, and the client logos' white
 * plates all recolour correctly with no per-section overrides. It also stays
 * black in light mode, which is the point.
 *
 * `overflow-hidden` keeps the glow inside the corner radius. The content sits in
 * a `relative` wrapper so it stacks above the glow layer without needing a
 * z-index.
 *
 * `glow` is a prop rather than always-on because the gradient is meant to read
 * as light thrown by something in the frame. Behind the hero machine and under
 * the product footage it has a source. On a panel of pure text it is decoration,
 * and four identical glows across one page is wallpaper.
 */
export function DarkPanel({
  children,
  glow = true,
  className,
}: {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Task 10b brought the architecture layer back as a fixed object behind
        // every section, including About, which wears this panel. Fully opaque
        // (the choice made when the node field it used to read through was
        // removed) would hide that layer completely here, defeating the
        // choreography that puts it on this section's side. `/96` is a small
        // enough gap that the layer's own low opacity barely registers through
        // it — legibility is the gate CLAUDE.md sets, not the object's
        // visibility, so this errs toward keeping body copy exactly as
        // readable as an opaque panel rather than toward showing more object.
        "relative overflow-hidden rounded-[1.5rem] border border-border bg-background/96 text-foreground",
        "px-6 py-16 md:rounded-[2rem] md:px-10 md:py-20 lg:px-14",
        className,
      )}
    >
      {glow ? (
        <div aria-hidden="true" className="media-glow absolute inset-0" />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

export function SectionHeader({
  badge,
  heading,
  headingId,
  body,
  aside,
  className,
}: {
  badge: string;
  heading: string;
  headingId: string;
  body?: string;
  /** Optional trailing element under the body — a CTA, a note. */
  aside?: React.ReactNode;
  className?: string;
}) {
  const hasSideColumn = Boolean(body || aside);

  return (
    <div className={cn("relative", className)}>
      {/* Scale marker: a short heavy segment against a hairline, the way a
          gauge face is ruled. Structure, not ornament. */}
      <div aria-hidden="true" className="flex h-px w-full">
        <span className="h-px w-16 bg-foreground" />
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Three tracks, not two. A label-plus-column layout leaves the right
          third of a 1400px page empty and the header reads as a fragment;
          setting the body copy as its own column beside the heading fills the
          measure and gives the section a masthead rather than a title.

          When there is nothing to put in the third track the heading takes the
          space instead of leaving a hole. Two sections deliberately ship with
          no body at all — five identical badge/heading/paragraph units in a row
          is what made the page read as generated — and the point of dropping
          the paragraph is lost if the layout still reserves a column for it.
          Set larger there too: a short heading alone has to carry the section
          on its own, so it gets the display size it can afford at that
          length. */}
      <div className="grid gap-x-10 gap-y-8 pt-6 md:grid-cols-12 md:pt-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground md:col-span-12 lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          {badge}
        </p>

        <h2
          id={headingId}
          className={cn(
            "font-heading font-medium leading-[1.05] tracking-[-0.025em] text-balance",
            hasSideColumn
              ? "text-[clamp(1.875rem,3.6vw,3.125rem)] md:col-span-7 lg:col-span-6"
              // Eight columns, not ten. At ten a long heading ran to the right
              // edge and a short one left half the row empty, so the two
              // body-less sections read as two different layouts. Held to eight
              // the long one wraps to two lines and the short one rags early on
              // purpose, and both sit on the same right edge.
              : "text-[clamp(2rem,4.4vw,3.75rem)] md:col-span-11 lg:col-span-8",
          )}
        >
          {heading}
        </h2>

        {hasSideColumn ? (
          <div className="flex flex-col gap-6 md:col-span-5 lg:col-span-4 lg:pt-1.5">
            {body ? (
              // 16px, not 15px, and leading-[1.7]. This column carries the only
              // explanatory prose in each section; at 15px in muted grey it sat
              // right on the edge of comfortable and read as a caption.
              <p className="text-base leading-[1.7] text-muted-foreground">
                {body}
              </p>
            ) : null}
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The centred variant, kept for the one place it earns its keep: the contact
 * panel, which is a single focused moment rather than a section of content.
 */
export function CenteredHeader({
  badge,
  heading,
  headingId,
  body,
  className,
}: {
  badge: string;
  heading: string;
  headingId: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-5 text-center", className)}>
      <Pill>{badge}</Pill>
      <h2
        id={headingId}
        className="max-w-[20ch] font-heading text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-balance"
      >
        {heading}
      </h2>
      {body ? (
        <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-balance text-muted-foreground">
          {body}
        </p>
      ) : null}
    </div>
  );
}
