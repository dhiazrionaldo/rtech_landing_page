import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { DarkPanel, Section, SectionHeader } from "@/components/section";
import { CardLabel } from "@/components/ui/card";
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
    <Section id="tentang" headingId="about-heading" fieldX={0.28} fieldZoom={1.3}>
      {/* Centred, unruled, and on the original spacing — the client asked for
          this arrangement back after seeing it as a left-hung ruled band. */}
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          {t.clients.label}
        </p>

        {/* Six clients now rather than two, so this is a wrapping centred row
            with a tighter gutter. `items-stretch` matters: the wordmark plates
            are taller than the logo plates at some widths, and without it the
            sector labels stop sharing a baseline across a wrapped row. */}
        <ul className="flex flex-wrap items-stretch justify-center gap-x-6 gap-y-8">
          {clients.map((client) => (
            <li
              key={client.name}
              className="flex w-[min(15rem,42vw)] flex-col items-center gap-2"
            >
              {/* Fixed band so every mark shares one optical centre line and the
                  sector labels sit on one baseline. Sizing each logo to the same
                  height instead would leave the taller lockups oversized.

                  The white plate appears in dark mode only — see --surface-brand
                  in globals.css. Light mode keeps the approved spacing exactly. */}
              <span className="flex h-9 w-full items-center justify-center rounded-lg dark:h-14 dark:bg-surface-brand dark:px-4">
                {client.logo ? (
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
                ) : (
                  // No artwork yet. Set in our own display face rather than
                  // approximating theirs: naming a client is a claim we are
                  // entitled to make, drawing their trademark is not. Dark text
                  // because this sits on the same white plate the real marks do.
                  <span className="text-balance px-1 text-center font-heading text-[0.9375rem] font-medium leading-tight tracking-[-0.01em] text-foreground dark:text-neutral-900">
                    {client.wordmark}
                  </span>
                )}
              </span>
              <span className="text-center font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {client.sector}
              </span>
            </li>
          ))}
        </ul>
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

        {/* Mission and vision, both deck-verbatim.
​
            Vision was dropped from this section during the word-budget pass and
            put back at the client's request. Nothing about either string
            changed while it was out — CLAUDE.md forbids rewording the
            deck-verbatim copy, so it was only ever a rendering change.

            Set as two ruled pull-quotes rather than the original two cards. On
            a translucent panel sitting over the node field, a card is a second
            opaque surface inside an already-layered stack; a hairline rule and
            a hanging indent give the pair the same structure without adding
            another box. The rules also line the two statements up on a shared
            left edge, which is the comparison the section is actually making.

            Typography note kept from the earlier pass: these were once set in
            the display face (Archivo) at 23px with tight tracking. Archivo is a
            display grotesk built for a three-word headline, not for a sentence
            of abstract nouns. They stay in the body face with open leading and
            a 44ch measure. */}
        <Reveal
          as="dl"
          stagger={0.1}
          className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-8"
        >
          {[
            { label: t.about.missionLabel, text: t.about.mission },
            { label: t.about.visionLabel, text: t.about.vision },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-6 border-l border-border pl-7 md:pl-10"
            >
              <dt>
                <CardLabel tone="metric">{item.label}</CardLabel>
              </dt>
              <dd className="max-w-[44ch] text-[1.0625rem] leading-[1.65] text-foreground md:text-[1.125rem]">
                {item.text}
              </dd>
            </div>
          ))}
        </Reveal>
      </DarkPanel>
    </Section>
  );
}
