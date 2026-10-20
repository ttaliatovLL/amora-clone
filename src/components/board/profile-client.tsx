"use client";

import { LockSimple } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Paywall } from "@/components/paywall";
import { Portrait } from "@/components/portrait";
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

/** Her photos as a strip of big frames. Private ones sit blurred behind one invitation, never a price list. */
export function Gallery({ c }: { c: Companion }) {
  const { premium } = useWallet();
  const [paywall, setPaywall] = useState(false);
  const open = [undefined, ...c.gallery];
  // Never a negative or zero "private photos" count: with nothing private, only the open frames show.
  const hidden = Math.max(0, c.photos - open.length);
  const locked = hidden ? LOCKED : [];
  const frame = "relative aspect-[4/5] w-[78vw] max-w-[26rem] shrink-0 snap-start overflow-hidden bg-ink-3 md:w-auto md:max-w-none";

  return (
    <>
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-[3px] overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {open.map((src, i) => (
          <li key={`open-${i}`} className={frame}>
            <Portrait companion={c} src={src} sizes="(max-width: 768px) 78vw, 25vw" />
          </li>
        ))}
        {locked.map((crop, i) => (
          <li key={crop} className={frame}>
            <Portrait companion={c} src={i % 2 ? c.gallery[0] : undefined} sizes="(max-width: 768px) 78vw, 25vw" className={cx(crop, !premium && "blur-[18px] brightness-110 saturate-125")} />
            {!premium &&
              (i === 0 ? (
                <div className="absolute inset-0 flex flex-col justify-end bg-ink/35 p-5">
                  <LockSimple weight="fill" className="size-6 text-paper" aria-hidden />
                  <p className="mt-3 text-lead text-paper">
                    {hidden.toLocaleString("en-US")} private {hidden === 1 ? "photo" : "photos"}
                  </p>
                  <p className="mt-1 text-body text-paper/80">She sends them as you get closer.</p>
                  <Button variant="paper" className="mt-4 self-start" onClick={() => setPaywall(true)}>
                    Unlock with Premium
                  </Button>
                </div>
              ) : (
                <span className="absolute inset-0 grid place-items-center bg-ink/20">
                  <LockSimple weight="fill" className="size-6 text-paper/90" aria-hidden />
                  <span className="sr-only">Private photo</span>
                </span>
              ))}
          </li>
        ))}
      </ul>
      <Paywall open={paywall} onClose={() => setPaywall(false)} reason={`Every photo ${c.name} sends, no locks, no counting.`} />
    </>
  );
}
