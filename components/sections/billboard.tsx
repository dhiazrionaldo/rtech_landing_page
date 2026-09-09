import Image from "next/image";

import { CountUp } from "@/components/motion/count-up";
import { ActionButton } from "@/components/ui/action-button";
import { copy } from "@/content/copy";
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
 * ## Two-column hero
 *
 * Above `lg` the copy block sits in a grid beside a right track that used to
 * hold the Spline scene inline (Task 10e) and now holds an empty spacer. The
 * scene is `FixedScene`, mounted once in `app/[locale]/page.tsx` and pinned
 * to the viewport, because the client asked for the object to hold its
 * position through the whole scroll instead of leaving with the hero. The
 * track stays because it still does layout work: it is what stops the copy
 * column stretching to the full 1400px, and it reserves the space the fixed
 * layer parks over so the first screen composes as it always did.
 *
 * The poster stays the full-bleed background behind both columns, keeps
 * `priority`, and remains the LCP element regardless of whether the scene has
 * loaded — a hosted Spline scene must never become the largest contentful
 * paint on this page.
 *
 * ## Stacking
 *
 * `isolate` stays on this header, and is now unambiguously correct: the only
 * positioned descendant left inside it is `#billboard-frame` at `-z-20`. The
 * fixed scene is not a descendant of this header at all — it is a sibling
 * layer at `z-40` mounted at the page level — so nothing inside this header
 * needs to compare z-indexes with it, and `isolate` keeps `-z-20` from ever
 * leaking past this header's own boundary. That is the whole of it.
 */
export function Billboard({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? "#kontak" : t.cta.href;

  return (
    <header
      data-scene-zone=""
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

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-3 pb-10 pt-28 md:px-6 md:pb-14 lg:grid-cols-[minmax(0,1fr)_var(--scene-w)] lg:items-end lg:gap-[var(--scene-gap)]">
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

          {/* The client marks used to share this row, which is why it was a
              flex wrapper around the stats. They are in `TrustedBy` now, so
              the list is the row. */}
          <dl className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-border pt-6">
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
        </div>

        {/* The object column, an empty spacer. The scene itself is
            `FixedScene`, mounted once at page level and fixed to the viewport.
            This header is now the only `data-scene-zone` on the page, so the
            object is visible here and fades out as the hero leaves. The track
            stays in the grid regardless: it is what keeps the copy column from
            stretching to the full 1400px, and it reserves the space the fixed
            layer parks over, so nothing reflows when the scene mounts. */}
        <div aria-hidden="true" className="hidden h-[var(--scene-h)] lg:block" />
      </div>

      {/* The billboard media is decorative, so what it shows exists as text.
          The fixed Spline scene gets the same treatment below — it is
          `aria-hidden`, so this is the only place its content is described. */}
      <p className="sr-only">{t.hero.mediaDescription}</p>
      <p className="sr-only">{t.hero.sceneDescription}</p>
    </header>
  );
}
