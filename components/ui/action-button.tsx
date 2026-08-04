import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The reference layout's signature call to action: a pill with an inset
 * circular icon that shifts on hover.
 *
 * The reference renders this in acid green. CLAUDE.md bans near-black plus a
 * single acid-green accent by name, and lime is the reference brand's colour
 * rather than ours, so the fill is `--primary` (burnt orange). That keeps the
 * one scarce warm accent doing exactly one job: the action.
 */
export function ActionButton({
  href,
  children,
  variant = "primary",
  disabled,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  disabled?: boolean;
  className?: string;
}) {
  const shell = cn(
    "group inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-medium",
    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border text-foreground hover:bg-card",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-200",
          "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          variant === "primary"
            ? "bg-primary-foreground text-primary"
            : "bg-foreground text-background",
        )}
      >
        <ArrowUpRight className="size-4" />
      </span>
    </>
  );

  if (!href || disabled) {
    return (
      <span className={shell} aria-disabled={disabled ? "true" : undefined}>
        {inner}
      </span>
    );
  }

  return (
    <a href={href} className={shell}>
      {inner}
    </a>
  );
}
