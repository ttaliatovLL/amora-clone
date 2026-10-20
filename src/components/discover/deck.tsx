"use client";

import { ArrowCounterClockwise, BookmarkSimple, ChatCircleDots, X } from "@phosphor-icons/react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { fitName } from "@/components/board/fit-name";
import { Portrait } from "@/components/portrait";
import { Button, ButtonLink, cx, Facts, OnlinePill } from "@/components/ui";
import { bios, type Companion } from "@/lib/companions";
import { toggleSaved, track, useProgress } from "@/lib/progress";

type Dir = -1 | 1;
type Fly = (dir: Dir) => void;
// How far (px) or how fast (px/s) a release has to be to count as a decision.
const THRESHOLD = 110;
const FLICK = 550;
const settle = { type: "spring", stiffness: 380, damping: 30 } as const;

/** One companion at a time. Drag or flick right to save, left to skip; buttons and keys do the same; undo steps back. */
export function Deck({ list }: { list: Companion[] }) {
  const [i, setI] = useState(0);
  const [history, setHistory] = useState<{ dir: Dir; saved: boolean }[]>([]);
  const [back, setBack] = useState<Dir | null>(null);
  const saved = useProgress().saved;
  const fly = useRef<Fly | null>(null);
  const top = list[i];

  useEffect(() => {
    if (top) track.view(top.id);
  }, [top]);

  const gone = (dir: Dir) => {
    const c = list[i];
    // Saving is the right swipe; someone already on the board just moves on, so a swipe never unsaves.
    const didSave = dir === 1 && !saved.includes(c.id);
    if (didSave) toggleSaved(c.id, c.name);
    setHistory((h) => [...h, { dir, saved: didSave }]);
    setBack(null);
    setI(i + 1);
  };
  const undo = () => {
    const last = history.at(-1);
    if (!last || i === 0) return;
    const c = list[i - 1];
    if (last.saved && saved.includes(c.id)) toggleSaved(c.id, c.name);
    setHistory((h) => h.slice(0, -1));
    setBack(last.dir);
    setI(i - 1);
  };

  // Keys: left skips, right or S saves, U or Backspace undoes.
  const undoRef = useRef(undo);
  useEffect(() => {
    undoRef.current = undo;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft") fly.current?.(-1);
      else if (k === "arrowright" || k === "s") fly.current?.(1);
      else if (k === "u" || k === "backspace") undoRef.current();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[3/4] w-[min(100%,26rem,calc((100svh-22rem)*0.75))] md:w-[min(100%,26rem,calc((100svh-18rem)*0.75))]">
        {top ? (
          // Up to two more wait behind her, a step smaller and lower each.
          list
            .slice(i, i + 3)
            .map((c, d) => <Card key={c.id} c={c} depth={d} from={d === 0 ? back : null} flyRef={d === 0 ? fly : undefined} onGone={gone} />)
            .reverse()
        ) : (
          <div className="rise absolute inset-0 flex flex-col justify-end bg-ink-2 p-6">
            <p className="font-display text-head">That&apos;s everyone</p>
            <p className="mt-3 text-body text-paper">You have seen the whole board for tonight. Your saves are waiting.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink href="/app/saved" variant="paper" size="sm">
                Your board
              </ButtonLink>
              <Button variant="secondary" size="sm" onClick={() => (setI(0), setHistory([]), setBack(null))}>
                Start over
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex w-[min(100%,26rem)] items-center gap-2">
        <Button variant="ghost" size="lg" className="w-12 px-0!" onClick={undo} disabled={!history.length} aria-label="Undo">
          <ArrowCounterClockwise size={20} aria-hidden />
        </Button>
        <Button variant="secondary" size="lg" className="flex-1 px-0" onClick={() => fly.current?.(-1)} disabled={!top} aria-label={top ? `Skip ${top.name}` : "Skip"}>
          <X size={20} weight="bold" aria-hidden />
          <span className="max-sm:sr-only">Skip</span>
        </Button>
        <Button variant="paper" size="lg" className="flex-1 px-0" onClick={() => fly.current?.(1)} disabled={!top} aria-label={top ? `Save ${top.name}` : "Save"}>
          <BookmarkSimple size={20} weight={top && saved.includes(top.id) ? "fill" : "bold"} aria-hidden />
          <span className="max-sm:sr-only">{top && saved.includes(top.id) ? "Saved" : "Save"}</span>
        </Button>
        {top ? (
          <ButtonLink href={`/app/${top.id}/chat`} size="lg" className="flex-1 px-0">
            <ChatCircleDots size={20} weight="fill" aria-hidden />
            Chat
          </ButtonLink>
        ) : (
          <Button size="lg" className="flex-1 px-0" disabled>
            <ChatCircleDots size={20} weight="fill" aria-hidden />
            Chat
          </Button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {top ? `${top.name}, ${top.age}, ${top.city}. ${i + 1} of ${list.length}.` : "You have seen everyone."}
      </p>
    </div>
  );
}

function Card({ c, depth, from, flyRef, onGone }: { c: Companion; depth: number; from: Dir | null; flyRef?: RefObject<Fly | null>; onGone: (dir: Dir) => void }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(from ? from * 520 : 0);
  const rotate = useTransform(x, [-420, 0, 420], [-12, 0, 12]);
  const saveIn = useTransform(x, [24, THRESHOLD], [0, 1]);
  const skipIn = useTransform(x, [-THRESHOLD, -24], [1, 0]);
  const leaving = useRef(false);
  const lead = depth === 0;

  // Back from an undo: she slides in from the side she left by.
  useEffect(() => {
    if (from) animate(x, 0, reduce ? { duration: 0 } : settle);
  }, [from, reduce, x]);

  useEffect(() => {
    if (!flyRef) return;
    flyRef.current = (dir) => {
      if (leaving.current) return;
      leaving.current = true;
      const out = dir * Math.max(window.innerWidth, 900);
      animate(x, out, reduce ? { duration: 0 } : { type: "tween", duration: 0.38, ease: [0.32, 0.72, 0, 1] }).then(() => onGone(dir));
    };
    return () => {
      flyRef.current = null;
    };
  });

  const release = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > THRESHOLD || velocity.x > FLICK) flyRef?.current?.(1);
    else if (offset.x < -THRESHOLD || velocity.x < -FLICK) flyRef?.current?.(-1);
    else animate(x, 0, settle);
  };

  return (
    <motion.article
      aria-hidden={!lead}
      drag={lead ? "x" : false}
      dragMomentum={false}
      onDragEnd={release}
      initial={false}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 1 ? 0.6 : 1 }}
      transition={settle}
      style={{ x, rotate, zIndex: 3 - depth }}
      className={cx("@container absolute inset-0 overflow-hidden bg-ink-2 select-none", lead && "cursor-grab touch-pan-y active:cursor-grabbing")}
    >
      <div className="pointer-events-none absolute inset-0">
        <Portrait companion={c} priority sizes="(max-width: 768px) 92vw, 26rem" />
      </div>
      <div className="scrim-b pointer-events-none absolute inset-x-0 bottom-0 h-3/5" />

      {/* The decision shows on her as you drag: Save on the right swipe, Skip on the left. */}
      <motion.span style={{ opacity: saveIn }} className="pointer-events-none absolute top-14 left-5 -rotate-6 bg-rouge px-3 py-1.5 font-display text-[1.25rem] text-ink">
        Save
      </motion.span>
      <motion.span style={{ opacity: skipIn }} className="pointer-events-none absolute top-14 right-5 rotate-6 bg-paper px-3 py-1.5 font-display text-[1.25rem] text-ink">
        Skip
      </motion.span>
      {c.online && <OnlinePill className="absolute top-3 left-3" />}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h2 className="font-display text-paper [text-wrap:balance]" style={fitName(c.name, "3rem", "2.5rem", 2)}>
          {c.name}
        </h2>
        <Facts className="mt-2 text-body text-paper/75 tabular" items={[c.age, c.city, c.sign]} />
        <p className="mt-2 line-clamp-2 text-body text-paper/85">{bios[c.id] ?? c.tagline}</p>
        {lead && (
          <Link href={`/app/${c.id}`} draggable={false} className="press mt-3 inline-flex h-10 items-center bg-ink/60 px-3 text-small text-paper hover:bg-ink/80">
            Her profile
          </Link>
        )}
      </div>
    </motion.article>
  );
}
