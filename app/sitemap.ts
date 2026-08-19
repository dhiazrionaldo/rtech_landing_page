import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/content/i18n";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml. One entry per locale — there are no other routes yet.
 * When case studies land at /work/[slug], map them in here from
 * `content/case-studies.ts` rather than listing them by hand.
 *
 * `alternates.languages` emits the xhtml:link hreflang pairs inside the
 * sitemap, so the language relationship is declared in two places that agree:
 * here and in `generateMetadata`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === defaultLocale ? 1 : 0.8,
    alternates: {
      languages: {
        en: absoluteUrl("/en"),
        "id-ID": absoluteUrl("/id"),
      },
    },
  }));
}
