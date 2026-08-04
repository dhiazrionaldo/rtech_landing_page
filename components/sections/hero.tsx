import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ApertureVideo } from "@/components/media/aperture-video";
import { ThemeToggle } from "@/components/theme-toggle";
import { ActionButton } from "@/components/ui/action-button";
import { Pill } from "@/components/ui/pill";
import { copy } from "@/content/copy";
import { isPending } from "@/content/pending";
import type { Locale } from "@/content/i18n";

/**
 * The hero is an inset rounded media card rather than a full-bleed band, which
 * is the reference layout's defining move: the page frames the media instead of
 * being interrupted by it.
 *
 * The card carries `dark` so it stays black in both themes — there is no
 * light-graded cut of the footage — and `isolate` so the media's screen
 * blending composites against the card and its glow, not the whole page.
 *
 * Media sits in its own column on large screens and above the copy on small
 * ones, so text is never overlaid on the brightest part of the frame.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? undefined : t.cta.href;

  return (
    <header className="px-3 pt-3 md:px-6 md:pt-6">
      {/* The hairline is what makes the rounded card read in dark mode, where
          the page and the card are both pure black and the shape would
          otherwise disappear into a full-bleed band. */}
      <div className="dark relative isolate flex min-h-[min(92svh,940px)] flex-col overflow-hidden rounded-[1.5rem] border border-border bg-background text-foreground md:rounded-[2rem]">
        <div aria-hidden="true" className="media-glow absolute inset-0" />

        {/* Media. Own column on lg so the copy always sits on clean black. */}
        <div className="pointer-events-none absolute inset-x-0 top-16 h-[38%] md:top-20 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[56%]">
          <ApertureVideo className="absolute inset-0" />
        </div>

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
            <ThemeToggle />
            <ActionButton
              href={href ?? "#kontak"}
              className="hidden sm:inline-flex"
            >
              {t.cta.primary}
            </ActionButton>
          </div>
        </nav>

        <div className="relative z-10 mt-auto flex flex-col gap-10 p-4 pt-[38svh] md:p-6 lg:max-w-[52%] lg:pt-6">
          <div className="flex flex-col items-start gap-6">
            <Pill>{t.hero.badge}</Pill>
            <h1 className="font-heading text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.04] tracking-[-0.025em] text-balance">
              {t.hero.headline}
            </h1>
            <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t.hero.standfirst}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton href={href ?? "#kontak"}>{t.cta.primary}</ActionButton>
              <ActionButton href="#keahlian" variant="outline">
                {t.cta.secondary}
              </ActionButton>
            </div>
          </div>

          {/* Stat row. Every figure here is countable from the deck — founding
              year, sector count, listed projects. Nothing is estimated. */}
          <dl className="flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-border pt-6">
            {t.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="order-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="order-1 font-mono text-3xl tabular-nums text-metric">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Solid panel, not frosted glass — CLAUDE.md bans glassmorphism over
            blurred imagery, and a real surface reads sharper anyway. */}
        <aside className="relative z-10 m-4 hidden max-w-xs rounded-2xl border border-border bg-card/95 p-5 md:m-6 lg:absolute lg:bottom-6 lg:right-6 lg:block">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-metric">
            {t.hero.panelTitle}
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {t.hero.panelBody}
          </p>
        </aside>

        {/* The video is decorative and aria-hidden, so what it shows must exist
            as crawlable text. */}
        <p className="sr-only">{t.hero.mediaDescription}</p>
      </div>
    </header>
  );
}
