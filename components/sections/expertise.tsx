import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/section";
import { Card } from "@/components/ui/card";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * The deck's three sectors, side by side in one row, each independently
 * expandable.
 *
 * Three sectors are parallel, not sequential — stacking them as full-width rows
 * implied a ranking they do not have, and cost three screens of scroll to say
 * so. Abreast, the comparison the section is actually making is visible at a
 * glance and the whole thing fits in one view.
 *
 * They are not numbered: CLAUDE.md bans `01 / 02 / 03` markers on anything that
 * isn't genuinely a sequence, and three parallel sectors are not one.
 *
 * The count of projects in each sector used to be rendered as a zero-padded
 * numeral in the left gutter ahead of the sector name — the exact slot, format,
 * and colour an ordinal marker occupies. It read as `03 / 03 / 04`, which
 * anyone parses as broken numbering rather than as three counts, and it was
 * `aria-hidden` on top of that, so it told a screen reader nothing at all. It
 * now sits beside the disclosure control and states its own noun: "3 Projects".
 * That is where a "how many things are in here" count belongs, it can no longer
 * be mistaken for an index, and it is announced with the control it describes.
 *
 * The disclosure is still a native <details>, which is keyboard accessible,
 * works with JavaScript off, and puts every project name in the initial HTML
 * where a crawler can read it. All three open by default: the columns are short
 * enough to show every project at once, so the control is there to collapse
 * what you have finished with rather than to hide the content on arrival.
 */
export function Expertise({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="keahlian" headingId="expertise-heading" fieldX={0.28} fieldZoom={1.6}>
      {/* No body. The paragraph here said the constraints differ by sector and
          that everything listed was built rather than proposed — both of which
          the three columns underneath demonstrate on their own. It was also the
          third consecutive badge/heading/paragraph unit on the page, which is
          the shape a reader stops reading. See the house-style note in
          content/copy.ts. */}
      <SectionHeader
        badge={t.expertise.badge}
        heading={t.expertise.heading}
        headingId="expertise-heading"
      />

      <Reveal
        as="div"
        stagger={0.09}
        className="mt-16 grid items-start gap-5 md:grid-cols-3 lg:mt-24"
      >
        {t.expertise.sectors.map((sector) => (
          <Card
            key={sector.id}
            as="article"
            interactive
            // p-0 because the <summary> is the click target and it needs to
            // carry the padding itself — inset padding on the card would leave
            // a dead border of un-clickable card around the control.
            className="p-0 md:p-0"
          >
            {/* `group` belongs on the <details>, not on the Card: the marker
                rotates off `group-open`, which resolves to `.group[open]`, and
                the `open` attribute only ever lives here. */}
            <details open className="group">
              <summary className="flex cursor-pointer list-none items-start gap-4 rounded-2xl p-7 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <span className="flex flex-col gap-2">
                  <span className="font-heading text-xl font-medium leading-none tracking-[-0.02em] lg:text-2xl">
                    {sector.name}
                  </span>
                  <span className="text-[0.8125rem] leading-snug text-muted-foreground">
                    {sector.discipline}
                  </span>
                </span>

                {/* Count and control travel together: the number describes what
                    the control opens, so it belongs next to it rather than in
                    the gutter where an index would sit. */}
                <span className="ml-auto flex shrink-0 items-center gap-3 pt-px">
                  {/* Built as one string rather than adjacent JSX expressions:
                      React splits those into separate text nodes with comment
                      markers between them, which breaks the phrase apart for
                      anything reading the raw HTML. */}
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] tabular-nums text-metric">
                    {`${sector.projects.length} ${
                      sector.projects.length === 1
                        ? t.expertise.projectCount.one
                        : t.expertise.projectCount.other
                    }`}
                  </span>
                  <Plus
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                  />
                </span>
              </summary>

              <ul className="px-7 pb-7">
                {sector.projects.map((project) => (
                  <li
                    key={project}
                    className="flex items-baseline gap-3 border-t border-border py-3.5 text-sm leading-snug text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-3 shrink-0 translate-y-[-0.35em] bg-metric"
                    />
                    <span>{project}</span>
                  </li>
                ))}
              </ul>
            </details>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}
