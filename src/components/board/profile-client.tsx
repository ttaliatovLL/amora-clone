"use client";

import { LockSimple } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Paywall } from "@/components/paywall";
import { Portrait } from "@/components/portrait";
import { Lightbox, type Shot } from "@/components/profile/lightbox";
import { Button, cx } from "@/components/ui";
import type { Companion } from "@/lib/companions";
import { track } from "@/lib/progress";
import { useWallet } from "@/lib/wallet";

/** Counts the profile view (achievements read it). */
export function TrackView({ id }: { id: string }) {
  useEffect(() => track.view(id), [id]);
  return null;
}

// shortcut: her portrait and one gallery shot, re-cropped per frame, until her real private gallery exists.
const LOCKED = ["scale-[1.35] origin-[30%_70%]", "scale-[1.5] origin-[70%_40%]"];

/**
 * Her photos as a tidy grid; tap one to see it full screen. Private ones are one invitation (opens Premium),
 * never a price list. Members see them as ordinary frames.
 */
export function Gallery({ c }: { c: Companion }) {
  const { premium } = useWallet();
  const [paywall, setPaywall] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  const open: Shot[] = [{}, ...c.gallery.map((src) => ({ src }))];
  // Never a negative or zero "private photos" count: with nothing private, only the open frames show.
  const hidden = Math.max(0, c.photos - open.length);
  const shots = premium && hidden ? [...open, ...LOCKED.map((crop, i) => ({ src: i % 2 ? c.gallery[0] : undefined, crop }))] : open;

  return (
    <>
      <ul className={cx("grid gap-2", premium || !hidden ? "grid-cols-2" : "grid-cols-2 min-[1400px]:grid-cols-3")}>
        {shots.map((s, i) => (
          <li key={i} className="relative aspect-[4/5] overflow-hidden bg-ink-3">
            <button
              type="button"
              onClick={() => setAt(i)}
              aria-label={`View photo ${i + 1} of ${c.name}`}
              className="press absolute inset-0 block overflow-hidden outline-offset-[-3px] active:scale-[0.98]"
            >
              <Portrait companion={c} src={s.src} sizes="(max-width: 1024px) 50vw, 20vw" // The re-cropped frames already carry a scale, so only plain frames zoom on hover.
                className={s.crop ?? "transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.03]"} />
            </button>
          </li>
        ))}
        {!premium && hidden > 0 && (
          <li className="relative col-span-2 aspect-[16/9] overflow-hidden bg-ink-3 min-[1400px]:col-span-1 min-[1400px]:aspect-[4/5]">
            <Portrait companion={c} src={c.gallery[0]} sizes="(max-width: 1024px) 100vw, 20vw" className={cx(LOCKED[1], "blur-[18px] brightness-110 saturate-125")} />
            <div className="absolute inset-0 flex flex-col justify-end bg-ink/40 p-4">
              <LockSimple weight="fill" className="size-5 text-paper" aria-hidden />
              <p className="mt-2 text-body font-medium text-paper tabular">
                {hidden.toLocaleString("en-US")} private {hidden === 1 ? "photo" : "photos"}
              </p>
              <p className="mt-0.5 text-small text-paper/80">She sends them as you get closer.</p>
              <Button variant="paper" size="sm" className="mt-3 self-start" onClick={() => setPaywall(true)}>
                Unlock with Premium
              </Button>
            </div>
          </li>
        )}
      </ul>
      <Lightbox c={c} shots={shots} at={at} onClose={() => setAt(null)} />
      <Paywall open={paywall} onClose={() => setPaywall(false)} reason={`Every photo ${c.name} sends, no locks, no counting.`} />
    </>
  );
}
