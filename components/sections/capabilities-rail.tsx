import { Bot, Boxes, Cpu, LayoutGrid, Workflow, type LucideIcon } from "lucide-react";

import { Rail } from "@/components/rail/rail";
import { RAIL_CARD_WIDTH } from "@/components/rail/rail-card";
import { capabilities, type CapabilityIconId } from "@/content/capabilities";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * Icon ids resolve to components here, not in `content/capabilities.ts`.
 *
 * That module is imported by `node --test` and by the chat route's grounding
 * builder, and neither has any use for an icon set. Keeping the mapping in the
 * component layer is what lets the data module stay pure.
 */
const ICONS: Record<CapabilityIconId, LucideIcon> = {
  bot: Bot,
  "layout-grid": LayoutGrid,
  workflow: Workflow,
  boxes: Boxes,
  cpu: Cpu,
};

/**
 * The five service lines.
 *
 * No poster, because there is no honest image of "ERP integration" that is not
 * stock. These cards are typographic: an icon, the claim, the substance. They
 * share the rail's card width so the three rails read as one system.
 */
export function CapabilitiesRail({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <Rail
      id="keahlian"
      title={t.rails.capabilities}
      titleId="capabilities-heading"
      labels={{ prev: t.rails.prev, next: t.rails.next }}
      objectX={-0.55}
    >
      {capabilities[locale].map(({ id, name, line, body, icon }) => {
        const Icon = ICONS[icon];
        return (
        <li
          key={id}
          className={`flex shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-6 ${RAIL_CARD_WIDTH}`}
        >
          <Icon aria-hidden="true" className="size-5 text-metric" />
          <h3 className="mt-5 font-heading text-lg font-semibold tracking-[-0.01em]">
            {name}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-snug text-foreground">{line}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </li>
        );
      })}
    </Rail>
  );
}
