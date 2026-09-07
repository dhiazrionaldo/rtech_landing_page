import { Reveal } from "@/components/motion/reveal";
import { ScrubRail } from "@/components/motion/scrub-rail";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardLabel } from "@/components/ui/card";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * The four project stages, as cards hung off a rail.
 *
 * The rail is the reason this section does not look like every other agency's
 * four-step strip. It is a real hairline above the cards, carrying a solid node
 * where each stage begins and a taller tick where a decision sits between two
 * stages — how a gauge face or a P&ID marks a run, which is the visual language
 * CLAUDE.md asks for: the control room our clients work in, not "AI" as an
 * abstraction. The cards were the client's call; keeping the rail above them
 * means the section gained a card surface without losing the one element that
 * made it specific to this business.
 *
 * The rail draws itself as you scroll the section. It is the only scrubbed
 * animation on the page — see ScrubRail for why it earns that and nothing else
 * does.
 *
 * These ARE numbered. CLAUDE.md bans `01 / 02 / 03` markers on anything that
 * isn't genuinely a sequence; four stages that must happen in order is the case
 * the rule leaves room for, and the numbers carry real information here.
 *
 * `<ol>` because the order is the point. Every stage is in the initial HTML —
 * nothing is behind a tab or an accordion, so the whole process is crawlable
 * and readable in one pass.
 */
export function Process({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const { phases } = t.process;

  return (
    <Section id="cara-kerja" headingId="process-heading">
      <SectionHeader
        badge={t.process.badge}
        heading={t.process.heading}
        headingId="process-heading"
        body={t.process.body}
      />

      {/* The rail, and the markers that ride on it, sit above the cards in
          their own row. Keeping them out of the cards is what lets the cards be
          ordinary rounded surfaces while the section still reads as one run of
          work rather than four unrelated boxes. */}
      <div className="mt-16 lg:mt-24">
        <div className="relative hidden lg:block">
          <ScrubRail />
          <ol
            aria-hidden="true"
            className="grid grid-cols-4 gap-x-5"
          >
            {phases.map((phase, index) => (
              <li key={phase.id} className="relative">
                <span className="absolute -top-[3px] left-0 size-1.5 bg-foreground" />
                {/* The decision point you passed to reach this stage. Absent on
                    the first, which nobody decides their way into. */}
                {index > 0 ? (
                  <>
                    <span className="absolute -top-2 left-0 h-4 w-px bg-foreground" />
                    <span className="absolute -top-8 left-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {t.process.gateLabel}
                    </span>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <Reveal
          as="ol"
          stagger={0.09}
          className="grid gap-5 md:grid-cols-2 lg:mt-8 lg:grid-cols-4"
        >
          {phases.map((phase, index) => (
            <Card
              key={phase.id}
              as="li"
              interactive
              className="flex flex-col gap-6"
            >
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.6875rem] tabular-nums tracking-[0.1em] text-metric"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-medium leading-tight tracking-[-0.01em] text-balance md:text-xl">
                  <span className="sr-only">
                    {t.process.phaseLabel} {index + 1} {t.process.of}{" "}
                    {phases.length}:{" "}
                  </span>
                  {phase.name}
                </h3>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <CardLabel>{t.process.deliverablesLabel}</CardLabel>
                <ul className="flex flex-col gap-2.5">
                  {phase.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.8125rem] leading-snug text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.5em] h-px w-3 shrink-0 bg-metric"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dashed, because this half of the work is on the client's side
                  of the line. The distinction is the point of stating it. */}
              <p className="rounded-xl border border-dashed border-border bg-muted/50 p-4 text-[0.8125rem] leading-snug text-muted-foreground">
                <span className="mb-1.5 block font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-foreground">
                  {t.process.needsLabel}
                </span>
                {phase.needs}
              </p>
            </Card>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
