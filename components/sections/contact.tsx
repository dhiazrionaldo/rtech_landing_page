import { Logo } from "@/components/brand/logo";
import { Section, SectionHeader } from "@/components/section";
import { ActionButton } from "@/components/ui/action-button";
import { contact, copy } from "@/content/copy";
import { isPending } from "@/content/pending";
import type { Locale } from "@/content/i18n";

/**
 * The single conversion moment and the only filled `--primary` button below the
 * hero. Email and phone come from the deck's closing slide.
 */
export function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? undefined : t.cta.href;

  return (
    <Section id="kontak" headingId="contact-heading">
      <div className="dark relative overflow-hidden rounded-[1.5rem] border border-border bg-background px-6 py-16 text-foreground md:rounded-[2rem] md:px-12 md:py-24">
        <div aria-hidden="true" className="media-glow absolute inset-0" />

        <div className="relative flex flex-col items-center">
          <SectionHeader
            badge={t.contact.badge}
            heading={t.contact.heading}
            headingId="contact-heading"
            body={t.contact.body}
          />

          <div className="mt-10">
            <ActionButton href={href ?? `mailto:${contact.email}`}>
              {t.cta.primary}
            </ActionButton>
          </div>

          <dl className="mt-14 grid w-full max-w-lg gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            <div className="bg-background p-6">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {t.contact.emailLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all text-sm text-foreground transition-colors hover:text-metric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="bg-background p-6">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {t.contact.phoneLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="text-sm text-foreground transition-colors hover:text-metric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
          </dl>

          <Logo className="mt-16 h-6 w-auto text-muted-foreground" />
        </div>
      </div>
    </Section>
  );
}
