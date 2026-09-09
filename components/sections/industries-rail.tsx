import { Rail } from "@/components/rail/rail";
import { RAIL_CARD_WIDTH } from "@/components/rail/rail-card";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Three sectors, each listing what we actually built there.
 *
 * Not numbered: CLAUDE.md bans 01/02/03 markers on anything that is not a
 * sequence, and three parallel sectors are not one. The project count sits
 * beside the sector name and states its own noun.
 */
export function IndustriesRail({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Rail
      id="industri"
      title={t.rails.industries}
      titleId="industries-heading"
      labels={{ prev: t.rails.prev, next: t.rails.next }}
    >
      {t.expertise.sectors.map((sector) => (
        <li
          key={sector.id}
          className={`flex shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 ${RAIL_CARD_WIDTH}`}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-lg font-semibold tracking-[-0.01em]">
              {sector.name}
            </h3>
            <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] tabular-nums text-metric">
              {`${sector.projects.length} ${
                sector.projects.length === 1
                  ? t.expertise.projectCount.one
                  : t.expertise.projectCount.other
              }`}
            </span>
          </div>

          <p className="mt-2 text-[0.8125rem] leading-snug text-muted-foreground">
            {sector.discipline}
          </p>

          <ul className="mt-5">
            {sector.projects.map((project) => (
              <li
                key={project}
                className="flex items-baseline gap-3 border-t border-border py-3 text-sm leading-snug"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-3 shrink-0 translate-y-[-0.35em] bg-metric"
                />
                <span>{project}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </Rail>
  );
}
