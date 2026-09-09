import type { MetadataRoute } from "next";

import { copy } from "@/content/copy";
import { defaultLocale, locales } from "@/content/i18n";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml. One entry per locale plus one per case study,
 * generated from `content/copy.ts` rather than listed by hand — the source
 * of truth for the slugs the site actually serves at /work/[slug].
 *
 * `alternates.languages` emits the xhtml:link hreflang pairs inside the
 * sitemap, so the language relationship is declared in two places that agree:
 * here and in `generateMetadata`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = locales.map((locale) => ({
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

  const work = locales.flatMap((locale) =>
    copy[locale].products.items.map((product) => ({
      url: absoluteUrl(`/${locale}/work/${product.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  );

  return [...pages, ...work];
}
