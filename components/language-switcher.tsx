import Link from "next/link";

import { localeName, localeShort, locales, type Locale } from "@/content/i18n";
import { cn } from "@/lib/utils";

/**
 * Real links, not a client-side toggle: each locale is its own crawlable route
 * with its own hreflang entry, so the switcher has to navigate rather than
 * swap strings in place.
 */
export function LanguageSwitcher({
  current,
  className,
}: {
  current: Locale;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border p-0.5",
        className,
      )}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}`}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            aria-label={localeName[locale]}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.12em] transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {localeShort[locale]}
          </Link>
        );
      })}
    </div>
  );
}
