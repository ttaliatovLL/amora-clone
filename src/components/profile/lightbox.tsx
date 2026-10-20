"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/portrait";
import type { Companion } from "@/lib/companions";

export type Shot = { src?: string; crop?: string };

/**
 * Her photos full screen. A native modal dialog (focus trap, Escape, focus return come free); slides are a
 * scroll-snap track, so a swipe on a phone is the platform's own. Arrow keys and buttons step on desktop.
 */
export function Lightbox({ c, shots, at, onClose }: { c: Companion; shots: Shot[]; at: number | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const d = dialog.current;
    if (at === null || !d) return;
    d.showModal();
    // Land on the tapped photo without a scroll animation.
    track.current?.scrollTo({ left: at * track.current.clientWidth, behavior: "instant" });
    setI(at);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      if (d.open) d.close();
    };
  }, [at]);

  const go = (to: number) => {
    const t = track.current;
    if (!t) return;
    t.scrollTo({ left: Math.max(0, Math.min(shots.length - 1, to)) * t.clientWidth, behavior: "smooth" });
  };

  return (
    <dialog
      ref={dialog}
      aria-label={`Photos of ${c.name}`}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper opacity-0 transition-[opacity,display,overlay] duration-200 ease-[var(--ease-out)] transition-discrete backdrop:bg-transparent open:opacity-100 starting:open:opacity-0"
    >
      <ul
        ref={track}
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        // A tap on the dark around the photo closes, like any photo viewer.
        onClick={(e) => (e.target as HTMLElement).dataset.slide && dialog.current?.close()}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((s, n) => (
          <li key={n} data-slide={n} className="grid w-full shrink-0 snap-center place-items-center px-4 py-16">
            <div className="relative aspect-[4/5] w-full max-w-[min(100%,calc((100dvh-8rem)*0.8))] overflow-hidden bg-ink-2">
              <Portrait companion={c} src={s.src} sizes="(max-width: 768px) 100vw, 60vw" className={s.crop} />
            </div>
          </li>
        ))}
      </ul>

      <p className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 flex h-11 items-center text-body text-paper/80 tabular" aria-live="polite">
        {i + 1} of {shots.length}
      </p>
      <button
        type="button"
        onClick={() => dialog.current?.close()}
        aria-label="Close photos"
        autoFocus
        className="press absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-11 place-items-center bg-ink-3 text-paper hover:bg-ink-4"
      >
        <X weight="bold" className="size-[1.125rem]" aria-hidden />
      </button>
      {shots.length > 1 && (
        <div className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] flex justify-center gap-2 [@media(pointer:coarse)]:hidden">
          {(
            [
              ["Previous photo", -1, CaretLeft],
              ["Next photo", 1, CaretRight],
            ] as const
          ).map(([label, step, Icon]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={step < 0 ? i === 0 : i === shots.length - 1}
              onClick={() => go(i + step)}
              className="press grid size-11 place-items-center bg-ink-3 text-paper hover:bg-ink-4 disabled:opacity-30"
            >
              <Icon weight="bold" className="size-[1.125rem]" aria-hidden />
            </button>
          ))}
        </div>
      )}
    </dialog>
  );
}
