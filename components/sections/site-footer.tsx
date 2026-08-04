import { LanguageSwitcher } from "@/components/language-switcher";
import { PendingSlot } from "@/components/instrument/pending-slot";
import { contact, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-3 py-10 md:px-6">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[0.6875rem] text-muted-foreground">
          © {year} RTECH INDO. {t.footer.rights}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:ml-auto">
          {/* Street address is still outstanding and is required before the
              ProfessionalService schema can claim a physical location. */}
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            <PendingSlot value={contact.locality} />
          </span>
          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </footer>
  );
}
