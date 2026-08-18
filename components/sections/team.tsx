import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { DarkPanel, Section, SectionHeader } from "@/components/section";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Meet the team, sitting directly under the mission and vision pair.
 *
 * Two people, so the grid stops at two columns and the cards are given real
 * size. A four-up grid holding two cards leaves half the row empty, which reads
 * as missing people rather than as a small team — and a two-person founding
 * team is a fact worth presenting confidently, not padding around.
 *
 * ## Photographs
 *
 * `photo` is optional and unset for both members today, so both render as
 * initials. See the note on `TeamMember` in content/copy.ts for why a stock
 * photograph is not an acceptable stand-in for a named person.
 *
 * Initials rather than a silhouette avatar: a generic body-shape icon reads as
 * a broken image, whereas set initials read as a deliberate mark. When real
 * files land in `public/image/team/`, setting `photo` swaps them in and nothing
 * here changes.
 */
export function Team({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="tim" headingId="team-heading" fieldX={-0.26} fieldZoom={1.45}>
      <DarkPanel glow={false}>
        <SectionHeader
          badge={t.team.badge}
          heading={t.team.heading}
          headingId="team-heading"
          body={t.team.body}
        />

        <Reveal
          as="ul"
          stagger={0.1}
          className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2"
        >
          {t.team.members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-6 rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:bg-card sm:flex-row sm:items-center sm:gap-7 md:p-8"
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={320}
                  height={320}
                  sizes="(min-width: 768px) 140px, 128px"
                  className="size-32 shrink-0 rounded-2xl object-cover md:size-36"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-32 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40 font-heading text-3xl tracking-[-0.02em] text-metric md:size-36 md:text-4xl"
                >
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </span>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-xl font-medium leading-tight tracking-[-0.02em] md:text-2xl">
                  {member.name}
                </h3>
                {/* The role is the second-most scanned thing on this card after
                    the name, so it takes the metric colour rather than muted
                    grey — it is the fact that answers "who am I talking to". */}
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-metric">
                  {member.role}
                </p>
                <p className="mt-1 max-w-[36ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </DarkPanel>
    </Section>
  );
}
