import { LogoStream } from "@/components/motion/system-stream";
import { clients, copy } from "@/content/copy";
import type { Locale } from "@/content/i18n";

/**
 * The client proof, moved out of `about.tsx` and up to directly under the
 * billboard at the client's request. It is the page's first claim after the
 * headline, which is the right place for it: a skeptical ops director wants
 * to know who else trusted us before they read anything about how we work.
 *
 * ## The marks are in the corridor now
 *
 * The logos used to be a static wrapping row here and a second copy inside
 * the hero. Both are gone; the marks live in `LogoStream`, the corridor band
 * this section is built around. The hero's own row went with them — with this
 * section sitting immediately below the billboard, the same six marks twice
 * within one screen read as a duplicated block, not as emphasis.
 *
 * ## Why the names are still set in text
 *
 * The corridor is `aria-hidden` and its cards carry no alt text, so on its own
 * it would put the entire client list inside a decoration. `about.tsx` was
 * explicit about why that is not acceptable — a logo is an image, and the
 * proof has to survive an image that fails to load, a screen reader and a
 * crawler — so the names and sectors are set below the band as real text.
 *
 * That row is not a caption for the animation; it is the content, and the
 * animation is the presentation of it. If the corridor were deleted tomorrow
 * this section would still say everything it currently says.
 */
export function TrustedBy({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section
      aria-labelledby="clients-heading"
      className="scroll-mt-24 px-3 py-16 md:px-6 md:py-20"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-8">
        <h1
          id="clients-heading"
          className="font-mono font-bold uppercase tracking-[0.18em] text-white"
        >
          {t.clients.label}
        </h1>

        <LogoStream className="w-full" />

        {/* The crawlable half. Names and sectors only — no plates and no
            artwork, because the marks are already the corridor's job and
            repeating them as a static wall directly under a moving one is the
            duplication this section was meant to remove. */}
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {clients.map((client) => (
            <li key={client.name} className="flex flex-col items-center gap-1">
              <span className="font-heading text-[0.9375rem] font-medium leading-tight tracking-[-0.01em]">
                {client.wordmark}
              </span>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                {client.sector}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
