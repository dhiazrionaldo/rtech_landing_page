import { Logo } from "@/components/brand/logo";
import { DarkPanel, Section } from "@/components/section";
import { ActionButton } from "@/components/ui/action-button";
import { Pill } from "@/components/ui/pill";
import { contact, copy } from "@/content/copy";
import { isPending } from "@/content/pending";
import type { Locale } from "@/content/i18n";

/**
 * The single conversion moment and the only filled `--primary` button below the
 * hero. Email and phone come from the deck's closing slide.
 *
 * ## Layout
 *
 * Three bands, in this order, at the client's request:
 *
 * 1. **Heading beside body.** The argument reads across, not down: the heading
 *    and the button on the left, the eighty-five-word paragraph on the right.
 *    Putting the paragraph next to the thing it explains is the whole point of
 *    the arrangement — it was previously stranded under a rule at the bottom,
 *    two bands away from its own heading.
 * 2. **Contact details**, full width along the foot. Three cells across rather
 *    than the stacked column they were in: at full width a vertical stack would
 *    be three short rows of text in a very wide box.
 * 3. **The mark.**
 *
 * The body is a single column here, not the two it used to be. It is beside the
 * heading now rather than spanning the panel, so its measure is already about
 * 52ch — splitting that again would give two 26ch columns, which is narrower
 * than a newspaper and reads as a stutter.
 *
 * The heading is left-aligned inside its column rather than centred. Centred
 * type in a two-column layout gives the panel two ragged inner edges and no
 * shared spine, which is the opposite of tidy.
 *
 * `CenteredHeader` in components/section.tsx is unused after this change. It is
 * left in place deliberately: it is the only centred header treatment in the
 * codebase and the next focused, single-moment section will want it.
 */
export function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = isPending(t.cta.href) ? undefined : t.cta.href;

  return (
    <Section id="kontak" headingId="contact-heading" fieldX={0} fieldZoom={2.3}>
      <DarkPanel className="md:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-start gap-6">
            <Pill>{t.contact.badge}</Pill>

            <h2
              id="contact-heading"
              className="max-w-[16ch] font-heading text-[clamp(1.875rem,3.6vw,3.125rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance"
            >
              {t.contact.heading}
            </h2>

            {/* The button sits with the heading, so the one action this section
                exists for is visible without reading the paragraph first. */}
            <div className="mt-2 flex flex-col items-start gap-4">
              <ActionButton href={href ?? `mailto:${contact.email}`}>
                {t.cta.primary}
              </ActionButton>

              {/* What the half hour is actually like. Someone weighing up
                  whether to give up thirty minutes is deciding against a mental
                  picture of a sales call, so the picture is worth correcting
                  before the form. It is a caption to the button, so it sits
                  with it. */}
              {/* <p className="max-w-[54ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t.contact.reassurance}
              </p> */}
            </div>
          </div>
              <p className="max-w-[90ch] text-base leading-[1.7] text-muted-foreground">
                {t.contact.reassurance}
              </p>
          {/* <p className="max-w-[90ch] text-base leading-[1.7] text-muted-foreground">
            {t.contact.body}
          </p> */}
        </div>

        {/* Along the foot, full width. Three cells share one hairline grid — the
            `gap-px` over a `bg-border` parent draws the dividers, so there are
            no per-cell borders to keep in sync. */}
        <dl className="mt-14 grid w-full gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-20 md:grid-cols-3">
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
          <div className="bg-background p-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.officesLabel}
            </dt>
            <dd className="mt-2 text-sm text-foreground">{contact.locality}</dd>
          </div>
        </dl>

        <Logo className="mt-12 h-6 w-auto text-muted-foreground" />
      </DarkPanel>
    </Section>
  );
}
