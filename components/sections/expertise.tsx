import { Plus } from "lucide-react";

import { Section, SectionHeader } from "@/components/section";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * The reference's expandable list, carrying the deck's three sectors and the
 * projects delivered in each.
 *
 * Two deliberate departures from the reference: the rows are not numbered —
 * CLAUDE.md bans `01 / 02 / 03` markers on anything that isn't genuinely a
 * sequence, and three parallel sectors are not one — and the disclosure is a
 * native <details>, which is keyboard accessible, works with JavaScript off,
 * and puts every project name in the initial HTML where a crawler can read it.
 */
export function Expertise({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="keahlian" headingId="expertise-heading">
      <SectionHeader
        badge={t.expertise.badge}
        heading={t.expertise.heading}
        headingId="expertise-heading"
        body={t.expertise.body}
      />

      <div className="mt-10 border-t border-border md:mt-14">
        {t.expertise.sectors.map((sector, index) => (
          <details
            key={sector.id}
            open={index === 0}
            className="group border-b border-border"
          >
            <summary className="flex cursor-pointer list-none items-center gap-6 py-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              <span className="font-heading text-xl font-medium tracking-[-0.01em] md:text-2xl">
                {sector.name}
              </span>
              <span className="ml-auto hidden max-w-[42ch] text-right text-sm text-muted-foreground md:block">
                {sector.discipline}
              </span>
              <Plus
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
              />
            </summary>

            <div className="pb-9">
              <p className="mb-6 max-w-[52ch] text-sm text-muted-foreground md:hidden">
                {sector.discipline}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sector.projects.map((project) => (
                  <li
                    key={project}
                    className="rounded-xl border border-border bg-card/50 px-5 py-4 text-sm leading-snug text-foreground"
                  >
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
