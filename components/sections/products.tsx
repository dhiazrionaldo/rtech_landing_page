import { ProductCapture } from "@/components/media/product-capture";
import { Section, SectionHeader } from "@/components/section";
import { copy, productCaptures } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Named systems from the deck: Integrated HSSE System, OPTIGAIN, and the
 * Pertamina Fire Truck Simulator.
 *
 * Each card now leads with footage of that system. That is the proof this
 * section was missing — for a skeptical ops director, seeing the software move
 * argues better than the blurb underneath it. Click-to-play; see ProductCapture
 * for why nothing autoplays.
 *
 * The blurbs stay, and carry the full claim on their own. Video is not
 * crawlable and a viewer may have media blocked, so nothing the footage shows
 * is asserted only by the footage.
 */
export function Products({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Section id="produk" headingId="products-heading">
      <SectionHeader
        badge={t.products.badge}
        heading={t.products.heading}
        headingId="products-heading"
        body={t.products.body}
      />

      <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {t.products.items.map((product) => {
          const capture = productCaptures[product.id];

          return (
            <li
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-colors hover:bg-card"
            >
              {capture ? (
                <ProductCapture
                  src={capture.src}
                  poster={capture.poster}
                  seconds={capture.seconds}
                  name={product.name}
                  kindLabel={t.products.captureKinds[capture.kind]}
                  playLabel={t.products.playLabel}
                  className="border-b border-border"
                />
              ) : null}

              <div className="flex flex-1 flex-col gap-5 p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-lg font-medium tracking-[-0.01em] md:text-xl">
                    {product.name}
                  </h3>
                  {product.client ? (
                    <span className="shrink-0 rounded-full border border-border px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-metric">
                      {product.client}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.blurb}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
