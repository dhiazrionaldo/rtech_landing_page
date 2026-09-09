import { Reveal } from "@/components/motion/reveal";
import { DarkPanel, Section, SectionHeader } from "@/components/section";
import { CardLabel } from "@/components/ui/card";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Mission and vision are quoted verbatim from the deck in Indonesian. The
 * English column is a translation, not a rewrite, so both say the same thing.
 *
 * The client marks used to sit at the top of this section. They are in
 * `components/sections/trusted-by.tsx` now, directly under the billboard —
 * see that file for why the names are still set in text beside the artwork.
 *
 * ## Team block removed (Task 10c)
 *
 * The client asked for "who you'll work with" to go. The label, the member
 * list, and the (always-empty) photo slot are gone from this section; `team`
 * and `TeamMember` are gone from `content/copy.text.ts` entirely, and the
 * `Person` JSON-LD that named the two founders is gone from
 * `components/seo/structured-data.tsx`, along with the `founder` reference
 * that pointed at it. CLAUDE.md asks for a `Person` node per team member —
 * this is a deliberate, client-directed removal of the content that schema
 * described, not an oversight: schema naming people who are not on the page
 * is a mismatch risk, and the client removed the page content first.
 */
export function About({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="tentang" headingId="about-heading">
      {/* The client marks moved to `TrustedBy`, directly under the billboard.
          This section is the mission/vision panel now and nothing else. */}
      <DarkPanel glow={false}>
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

            Set as two ruled pull-quotes rather than the original two cards. A
            card is a second opaque surface inside an already-panelled block;
            a hairline rule and a hanging indent give the pair the same
            structure without adding another box. The rules also line the two
            statements up on a shared left edge, which is the comparison the
            section is actually making.

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

        {/* The closing statement. Outside both pull-quotes and under the pair
            rather than beside them, because it is not a third item in that
            comparison — it is the thing the mission and the vision are both
            in service of, and a two-column grid would have read it as a
            sibling of each.

            Centred, which is the one place on this page that earns it. The
            mission/vision pair is deliberately left-hung on a shared rule so
            the two can be read against each other; this has nothing to be
            compared to, so the symmetry says "this is the whole section
            talking" rather than "here is another column". A `65ch` measure
            keeps the line length readable at that width instead of running
            the full panel.

            The rule above it is the same hairline the pull-quotes hang on,
            turned horizontal — it separates without introducing another
            surface inside an already-panelled block. */}
        <Reveal className="mt-14 border-t border-border pt-10 md:mt-20 md:pt-14">
          <p className="mx-auto max-w-[65ch] text-center text-[0.9375rem] leading-[1.75] text-muted-foreground md:text-base">
            {t.about.closing}
          </p>
        </Reveal>
      </DarkPanel>
    </Section>
  );
}
