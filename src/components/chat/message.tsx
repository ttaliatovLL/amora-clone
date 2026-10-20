"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bone, BookOpenText, Champagne, Coffee, Flower, LockSimple, Pause, Play, VinylRecord, Wine } from "@phosphor-icons/react";
import { cx } from "@/components/ui";
import { gifts, PHOTO_PRICE, type GiftId } from "@/lib/chat-script";
import { track } from "@/lib/progress";

export const giftIcon: Record<GiftId, typeof Flower> = { coffee: Coffee, rose: Flower, book: BookOpenText, bone: Bone, vinyl: VinylRecord, wine: Wine, champagne: Champagne };

/** Bubble shape: 20px everywhere, a 5px tail corner on the last bubble of a run. */
export const shape = (her: boolean, tail: boolean) => cx("rounded-[1.25rem]", tail && (her ? "rounded-bl-[0.3125rem]" : "rounded-br-[0.3125rem]"));

export function TextBubble({ her, tail, text }: { her: boolean; tail: boolean; text: string }) {
  return (
    <p className={cx("px-4 py-2.5 text-body leading-[1.45] whitespace-pre-line [overflow-wrap:anywhere]", shape(her, tail), her ? "bg-ink-4 text-paper" : "bg-paper text-ink")}>
      {text}
    </p>
  );
}

export function GiftBubble({ id, tail, name }: { id: GiftId; tail: boolean; name: string }) {
  const g = gifts.find((x) => x.id === id)!;
  const Icon = giftIcon[id];
  return (
    <p className={cx("flex items-center gap-3 bg-paper py-2 pr-5 pl-2 text-ink", shape(false, tail))}>
      <span className="grid size-12 shrink-0 place-items-center rounded-[0.875rem] bg-rouge">
        <Icon size={26} weight="fill" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-medium">{g.name}</span>
        <span className="block text-small text-ink/60">for {name}</span>
      </span>
    </p>
  );
}

export function PhotoBubble({
  src,
  her,
  tail,
  locked,
  name,
  onUnlock,
  onOpen,
}: {
  src: string;
  her: boolean;
  tail: boolean;
  locked: boolean;
  name: string;
  onUnlock: () => void;
  onOpen: () => void;
}) {
  // Plays the develop animation only when it is unlocked here, not for photos that arrive open.
  const [developed, setDeveloped] = useState(false);
  const wasLocked = useRef(locked);
  useEffect(() => {
    if (wasLocked.current && !locked) setDeveloped(true);
  }, [locked]);

  return (
    <div className={cx("relative aspect-[4/5] w-[min(15rem,64vw)] overflow-hidden bg-ink-3", shape(her, tail))}>
      <Image
        src={src}
        alt={locked ? `Private photo from ${name}` : `Photo from ${name}`}
        fill
        sizes="240px"
        className={cx("object-cover", locked ? "scale-125 blur-xl saturate-75" : developed && "animate-develop")}
      />
      {locked ? (
        <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 bg-ink/15 p-4">
          <span className="grid size-10 place-items-center bg-ink/70 text-paper">
            <LockSimple size={18} weight="bold" aria-hidden />
          </span>
          <span className="text-body leading-tight text-paper">Private photo</span>
          <button type="button" onClick={onUnlock} className="press inline-flex h-10 items-center gap-2 bg-rouge px-4 text-small font-medium text-ink hover:bg-rouge-hi">
            Unlock for {PHOTO_PRICE} coins
          </button>
        </div>
      ) : (
        <button type="button" onClick={onOpen} className="absolute inset-0" aria-label={`Open photo from ${name}`} />
      )}
    </div>
  );
}

/** A fake waveform from the transcript, so every note has its own shape. */
function bars(seed: string, n = 30) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Array.from({ length: n }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177) + i;
    const v = ((h >>> 0) % 1000) / 1000;
    const env = Math.sin((Math.PI * (i + 1)) / (n + 1)) * 0.55 + 0.45;
    return Math.round(22 + v * 78 * env);
  });
}
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VoiceNote({ her, tail, transcript, secs }: { her: boolean; tail: boolean; transcript: string; secs: number }) {
  const top = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const [playing, setPlaying] = useState(false);
  const [left, setLeft] = useState(secs);
  const [heard, setHeard] = useState(false);
  const shapeBars = bars(transcript);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      const ms = Number(anim.current?.currentTime ?? 0);
      setLeft(Math.max(0, secs - ms / 1000));
    }, 200);
    return () => clearInterval(t);
  }, [playing, secs]);
  useEffect(() => () => anim.current?.cancel(), []);

  const toggle = () => {
    if (playing) {
      anim.current?.pause();
      return setPlaying(false);
    }
    if (!heard) {
      setHeard(true);
      track.voice();
    }
    if (!anim.current && top.current) {
      anim.current = top.current.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: secs * 1000, fill: "forwards" });
      anim.current.onfinish = () => {
        anim.current?.cancel();
        anim.current = null;
        setPlaying(false);
        setLeft(secs);
      };
    } else anim.current?.play();
    setPlaying(true);
  };

  const row = (cls: string) => (
    <div className={cx("flex h-8 items-center gap-[3px]", cls)}>
      {shapeBars.map((b, i) => (
        <span key={i} className="w-[3px] shrink-0 rounded-full bg-current" style={{ height: `${b}%` }} />
      ))}
    </div>
  );

  return (
    <div className={cx("w-[min(17.5rem,72vw)] px-2 py-2", shape(her, tail), her ? "bg-ink-4 text-paper" : "bg-paper text-ink")}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className={cx("press grid size-10 shrink-0 place-items-center rounded-full", her ? "bg-paper text-ink" : "bg-ink text-paper")}
          aria-label={playing ? "Pause voice note" : `Play voice note, ${mmss(secs)}`}
        >
          {playing ? <Pause size={16} weight="fill" aria-hidden /> : <Play size={16} weight="fill" className="translate-x-px" aria-hidden />}
        </button>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {row("opacity-35")}
          <div ref={top} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }} aria-hidden>
            {row(her ? "text-rouge" : "text-rouge-lo")}
          </div>
        </div>
        <span className="w-9 shrink-0 text-small tabular opacity-70">{mmss(playing || left < secs ? left : secs)}</span>
      </div>
      {heard && <p className="mt-2 px-1 pb-1 text-small leading-snug opacity-70">{transcript}</p>}
    </div>
  );
}
