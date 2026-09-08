import Image from "next/image";

import { CountUp } from "@/components/motion/count-up";
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
 * The architecture object no longer lives here — Task 10b made it a fixed
 * layer mounted once in `app/[locale]/page.tsx`, behind every section, that
 * eases left or right per section. `data-object-x="0.55"` below is this
 * section's vote in that choreography: right, same side the object used to
 * occupy when it lived inside this frame.
 *
 * That move meant `isolate` had to come off this header, and it still has to
 * stay off after Task 10c. `isolate` existed to keep `#billboard-frame`'s
 * negative z-index from leaking into the rest of the page — the right job
 * when the object was a child of this frame. Isolating this header now would
 * seal it into one atomic stacking unit, and that unit would be compared
 * against the object and the nav using nothing but the header's own
 * (non-existent) z-index — silently losing to `SiteNav`'s `z-50` in ways
 * unrelated to what is inside it, or winning against the object regardless of
 * the object's z, whichever way `auto` happens to resolve. Leaving it off
 * keeps every descendant's own z-index meaningful in the shared, page-root
 * stacking context.
 *
 * ## Z-layering (Task 10c)
 *
 * The architecture layer moved from `-z-10` (behind everything) to `z-20`
 * (in front of everything without its own z-index) — see the note in
 * `app/[locale]/page.tsx`. `#billboard-frame` stays at its explicit `-z-20`:
 * still behind the object either way, negative or not.
 *
 * The hero copy below (`mx-auto w-full max-w-[1400px] ...`) now carries an
 * explicit `relative z-30` for the same reason every other section's text
 * does: without it, the headline, subline, buttons and stat row have no
 * z-index of their own and would lose to the object's `z-20`. `z-30` sits
 * below `SiteNav`'s `z-50` with room to spare.
 *
 * CONSTRAINT for whoever edits this header next: nothing inside it may set
 * `isolation: isolate`, or anything else that would seal a descendant off
 * from this shared stacking context and make its z-index stop meaning what
 * it says (a `contain: layout`/`paint` on an ancestor of the copy block would
 * do the same thing `isolate` would, for the same reason). Today the only two
 * positioned things in here are `#billboard-frame` at `-z-20` and the copy
 * block at `z-30`, and nothing between the header and the page root
 * intercepts either. If a future change adds a third positioned descendant,
 * give it a z-index that is deliberate against this scale (`z-20` object /
 * `z-30` text / `z-50` nav) and re-verify by screenshot that the object is
 * still visible and the headline still crisp — don't assume the current
 * ordering still holds.
 */
export function Billboard({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? "#kontak" : t.cta.href;

  return (
    <header
      data-object-x="0.55"
      className="relative flex min-h-[min(94svh,960px)] flex-col justify-end overflow-hidden"
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

      <div className="relative z-30 mx-auto w-full max-w-[1400px] px-3 pb-10 pt-28 md:px-6 md:pb-14">
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

      {/* The billboard media is decorative, so what it shows exists as text.
          The architecture object's own sr-only description now lives with it
          at the page level — see app/[locale]/page.tsx. */}
      <p className="sr-only">{t.hero.mediaDescription}</p>
    </header>
  );
}
