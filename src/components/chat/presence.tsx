"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Camera, Heart, Microphone } from "@phosphor-icons/react";
import { giftIcon } from "@/components/chat/message";
import { Portrait } from "@/components/portrait";
import type { GiftId } from "@/lib/chat-script";
import type { Companion } from "@/lib/companions";

const spring = { type: "spring", stiffness: 520, damping: 30 } as const;

/** The current minute; 0 on the server so her clock renders only on the client. */
export function useMinute() {
  return useSyncExternalStore(
    (l) => {
      const t = setInterval(l, 15_000);
      return () => clearInterval(t);
    },
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0,
  );
}

/** Her, out of focus behind the thread: the room takes on her colours and breathes slowly. */
export function Backdrop({ c }: { c: Companion }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[12%]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: [1.1, 1.24, 1.1] }}
        transition={{ opacity: { duration: 1.4 }, scale: { duration: 26, repeat: Infinity, ease: "easeInOut" } }}
      >
        <Portrait companion={c} sizes="96px" className="blur-3xl saturate-[1.4]" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/65" />
    </div>
  );
}

/** What she is doing right now, as a bubble at the foot of the thread. */
export function Activity({ kind, label }: { kind: "typing" | "recording" | "photo"; label: string }) {
  return (
    <motion.div
      key={kind}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      style={{ transformOrigin: "bottom left" }}
      className="mt-4 flex h-11 items-center gap-2.5 self-start rounded-[1.25rem] rounded-bl-[0.3125rem] bg-ink-4 px-4 text-paper"
      role="status"
      aria-label={label}
    >
      {kind === "typing" ? (
        <span className="flex gap-1.5 px-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1.5 rounded-full bg-paper/80 motion-safe:animate-[breathe_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${d * 0.18}s` }} />
          ))}
        </span>
      ) : kind === "recording" ? (
        <>
          <Microphone size={18} weight="fill" className="text-rouge motion-safe:animate-[breathe_1.6s_ease-in-out_infinite]" aria-hidden />
          <span className="flex h-5 items-center gap-[3px]">
            {[0.5, 0.9, 0.6, 1, 0.7, 0.85, 0.45].map((h, i) => (
              <motion.span
                key={i}
                className="h-full w-[3px] origin-center rounded-full bg-paper/80"
                initial={{ scaleY: 0.25 }}
                animate={{ scaleY: [0.25, h, 0.35, h * 0.8, 0.25] }}
                transition={{ duration: 1.1 + i * 0.07, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
              />
            ))}
          </span>
        </>
      ) : (
        <>
          <Camera size={18} weight="fill" className="text-rouge motion-safe:animate-[breathe_1.6s_ease-in-out_infinite]" aria-hidden />
          <span className="text-small text-paper/80">Choosing a photo</span>
        </>
      )}
    </motion.div>
  );
}

/** A handful of hearts lifting off a bubble the moment it is loved. */
export function HeartBurst() {
  const drift = [-26, -10, 6, 20, 32];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {drift.map((x, i) => (
        <motion.span
          key={i}
          className="absolute top-0 left-1.5 text-rouge"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], x, y: -36 - (i % 3) * 14, scale: [0.4, 1, 0.8] }}
          transition={{ duration: 0.9, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
        >
          <Heart size={10 + (i % 2) * 4} weight="fill" />
        </motion.span>
      ))}
    </span>
  );
}

/** The gift lands: a rouge square springs up mid-thread, a ring of small hearts breaks out of it, then it floats off. */
export function Celebrate({ gift }: { gift: GiftId }) {
  const Icon = giftIcon[gift];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      <motion.div
        className="relative grid size-24 place-items-center bg-rouge text-ink"
        initial={{ opacity: 0, scale: 0.5, y: 24 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.06, 1, 0.9], y: [24, 0, 0, -60] }}
        transition={{ duration: 1.7, times: [0, 0.22, 0.7, 1], ease: [0.23, 1, 0.32, 1] }}
      >
        <Icon size={48} weight="fill" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              className="absolute text-rouge"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], x: Math.cos(a) * 92, y: Math.sin(a) * 92 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart size={14} weight="fill" />
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
}
