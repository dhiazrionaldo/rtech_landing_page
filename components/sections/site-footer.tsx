import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { contact, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * A footer with the same information a business card carries, because that is
 * what a footer is for and because a one-line copyright strip was the last
 * place on the page still reading as a scaffold.
 *
 * The street address is real and comes from the deck, so it appears here as
 * well as in the ProfessionalService JSON-LD — a NAP block a crawler can match
 * against the structured data is worth more than either alone.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-3 pb-10 pt-16 md:px-6 md:pt-20">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-4">
            {/* self-start, or the flex column stretches the SVG to the column
                width and preserveAspectRatio centres the mark inside it. */}
            <Logo className="h-7 w-auto self-start" />
            <p className="max-w-[30ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t.hero.badge}
            </p>
          </div>

          <nav
            aria-label={t.footer.navLabel}
            className="flex flex-col gap-4 md:col-span-3 lg:col-span-2"
          >
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.navLabel}
            </p>
            <ul className="flex flex-col gap-2.5">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 md:col-span-3">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.contactLabel}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="break-all text-sm text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phoneE164}`}
              className="text-sm text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {contact.phone}
            </a>
          </div>

          <address className="flex flex-col gap-4 not-italic md:col-span-2 lg:col-span-3">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.officesLabel}
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {contact.locality}
            </p>
            <p className="max-w-[28ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
              {contact.address}
            </p>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.6875rem] text-muted-foreground">
            © {year} RTECH INDO. {t.footer.rights}
          </p>
          <div className="sm:ml-auto">
            <LanguageSwitcher current={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
