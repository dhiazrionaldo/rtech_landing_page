import { localeName, localeShort, locales, type Locale } from "@/content/i18n";
import { cn } from "@/lib/utils";

/**
 * Real links, not a client-side toggle: each locale is its own crawlable route
 * with its own hreflang entry, so the switcher has to navigate rather than
 * swap strings in place.
 *
 * Plain <a>, deliberately — NOT next/link. A client transition re-renders the
 * root layout, and React then writes `<html className>` back to exactly what the
 * server sent. That destroys every class the inline <head> script added
 * imperatively: `dark` and `js` both vanish. In practice that meant switching
 * language silently threw you back to light mode with `theme: "dark"` still in
 * localStorage, and killed every scroll reveal for the rest of the session.
 *
 * A full document navigation re-runs that script, which restores both classes
 * from storage before first paint. A locale switch changes `<html lang>` and
 * every string on the page, so it was never really a soft navigation anyway —
 * and both routes are statically prerendered, so the reload is cheap.
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
          <a
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
          </a>
        );
      })}
    </div>
  );
}
