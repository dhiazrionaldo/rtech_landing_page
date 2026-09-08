import { notFound } from "next/navigation";

import { Architecture } from "@/components/motion/architecture";
import { About } from "@/components/sections/about";
import { Billboard } from "@/components/sections/billboard";
import { CapabilitiesRail } from "@/components/sections/capabilities-rail";
import { Contact } from "@/components/sections/contact";
import { IndustriesRail } from "@/components/sections/industries-rail";
import { Process } from "@/components/sections/process";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteNav } from "@/components/sections/site-nav";
import { WorkRail } from "@/components/sections/work-rail";
import { copy } from "@/content/copy";
import { isLocale } from "@/content/i18n";

/**
 * One route per locale, fully server-rendered. The only client components are
 * the media player and the theme toggle, so every word of copy — including all
 * ten project names — is in the initial HTML for crawlers and for LCP.
 *
 * `Architecture` mounts once here, before `<SiteNav>`, as a fixed full-viewport
 * layer rather than inside any one section (Task 10b), and eases left or right
 * as each section declares its pose with `data-object-x` — see `Section`,
 * `Rail`, and the `data-object-x` on `Billboard`'s own `<header>`. The wrapper
 * is `aria-hidden`, so its sr-only description is a sibling rather than a
 * child: nested inside, it would be hidden from assistive tech along with the
 * canvas.
 *
 * ## Z-layering (Task 10c)
 *
 * The client saw this object twice at `-z-10` (behind everything) and called
 * it "not clearly shown". Task 10c moves it to `z-20`: positive, so it paints
 * above any normal-flow content (the billboard poster, `DarkPanel`, every
 * card) that does not carry its own z-index, but well clear of `SiteNav`'s
 * `fixed z-50`, which must always win. `z-21..49` is deliberately left empty —
 * headroom for the chat dock a later task adds, which also needs to sit above
 * this layer and below the nav.
 *
 * Raising the canvas would bury every word on the page behind it if nothing
 * else changed — normal-flow text has no z-index of its own, so it would lose
 * to any positioned element with one. The other half of this change is
 * therefore everywhere text now carries an explicit `z-30`: this hero's own
 * copy block in `Billboard`, `SectionHeader`, `DarkPanel`'s content wrapper
 * (its background stays unelevated, so the object still paints over the
 * panel itself), every card (`Card`, the three rail card shapes), and each
 * rail's title row. Backgrounds and imagery (`#billboard-frame`, `DarkPanel`'s
 * own surface, a card's own fill) are deliberately left unelevated — that is
 * what lets the object paint in front of them rather than being hidden behind
 * an opaque box. See the Task 10c report for the full list of touch points
 * and why a DOM z-index split does this more reliably here than a mask would:
 * the canvas is transparent everywhere it draws nothing, so the only pixels
 * this ever affects are the wireframe, the plates, and the pulses.
 */
export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20"
      >
        <Architecture locale={locale} />
      </div>
      <p className="sr-only">{t.hero.architectureDescription}</p>

      <SiteNav locale={locale} />
      <Billboard locale={locale} />
      <main className="flex-1">
        <CapabilitiesRail locale={locale} />
        <WorkRail locale={locale} />
        <IndustriesRail locale={locale} />
        <About locale={locale} />
        {/* Last before the CTA on purpose: the process section ends on "you can
            stop at any boundary and keep what we built", which is the sentence
            that makes booking a call cheap. */}
        <Process locale={locale} />
        <Contact locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
