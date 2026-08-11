import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

/**
 * Section shell. The page stays one continuous surface — no background change
 * between sections — so structure has to come from spacing and hairlines.
 */
export function Section({
  id,
  headingId,
  children,
  className,
}: {
  id?: string;
  headingId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
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
        "dark relative overflow-hidden rounded-[1.5rem] border border-border bg-background text-foreground",
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
          measure and gives the section a masthead rather than a title. */}
      <div className="grid gap-x-10 gap-y-8 pt-6 md:grid-cols-12 md:pt-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground md:col-span-12 lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
          {badge}
        </p>

        <h2
          id={headingId}
          className="font-heading text-[clamp(1.875rem,3.6vw,3.125rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance md:col-span-7 lg:col-span-6"
        >
          {heading}
        </h2>

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
