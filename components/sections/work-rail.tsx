import { Rail } from "@/components/rail/rail";
import { RailCard } from "@/components/rail/rail-card";
import { copy, productCaptures } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Six systems running in production. The page's strongest argument, so it is
 * the rail directly under the billboard and the one the billboard docks into.
 *
 * The metadata strip is built here rather than in the card so the separator and
 * the status vocabulary stay in one place and stay localised.
 *
 * `RailCard` wraps the poster, the metadata strip and the title in one <a>, so
 * the anchor's accessible name is the image `alt` plus that visible text
 * concatenated. An `alt` built from the product name and blurb would say the
 * name twice (once from `alt`, once from the `<h3>`) and inject the whole
 * blurb, out of visual order, between the meta strip and the title. The poster
 * is decorative relative to that text — it does not carry information the
 * meta strip and title don't already state — so `alt=""` keeps the announced
 * name to what's actually useful: "PERTAMINA · OIL AND GAS · IN PRODUCTION ·
 * 2024, Integrated HSSE". The blurb itself still reaches everyone: it renders
 * as `children`, outside the anchor, so it's on the page and in the DOM
 * regardless of how the link announces.
 */
export function WorkRail({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Rail
      id="produk"
      title={t.rails.work}
      titleId="work-heading"
      labels={{ prev: t.rails.prev, next: t.rails.next }}
      objectX={0.55}
    >
      {t.products.items.map((product) => {
        const capture = productCaptures[product.id];
        const meta = [
          product.client,
          product.sector,
          product.status === "in-production"
            ? t.rails.inProduction
            : t.rails.delivered,
          String(product.year),
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <RailCard
            key={product.id}
            href={`/${locale}/work/${product.slug}`}
            poster={capture.poster}
            alt=""
            meta={meta}
            title={product.name}
          >
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.blurb}
            </p>
          </RailCard>
        );
      })}
    </Rail>
  );
}
