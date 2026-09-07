import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CountUp } from "@/components/motion/count-up";
import { ActionButton } from "@/components/ui/action-button";
import { Pill } from "@/components/ui/pill";
import { copy } from "@/content/copy";
import { isPending } from "@/content/pending";
import type { Locale } from "@/content/i18n";

/**
 * The hero, rebuilt against the Sony reference the client supplied.
 *
 * ## What this replaced
 *
 * The `ApertureVideo` compute unit is gone from the hero. Cutting it also
 * removes the fabricated "AURA-7 / AI PROCESSOR / 3.2T FLOPS" spec sheet, which
 * asserted an invented benchmark on a page whose argument is that we do not
 * inflate numbers. The component still exists and is still wired for the
 * product captures if it is ever wanted back.
 *
 * The node field and the brain field are gone too, deleted on 2026-09-07 —
 * CLAUDE.md bans particle fields standing in for a neural network and
 * wireframe brains by name. Nothing replaces them; see `MOTION.md`.
 *
 * ## Layering
 *
 * glow → scrim → content, all inside the card's `isolate`. The scrim is what
 * makes centred type legible over the card art; it is built from
 * `--background` rather than a hardcoded black so it survives a theme change.
 *
 * The standfirst stays in two columns above `lg`. Centred composition does not
 * change the fact that it is a seventy-word paragraph, and seventy words set
 * centred in one column is a wall whatever else the page is doing.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? undefined : t.cta.href;

  return (
    <header className="px-3 pt-3 md:px-6 md:pt-6">
      <div className="relative isolate flex min-h-[min(92svh,940px)] flex-col overflow-hidden rounded-[1.5rem] border border-border md:rounded-[2rem]">
        <div aria-hidden="true" className="media-glow absolute inset-0" />

        {/* Scrim. Densest at the centre, where the headline sits, and at the
            foot, where the stat rail does. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_52%_42%_at_center,var(--background)_5%,transparent_78%)] opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent"
        />

        <nav
          aria-label="Primary"
          className="relative z-10 flex items-center gap-3 p-4 md:p-6"
        >
          <a
            href={`/${locale}`}
            aria-label="RTECH Indonesia"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Logo className="h-6 w-auto md:h-7" />
          </a>

          <div className="mx-auto hidden items-center gap-1 rounded-full border border-border bg-card/60 p-1 lg:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher current={locale} />
            <ActionButton
              href={href ?? "#kontak"}
              className="hidden sm:inline-flex"
            >
              {t.cta.primary}
            </ActionButton>
          </div>
        </nav>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-4 py-12 text-center md:px-6">
          <Pill>{t.hero.badge}</Pill>

          <h1 className="max-w-[19ch] font-heading text-[clamp(2.25rem,5.6vw,4.5rem)] font-medium leading-[1.03] tracking-[-0.03em] text-balance">
            {t.hero.headline}
          </h1>

          <p className="max-w-[62ch] text-left text-base leading-[1.7] text-muted-foreground lg:max-w-[64rem] lg:columns-2 lg:gap-x-14">
            {t.hero.standfirst}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <ActionButton href={href ?? "#kontak"}>{t.cta.primary}</ActionButton>
            <ActionButton href="#keahlian" variant="outline">
              {t.cta.secondary}
            </ActionButton>
          </div>
        </div>

        {/* Foot rail. Stats left, the one named system right — the reference
            keeps its chrome pinned to the frame edges rather than stacked in
            the middle, and it is what stops a centred hero reading as a
            slide. */}
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-8 border-t border-border p-4 md:p-6">
          <dl className="flex flex-wrap items-end gap-x-10 gap-y-6">
            {t.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="order-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </dt>
                {/* tabular-nums matters here, not just for looks: without it a
                    counter running 1→2→3 changes the row's width every frame. */}
                <dd className="order-1 font-mono text-3xl tabular-nums text-metric">
                  {stat.countUp ? (
                    <CountUp value={Number(stat.value)} />
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <aside className="hidden max-w-xs text-left lg:block">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-metric">
              {t.hero.panelTitle}
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t.hero.panelBody}
            </p>
          </aside>
        </div>

        {/* The card art this describes is decorative and aria-hidden, so what
            it stands for has to exist as crawlable text. */}
        <p className="sr-only">{t.hero.mediaDescription}</p>
      </div>
    </header>
  );
}
