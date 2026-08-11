import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { CenteredHeader, DarkPanel, Section } from "@/components/section";
import { Card } from "@/components/ui/card";
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
      <DarkPanel className="md:py-24">
        <div className="flex flex-col items-center">
          <CenteredHeader
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

          {/* What the half hour is actually like. Someone weighing up whether to
              give up thirty minutes is deciding against a mental picture of a
              sales call, so the picture is worth correcting before the form. */}
          <Reveal
            as="ul"
            stagger={0.08}
            y={14}
            className="mt-12 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-3"
          >
            {t.contact.reassurance.map((line) => (
              <Card
                key={line}
                as="li"
                className="flex gap-3 p-5 text-[0.8125rem] leading-relaxed text-muted-foreground md:p-6"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-px w-3 shrink-0 bg-metric"
                />
                <span>{line}</span>
              </Card>
            ))}
          </Reveal>

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
      </DarkPanel>
    </Section>
  );
}
