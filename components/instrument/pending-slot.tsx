import { isPending, type Fillable } from "@/content/pending";
import { cn } from "@/lib/utils";

/**
 * Renders real copy as-is, and anything still outstanding as a loud marker.
 *
 * Deliberately conspicuous: CLAUDE.md forbids shipping invented facts, so a
 * missing figure has to look missing rather than quietly reading as prose.
 */
export function PendingSlot({
  value,
  className,
}: {
  value: Fillable;
  className?: string;
}) {
  if (!isPending(value)) {
    return <>{value}</>;
  }

  return (
    <span
      data-pending
      className={cn(
        "inline-flex items-baseline gap-1.5 rounded-sm border border-dashed border-destructive/60",
        "bg-destructive/10 px-1.5 py-0.5 font-mono text-[0.75em] leading-normal text-destructive",
        className,
      )}
    >
      <span aria-hidden="true">↳</span>
      <span>needs: {value.need}</span>
    </span>
  );
}
