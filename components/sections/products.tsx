import { PendingSlot } from "@/components/instrument/pending-slot";
import { Section, SectionHeader } from "@/components/section";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Named systems from the deck: Integrated HSSE System, OPTIGAIN, and the
 * Pertamina Fire Truck Simulator.
 *
 * The reference fills each card with a photo thumbnail. We have no real
 * screenshots of these products, and a stock image standing in for a client
 * system would be a fabrication, so the cards carry type only and the missing
 * asset is recorded as an outstanding request instead.
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
        {t.products.items.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-card/60 p-7 transition-colors hover:bg-card md:p-8"
          >
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
          </li>
        ))}
      </ul>

      <p className="mt-8 flex justify-center">
        <PendingSlot value={t.products.note} />
      </p>
    </Section>
  );
}
