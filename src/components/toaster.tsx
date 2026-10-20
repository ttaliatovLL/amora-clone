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
            className="press relative flex w-full items-center gap-4 overflow-hidden bg-paper p-3 pr-4 text-ink shadow-[var(--shadow-float)]"
          >
            <span className="relative grid size-12 shrink-0 place-items-center bg-rouge text-ink">
              <AchievementIcon name={a.icon} size={22} weight="fill" />
            </span>
            <span className="pointer-events-none absolute -top-5 -right-4 text-ink/[0.045]" aria-hidden>
              <AchievementIcon name={a.icon} size={96} weight="fill" />
            </span>
            <span className="relative min-w-0">
              <span className="block font-display text-[15px] leading-tight [overflow-wrap:anywhere]">{a.title}</span>
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
            "flex w-full items-center gap-3 bg-ink-4 px-4 py-3.5 text-body text-paper shadow-[var(--shadow-float)] font-sans",
          title: "font-medium",
          description: "text-small text-muted",
          actionButton: "press ml-auto shrink-0 bg-paper px-3 py-1.5 text-small font-medium text-ink",
          cancelButton: "press ml-auto shrink-0 px-3 py-1.5 text-small text-muted",
          icon: "text-rouge",
        },
      }}
    />
  );
}
