import { cn } from "@/lib/utils";

/**
 * The small rounded label the reference layout uses to introduce every section.
 * Carries no colour of its own — it reads as a chip cut out of the surface,
 * which is what keeps it from looking like a coloured "tag" component.
 */
export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/70 px-3.5 py-1.5",
        "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
