import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { DarkPanel, Section, SectionHeader } from "@/components/section";
import { Card, CardLabel } from "@/components/ui/card";
import { clients, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Mission and vision are quoted verbatim from the deck in Indonesian. The
 * English column is a translation, not a rewrite, so both say the same thing.
 *
 * The client marks are the companies' own published logo files — see the note
 * on `clients` in content/copy.ts — and render in their real brand colours.
 *
 * Every client is also named in text next to its mark. A logo is an image; the
 * proof has to survive an image that fails to load, a screen reader, and a
 * crawler, so the name is never carried by the picture alone.
 */
export function About({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="tentang" headingId="about-heading">
      {/* Centred, unruled, and on the original spacing — the client asked for
          this arrangement back after seeing it as a left-hung ruled band. */}
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          {t.clients.label}
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {clients.map((client) => (
            <li key={client.name} className="flex flex-col items-center gap-2">
              {/* Fixed band so the two marks share one optical centre line and
                  their sector labels sit on one baseline. Sizing both logos to
                  the same height instead would make the taller lockup look
                  oversized next to the shorter one.

                  The white plate appears in dark mode only — see --surface-brand
                  in globals.css. Light mode keeps the approved spacing exactly. */}
              <span className="flex h-9 items-center rounded-lg dark:h-14 dark:bg-surface-brand dark:px-4">
                <Image
                  src={client.logo}
                  alt={client.wordmark}
                  // One mark is an SVG the optimiser cannot process and the
                  // other is already under 13 KB at its native size, so the
                  // pipeline would cost a request and save nothing.
                  unoptimized
                  style={{ height: client.height }}
                  className="w-auto"
                />
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

      {/* The client marks stay out on the page surface. Inside the panel they
          would pick up the dark-mode white plates, and the full-colour logos on
          white is the arrangement already signed off. */}
      <DarkPanel glow={false} className="mt-16 md:mt-24">
        <SectionHeader
          badge={t.about.badge}
          heading={t.about.heading}
          headingId="about-heading"
          body={t.about.body}
        />

        {/* Typography note, kept from the previous pass: these were once set in
            the display face (Archivo) at 23px with tight tracking. Archivo is a
            display grotesk built for a three-word headline, not for a 25-word
            sentence of abstract nouns. Inside the card they stay in the body
            face with open leading and a 44ch measure. The surface changed; the
            readability work did not. */}
        <Reveal as="dl" stagger={0.1} className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
          {[
            { label: t.about.missionLabel, text: t.about.mission },
            { label: t.about.visionLabel, text: t.about.vision },
          ].map((item) => (
            <Card key={item.label} className="flex flex-col gap-6">
              <dt>
                <CardLabel tone="metric">{item.label}</CardLabel>
              </dt>
              <dd className="max-w-[44ch] text-[1.0625rem] leading-[1.65] text-foreground md:text-[1.125rem]">
                {item.text}
              </dd>
            </Card>
          ))}
        </Reveal>
      </DarkPanel>
    </Section>
  );
}
