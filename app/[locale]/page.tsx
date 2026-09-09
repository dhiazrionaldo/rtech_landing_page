import { notFound } from "next/navigation";

import { About } from "@/components/sections/about";
import { FixedScene } from "@/components/motion/fixed-scene";
import { Billboard } from "@/components/sections/billboard";
import { CapabilitiesRail } from "@/components/sections/capabilities-rail";
import { Contact } from "@/components/sections/contact";
import { IndustriesRail } from "@/components/sections/industries-rail";
import { Process } from "@/components/sections/process";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteNav } from "@/components/sections/site-nav";
import { TrustedBy } from "@/components/sections/trusted-by";
import { WorkRail } from "@/components/sections/work-rail";
import { isLocale } from "@/content/i18n";

/**
 * One route per locale, fully server-rendered. The only client components are
 * the media player, the theme toggle, and the hero's Spline scene, so every
 * word of copy — including all ten project names — is in the initial HTML for
 * crawlers and for LCP.
 *
 * `FixedScene` mounts once here as a viewport-fixed layer at `z-40` — above
 * the sections, below `SiteNav`'s `z-50` — so the Spline object holds its
 * position for the entire scroll rather than leaving with the hero, which is
 * what the client asked for. It replaces the inline hero-column mount from
 * Task 10e.
 *
 * This is a page-wide layer again, but not the one Task 10e removed. That
 * one (`Architecture`, Task 10b/10c) carried per-section pose props read on
 * scroll and forced every card, panel and header to be elevated above the
 * canvas with its own `z-30`. This one has no scroll choreography and no
 * stacking contract with anything: one fixed div, one z-index,
 * `pointer-events-none` so it never intercepts a click meant for the content
 * beneath it. Nothing else on the page changed to accommodate it.
 */
export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <FixedScene />
      <SiteNav locale={locale} />
      <Billboard locale={locale} />
      <main className="flex-1">
        {/* First thing after the headline: who already trusted us. */}
        <TrustedBy locale={locale} />
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
