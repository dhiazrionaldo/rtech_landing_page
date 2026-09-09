import Image from "next/image";

import { CountUp } from "@/components/motion/count-up";
import { HeroScene } from "@/components/motion/hero-scene";
import { ActionButton } from "@/components/ui/action-button";
import { clients, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";
import { isPending } from "@/content/pending";

import billboardPoster from "@/public/image/capture-optigain.webp";

/**
 * The billboard.
 *
 * Left-anchored and lower-third, which is where Netflix puts its title block.
 * The old hero centred everything, and a centred composition with a centred
 * nav above it reads as a slide rather than a screen.
 *
 * The poster is the LCP element and is the only `priority` image on the page.
 * The showreel video is added in Task 17 and is never the LCP element.
 *
 * ## Two-column hero (Task 10e)
 *
 * Above `lg` the copy block above sits in a grid beside a right column that
 * holds `HeroScene`, a Spline scene replacing the three.js architecture
 * object that used to live here (Task 10b–10c). The client asked for one
 * WebGL runtime on the page, not two, and chose Spline over three.js/R3F.
 * The two columns are a CSS grid with an explicit track for the object
 * column, so they never overlap regardless of how much copy the left column
 * carries. Below `lg`, and under `prefers-reduced-motion: reduce`,
 * `HeroScene` does not render at all — see that component for the gate,
 * which runs before the Spline runtime is ever requested, not after.
 *
 * The poster below stays the full-bleed background behind both columns, keeps
 * `priority`, and remains the LCP element regardless of whether the scene has
 * loaded — a hosted Spline scene must never become the largest contentful
 * paint on this page.
 *
 * ## Stacking
 *
 * `isolate` is back on this header. Task 10b/10c had removed it because a
 * page-wide, positive-z-index architecture layer used to sit in front of
 * every section, and isolating this header would have sealed `#billboard-
 * frame`'s `-z-20` background away from that comparison in ways that did not
 * track the object's own z-index. That page-wide layer is gone (Task 10e):
 * the only positioned descendants inside this header now are `#billboard-
 * frame` at `-z-20` and, above `lg`, `HeroScene`'s own scene box, which
 * carries no z-index of its own and simply sits in normal grid flow above
 * the negatively-stacked poster. Nothing outside this header needs to
 * compare against anything inside it any more, so `isolate` is the correct,
 * boring choice again: it keeps `-z-20` from ever being able to leak past
 * this header's own boundary, full stop.
 */
export function Billboard({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? "#kontak" : t.cta.href;

  return (
    <header
      className="relative isolate flex min-h-[min(94svh,960px)] flex-col justify-end overflow-hidden"
    >
      <div
        id="billboard-frame"
        data-billboard-frame=""
        aria-hidden="true"
        className="absolute inset-0 -z-20"
      >
        {/* The art is atmosphere, the type is the message. A filter is not a
            colour, so dimming and desaturating here does not touch the
            no-hardcoded-colour rule — it holds for any poster this frame ever
            carries, not just this one. */}
        <Image
          src={billboardPoster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.55] saturate-[0.4]"
        />
        {/* Scrim. A hard stop over the title column rather than a slow fade:
            solid --background through 42% of the frame width, gone by 78%, so
            the right side of the poster still reads as a lit image. Bottom
            gradient catches the logo row. Both built from --background so
            they survive a theme switch. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background from-42% via-background/85 via-62% to-transparent to-78%" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/85 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-3 pb-10 pt-28 md:px-6 md:pb-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end lg:gap-16">
        <div className="min-w-0">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
            {t.hero.eyebrow}
          </p>

          <h1
            className="mt-4 max-w-[16ch] font-heading text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em]"
            style={{ fontVariationSettings: "'wdth' 88" }}
          >
            {t.hero.headline}
          </h1>

          <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-[1.65] text-muted-foreground md:text-base">
            {t.hero.subline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ActionButton href={href}>{t.cta.primary}</ActionButton>
            <ActionButton href="#produk" variant="outline">
              {t.cta.secondary}
            </ActionButton>
          </div>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-border pt-6">
            <dl className="flex flex-wrap items-end gap-x-10 gap-y-6">
              {t.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="order-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-mono text-2xl tabular-nums text-metric md:text-3xl">
                    {stat.countUp ? <CountUp value={Number(stat.value)} /> : stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-3">
              {clients.map((client) => (
                <li key={client.name}>
                  {client.logo ? (
                    <span className="inline-flex items-center rounded-sm bg-surface-brand px-2.5 py-1.5">
                      <Image
                        src={client.logo}
                        alt={client.wordmark}
                        height={client.height ?? 20}
                        className="h-4 w-auto md:h-5"
                      />
                    </span>
                  ) : (
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {client.wordmark}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The object column. Fixed height rather than stretching to match the
            content column: the content column's height depends on how much
            copy renders, and a scene that grows and shrinks with word count
            would never be predictable to compose against. `hidden lg:block`
            keeps it out of the DOM's rendered box below `lg` even before
            `HeroScene`'s own JS gate would have kept it empty — belt and
            braces with the "no WebGL below 1024px" rule, not a duplicate of
            it. */}
        <div className="hidden lg:block">
          <HeroScene className="relative h-[380px] w-full overflow-hidden rounded-[1.5rem] border border-border/60 xl:h-[460px]" />
        </div>
      </div>

      {/* The billboard media is decorative, so what it shows exists as text.
          The Spline scene in the right column gets the same treatment below. */}
      <p className="sr-only">{t.hero.mediaDescription}</p>
      <p className="sr-only">{t.hero.sceneDescription}</p>
    </header>
  );
}
