"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * No state and no effect: both icons are always rendered and CSS decides which
 * one is visible. Nothing for the server and client to disagree about, so no
 * hydration mismatch and no flash — the inline script in the layout has already
 * set the class before first paint.
 *
 * The visibility rules key off `html.dark` rather than the `dark:` variant on
 * purpose. The hero wears a nested `.dark` class so the media band stays black
 * in both themes, and `dark:` matches any descendant of it — which would show
 * the wrong icon whenever the toggle sits inside that band. `html.dark` asks
 * the only question that matters: what theme is the page actually in?
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or storage disabled — the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground",
        "transition-colors hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <Sun className="size-4 [html.dark_&]:hidden" aria-hidden="true" />
      <Moon className="hidden size-4 [html.dark_&]:block" aria-hidden="true" />
    </button>
  );
}
