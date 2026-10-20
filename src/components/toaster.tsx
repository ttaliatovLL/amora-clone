"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type CSSProperties } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { AchievementIcon } from "@/components/achievement-icon";
import { achievements } from "@/lib/achievements";
import { EARNED_EVENT, NAVIGATE_EVENT, track } from "@/lib/progress";

/** One toaster for the whole site: square, ink-on-ink, top centre so it never covers the dock or the composer. */
export function Toaster() {
  const router = useRouter();
  useEffect(() => {
    const go = (e: Event) => router.push((e as CustomEvent<string>).detail);
    window.addEventListener(NAVIGATE_EVENT, go);
    track.visit();
    const onEarned = (e: Event) => {
      const a = achievements.find((x) => x.id === (e as CustomEvent<string>).detail);
      if (!a) return;
      toast.custom(
        () => (
          // The same kept-card look as the record: paper, a rouge tile, her icon stamped faint into the corner.
          <Link
            href="/app/me#record"
            className="press relative flex w-full items-center gap-3 overflow-hidden bg-paper p-2 pr-4 text-ink shadow-[var(--shadow-float)]"
          >
            <span className="relative grid size-11 shrink-0 place-items-center bg-rouge text-ink">
              <AchievementIcon name={a.icon} size={20} weight="fill" />
            </span>
            <span className="pointer-events-none absolute -top-5 -right-4 text-ink/[0.045]" aria-hidden>
              <AchievementIcon name={a.icon} size={96} weight="fill" />
            </span>
            <span className="relative min-w-0">
              <span className="block font-display text-[0.875rem] leading-tight [overflow-wrap:anywhere]">{a.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-small text-ink/70">Earned. {a.how}</span>
            </span>
          </Link>
        ),
        // The custom card brings its own surface: strip the default toast box so it isn't framed twice.
        { duration: 5000, classNames: { toast: "bg-transparent! p-0! shadow-none! [&>div]:w-full" } },
      );
    };
    window.addEventListener(EARNED_EVENT, onEarned);
    return () => {
      window.removeEventListener(EARNED_EVENT, onEarned);
      window.removeEventListener(NAVIGATE_EVENT, go);
    };
  }, [router]);

  return (
    <Sonner
      position="top-center"
      offset={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
      mobileOffset={{ top: "calc(env(safe-area-inset-top) + 10px)" }}
      gap={8}
      style={{ "--width": "min(380px, calc(100vw - 32px))" } as CSSProperties}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex min-h-12 w-full items-center gap-3 bg-ink-4 py-2 pr-2 pl-4 text-small font-medium text-paper shadow-[var(--shadow-float)] font-sans",
          title: "py-1",
          description: "text-small text-muted",
          actionButton: "press ml-auto inline-flex h-8 shrink-0 items-center bg-paper px-3 text-small font-medium text-ink hover:bg-white",
          cancelButton: "press ml-auto inline-flex h-8 shrink-0 items-center px-3 text-small text-muted hover:text-paper",
          icon: "text-rouge",
        },
      }}
    />
  );
}
