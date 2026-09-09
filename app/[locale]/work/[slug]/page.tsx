import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ActionButton } from "@/components/ui/action-button";
import { copy, productCaptures } from "@/content/copy";
import { isLocale, locales, type Locale } from "@/content/i18n";
import { isPending } from "@/content/pending";
import { absoluteUrl } from "@/lib/site";

function findProduct(locale: Locale, slug: string) {
  return copy[locale].products.items.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    copy[locale].products.items.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = findProduct(locale, slug);
  if (!product) return {};

  const title = `${product.name} — RTECH INDO`;

  return {
    title: product.name,
    description: product.blurb,
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: {
        en: `/en/work/${slug}`,
        "id-ID": `/id/work/${slug}`,
        "x-default": `/en/work/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description: product.blurb,
      url: `/${locale}/work/${slug}`,
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description: product.blurb },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];
  const product = findProduct(locale, slug);
  if (!product) notFound();

  const capture = productCaptures[product.id];
  const href = isPending(t.cta.href) ? `/${locale}#kontak` : t.cta.href;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: product.name,
    description: product.blurb,
    dateCreated: String(product.year),
    url: absoluteUrl(`/${locale}/work/${slug}`),
    creator: { "@type": "Organization", name: "RTECH INDO" },
    ...(product.client ? { sourceOrganization: { "@type": "Organization", name: product.client } } : {}),
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-3 py-28 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
        <a href={`/${locale}`} className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          RTECH INDO
        </a>
        <span aria-hidden="true"> · </span>
        <a href={`/${locale}#produk`} className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {t.rails.work}
        </a>
      </nav>

      <p className="mt-8 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
        {[product.client, product.sector, product.status === "in-production" ? t.rails.inProduction : t.rails.delivered, String(product.year)]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <h1 className="mt-3 max-w-[18ch] font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
        {product.name}
      </h1>

      <p className="mt-6 max-w-[62ch] text-base leading-[1.7] text-muted-foreground">
        {product.blurb}
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {product.stack.map((item) => (
          <li key={item} className="rounded-full border border-border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>

      {capture ? (
        <div className="relative mt-14 aspect-video overflow-hidden rounded-2xl border border-border">
          <Image src={capture.poster} alt={`${product.name} interface`} fill sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover" />
        </div>
      ) : null}

      <div className="mt-14 border-t border-border pt-10">
        <ActionButton href={href}>{t.cta.primary}</ActionButton>
      </div>
    </main>
  );
}
