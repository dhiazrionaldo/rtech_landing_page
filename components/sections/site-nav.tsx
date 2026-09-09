"use client";

import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ActionButton } from "@/components/ui/action-button";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";
import { isPending } from "@/content/pending";
import { cn } from "@/lib/utils";

/**
 * Sticky nav, transparent over the billboard and solid once you leave it.
 *
 * Netflix's exact behaviour, and it earns its keep here: the billboard is a
 * lit image and nav chrome over it would fight the title block, but once the
 * page is a list of rows the nav needs a ground to sit on.
 *
 * State is a boolean toggled by a scroll listener rather than a scrubbed
 * animation. It only ever changes two colours, so GSAP would be overkill and
 * would put a ScrollTrigger above the fold, which MOTION.md forbids.
 */
export function SiteNav({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? "#kontak" : t.cta.href;
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "border-b border-border bg-background" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4 px-3 py-3 md:px-6 md:py-4">
        <a
          href={`/${locale}`}
          aria-label="RTECH Indonesia"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Logo className="h-6 w-auto md:h-7" />
        </a>

        <div className="ml-8 hidden items-center gap-1 lg:flex">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <ActionButton href={href} className="hidden sm:inline-flex">
            {t.cta.primary}
          </ActionButton>
        </div>
      </div>
    </nav>
  );
}
