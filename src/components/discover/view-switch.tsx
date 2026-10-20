import Link from "next/link";
import { ViewTransition } from "react";
import { cx } from "@/components/ui";

const views = [
  { id: "board", href: "/app", label: "Board" },
  { id: "discover", href: "/app/discover", label: "Discover" },
] as const;

/** Board | Discover: two routes dressed as one segmented control. The paper block morphs across on navigation. */
export function ViewSwitch({ on, className }: { on: (typeof views)[number]["id"]; className?: string }) {
  return (
    <nav aria-label="View" className={cx("relative grid w-full max-w-[16rem] grid-cols-2 bg-ink-3 p-1", className)}>
      <ViewTransition name="view-switch" share="morph" default="none">
        <span aria-hidden className={cx("absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] bg-paper", on === "discover" && "translate-x-full")} />
      </ViewTransition>
      {views.map((v) => (
        <Link
          key={v.id}
          href={v.href}
          aria-current={v.id === on ? "page" : undefined}
          className={cx("relative flex h-10 items-center justify-center px-4 text-small transition-colors duration-200", v.id === on ? "font-medium text-ink" : "text-muted hover:text-paper")}
        >
          {v.label}
        </Link>
      ))}
    </nav>
  );
}
