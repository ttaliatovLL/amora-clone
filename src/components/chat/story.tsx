"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "@phosphor-icons/react";
import { useMinute } from "@/components/chat/presence";
import { Portrait } from "@/components/portrait";
import { Avatar } from "@/components/ui";
import { localTime, photoSrc } from "@/lib/chat-script";
import { scripts } from "@/lib/chat-scripts";
import type { Companion } from "@/lib/companions";

const STORY_MS = 5200;

/** Today's moments, full screen: tap right for the next, left for the previous, hold to pause; each one advances on its own. */
export function StoryViewer({ list, start, onSeen, onClose }: { list: Companion[]; start: number; onSeen: (id: string) => void; onClose: () => void }) {
  const [i, setI] = useState(start);
  const bar = useRef<HTMLSpanElement>(null);
  const anim = useRef<Animation | null>(null);
  const minute = useMinute();
  const c = list[i];
  const s = scripts[c.id];

  const go = (d: number) => {
    const n = i + d;
    if (n < 0) return anim.current?.play();
    if (n >= list.length) return onClose();
    setI(n);
  };
  // Latest `go` for the timer and keys without restarting them.
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  useEffect(() => {
    onSeen(c.id);
    const a = bar.current?.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: STORY_MS, fill: "forwards" });
    if (!a) return;
    anim.current = a;
    a.onfinish = () => goRef.current(1);
    return () => a.cancel();
  }, [c.id, onSeen]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goRef.current(1);
      if (e.key === "ArrowLeft") goRef.current(-1);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);

  // A hold pauses; letting go after a hold resumes without skipping.
  const downAt = useRef(0);
  const tap = (e: React.MouseEvent, d: number) => (e.detail === 0 || e.timeStamp - downAt.current < 300) && go(d);
  const hold = {
    onPointerDown: (e: React.PointerEvent) => {
      downAt.current = e.timeStamp;
      anim.current?.pause();
    },
    onPointerUp: () => anim.current?.play(),
    onPointerLeave: () => anim.current?.play(),
    onPointerCancel: () => anim.current?.play(),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${c.name}'s moment`}
      className="fixed inset-0 z-[60] bg-ink outline-none md:grid md:place-items-center md:bg-ink/95"
      tabIndex={-1}
      autoFocus
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden bg-ink-2 md:h-[min(88vh,52rem)] md:w-auto md:aspect-[9/16]"
        initial={{ scale: 0.96, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={c.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div className="absolute inset-0" initial={{ scale: 1 }} animate={{ scale: 1.07 }} transition={{ duration: STORY_MS / 1000 + 0.6, ease: "linear" }}>
              <Portrait companion={c} src={photoSrc(c, "gallery")} sizes="(max-width: 768px) 100vw, 480px" priority />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="scrim-t absolute inset-x-0 top-0 h-40" />
        <div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />

        {/* Tap zones: previous on the left third, next on the rest. */}
        <button type="button" aria-label="Previous moment" className="absolute inset-y-0 left-0 w-1/3" onClick={(e) => tap(e, -1)} {...hold} />
        <button type="button" aria-label="Next moment" className="absolute inset-y-0 right-0 w-2/3" onClick={(e) => tap(e, 1)} {...hold} />

        <div className="pointer-events-none absolute inset-x-0 top-0 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex gap-1" aria-hidden>
            {list.map((x, n) => (
              <span key={x.id} className="h-[3px] flex-1 overflow-hidden bg-paper/25">
                {n === i ? <span ref={bar} className="block h-full origin-left bg-paper" style={{ transform: "scaleX(0)" }} /> : n < i && <span className="block h-full bg-paper" />}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar companion={c} size="sm" showOnline={false} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[1.05rem]">{c.name}</span>
              <span className="mt-0.5 block truncate text-small text-paper/80 tabular">
                {c.city}
                {minute > 0 && s && ` · ${localTime(s.tz, minute)}`}
              </span>
            </span>
            <button type="button" onClick={onClose} className="press pointer-events-auto grid size-11 shrink-0 place-items-center bg-ink/50 text-paper" aria-label="Close moments">
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={c.id}
              className="max-w-[24ch] text-lead text-paper [overflow-wrap:anywhere]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {s?.moment}
            </motion.p>
          </AnimatePresence>
          <Link
            href={`/app/${c.id}/chat`}
            className="press pointer-events-auto mt-5 inline-flex h-12 items-center gap-2 bg-paper px-5 text-body font-medium text-ink hover:bg-paper/90"
          >
            Reply to {c.name}
            <ArrowRight size={18} weight="bold" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
