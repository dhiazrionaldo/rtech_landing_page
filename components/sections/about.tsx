import { Section, SectionHeader } from "@/components/section";
import { clients, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Mission and vision are quoted verbatim from the deck in Indonesian. The
 * English column is a translation, not a rewrite, so both say the same thing.
 *
 * Client names are set as typographic lockups rather than logo files: CLAUDE.md
 * forbids fabricating a client logo, and we have no supplied brand assets for
 * Pertamina or CAS.
 */
export function About({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="tentang" headingId="about-heading">
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          {t.clients.label}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {clients.map((client) => (
            <li key={client.name} className="flex flex-col items-center gap-1">
              <span className="font-heading text-xl font-medium tracking-[0.02em] text-foreground md:text-2xl">
                {client.name}
              </span>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {client.sector}
              </span>
            </li>
          ))}
        </ul>
        <p className="max-w-[48ch] text-center text-sm leading-relaxed text-muted-foreground">
          {t.clients.note}
        </p>
      </div>

      <div className="mt-16 md:mt-24">
        <SectionHeader
          badge={t.about.badge}
          heading={t.about.heading}
          headingId="about-heading"
          body={t.about.body}
        />

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
          {[
            { label: t.about.missionLabel, text: t.about.mission },
            { label: t.about.visionLabel, text: t.about.vision },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card/60 p-7 md:p-9"
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-metric">
                {item.label}
              </p>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-foreground md:text-lg">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
