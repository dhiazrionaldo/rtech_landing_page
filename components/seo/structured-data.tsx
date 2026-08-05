import { clients, contact, seo } from "@/content/copy";
import type { Locale } from "@/content/i18n";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * Organization + ProfessionalService JSON-LD.
 *
 * Every field below is sourced from `content/copy.ts`, which in turn comes from
 * the company profile deck. CLAUDE.md forbids inventing NAP data, so anything
 * the deck does not state — postal code, opening hours, number of employees,
 * social profiles (`sameAs`), aggregate ratings — is omitted rather than
 * guessed. An absent field costs nothing; a wrong one is a trust problem and,
 * for reviews or ratings, a manual-action risk.
 *
 * Deliberately NOT emitted yet:
 *   - `FAQPage`  — the page has no visible FAQ. Google requires structured data
 *                  to match on-page content; FAQ markup without a rendered FAQ
 *                  is a guidelines violation.
 *   - `Person`   — no team member is named anywhere in the deck.
 *   - `CreativeWork` per case study — waiting on /work/[slug].
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function StructuredData({ locale }: { locale: Locale }) {
  const meta = seo[locale];

  const graph = [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORGANIZATION_ID,
      name: "RTECH INDO",
      url: absoluteUrl(`/${locale}`),
      description: meta.description,
      // The deck states "sejak 2018" — a countable fact, not an estimate.
      foundingDate: "2018",
      email: contact.email,
      telephone: contact.phoneE164,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
      image: absoluteUrl("/logo.svg"),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Perumahan Rakyat No.11, Sei. Buah, Ilir Timur II",
        addressLocality: "Palembang",
        addressRegion: "Sumatera Selatan",
        addressCountry: "ID",
      },
      // Where the work happens, which is broader than the registered address.
      areaServed: [
        { "@type": "Country", name: "Indonesia" },
        { "@type": "City", name: "Jakarta" },
        { "@type": "City", name: "Palembang" },
        { "@type": "City", name: "Bekasi" },
      ],
      knowsAbout: [
        "HSSE digitalisation",
        "Operational command centre",
        "ERP integration",
        "Warehouse management systems",
        "Predictive maintenance",
        "Applied AI for industrial operations",
      ],
      knowsLanguage: ["id-ID", "en"],
      brand: {
        "@type": "Brand",
        name: "RTECH INDO",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: contact.email,
        telephone: contact.phoneE164,
        areaServed: "ID",
        availableLanguage: ["id-ID", "en"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "RTECH INDO",
      description: meta.description,
      inLanguage: locale === "id" ? "id-ID" : "en",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(`/${locale}`)}#webpage`,
      url: absoluteUrl(`/${locale}`),
      name: meta.title,
      description: meta.description,
      inLanguage: locale === "id" ? "id-ID" : "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORGANIZATION_ID },
      // Sectors the page actually names, in the page's own words.
      mentions: clients.map((client) => ({
        "@type": "Organization",
        name: client.name,
      })),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // Serialised with JSON.stringify, so the content is escaped data rather
      // than markup. `<` is replaced to close off the </script> break-out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
