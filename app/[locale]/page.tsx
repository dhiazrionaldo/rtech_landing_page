import { notFound } from "next/navigation";

import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Expertise } from "@/components/sections/expertise";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Products } from "@/components/sections/products";
import { Team } from "@/components/sections/team";
import { SiteFooter } from "@/components/sections/site-footer";
import { isLocale } from "@/content/i18n";

/**
 * One route per locale, fully server-rendered. The only client components are
 * the media player and the theme toggle, so every word of copy — including all
 * ten project names — is in the initial HTML for crawlers and for LCP.
 */
export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <main className="flex-1">
        <About locale={locale} />
        {/* Directly under the mission and vision pair, which is where the
            client asked for it. */}
        {/* <Team locale={locale} /> */}
        <Expertise locale={locale} />
        <Products locale={locale} />
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
