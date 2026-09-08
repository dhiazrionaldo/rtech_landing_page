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
 * layer rather than inside any one section (Task 10b). It sits behind every
 * section at `-z-10` and eases left or right as each section declares its pose
 * with `data-object-x` — see `Section`, `Rail`, and the `data-object-x` on
 * `Billboard`'s own `<header>`. The wrapper is `aria-hidden`, so its sr-only
 * description is a sibling rather than a child: nested inside, it would be
 * hidden from assistive tech along with the canvas.
 */
export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
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
