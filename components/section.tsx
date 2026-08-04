import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

/**
 * Section shell. The reference centres a pill label above a large sentence-case
 * heading, with generous vertical air and no background change between
 * sections — the page stays one continuous surface and structure comes from
 * spacing and hairlines.
 */
export function Section({
  id,
  headingId,
  children,
  className,
}: {
  id?: string;
  headingId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 px-3 py-16 md:px-6 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}

export function SectionHeader({
  badge,
  heading,
  headingId,
  body,
  align = "center",
  className,
}: {
  badge: string;
  heading: string;
  headingId: string;
  body?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Pill>{badge}</Pill>
      <h2
        id={headingId}
        className={cn(
          "font-heading text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-balance",
          align === "center" ? "max-w-[20ch]" : "max-w-[22ch]",
        )}
      >
        {heading}
      </h2>
      {body ? (
        <p
          className={cn(
            "max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted-foreground",
            align === "center" && "text-balance",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
