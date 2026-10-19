"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Camera, CaretLeft, Checks, Coins, Heart, LockSimple, Microphone, Pause, Play } from "@phosphor-icons/react/ssr";
import { Sheet } from "@/components/sheet";
import { Portrait } from "@/components/portrait";
import { Paywall } from "@/components/paywall";
import { Avatar, Button, ButtonLink, Chip } from "@/components/ui";
import { bios, type Companion } from "@/lib/companions";
import { firstChips, persona, reply, type Beat } from "@/lib/chat-script";
import { spend, useWallet } from "@/lib/wallet";

type Msg = {
  id: number;
  from: "her" | "me";
  day: string;
  time: string;
  text?: string;
  photo?: { unlocked: boolean };
  voice?: { text: string; secs: number };
  react?: string;
};

const PHOTO_PRICE = 10;
// shortcut: re-crops of her portrait stand in for distinct photos.
const CROPS = ["scale-[1.35] origin-[50%_25%]", "scale-[1.6] origin-[40%_35%]", "scale-[1.2] origin-[60%_70%]"];

const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isEmoji = (t: string) => t.length <= 12 && /^[\p{Extended_Pictographic}️‍\s]+$/u.test(t);

export function Chat({ companion: c }: { companion: Companion }) {
  const p = persona(c);
  const [msgs, setMsgs] = useState<Msg[]>(() => p.history.map((l, id) => ({ ...l, id, day: "Yesterday" })));
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"typing" | "recording" | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [readUpTo, setReadUpTo] = useState(p.history.length - 1);
  const { coins, premium } = useWallet();
  const [paywall, setPaywall] = useState(false);
  const [profile, setProfile] = useState(false);
  const nextId = useRef(p.history.length);
  const turn = useRef(0);
  const queue = useRef<Beat[]>([]);
  const nextChips = useRef(firstChips);
  const running = useRef(false);
  const alive = useRef(true);
  const opened = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const settled = useRef(false);

  useEffect(() => {
    const smooth = settled.current && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    end.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
    settled.current = true;
  }, [msgs.length, status]);

  const push = (m: Omit<Msg, "id" | "day" | "time">) => {
    const id = nextId.current++;
    setMsgs((all) => [...all, { ...m, id, day: "Today", time: clock() }]);
    return id;
  };

  // She sends one beat at a time: typing (or recording) for as long as the beat would take, then the bubble.
  const run = async () => {
    if (running.current) return;
    running.current = true;
    setChips([]);
    while (queue.current.length && alive.current) {
      const b = queue.current[0];
      const voice = typeof b === "object" && "voice" in b;
      setStatus(voice ? "recording" : "typing");
      await wait(Math.min(650 + (typeof b === "string" ? b.length * 28 : 900), voice ? 2600 : 2200));
      if (!alive.current) break;
      queue.current.shift();
      setStatus(null);
      push(typeof b === "string" ? { from: "her", text: b } : "photo" in b ? { from: "her", photo: { unlocked: false } } : { from: "her", voice: { text: b.voice, secs: b.secs } });
      await wait(420);
    }
    running.current = false;
    if (alive.current) {
      setStatus(null);
      setChips(nextChips.current);
    }
  };

  useEffect(() => {
    alive.current = true;
    if (!opened.current) {
      opened.current = true;
      queue.current.push(...p.opener);
    }
    const t = setTimeout(run, 900);
    return () => {
      alive.current = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per mount; `run` reads refs only
  }, []);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const id = push({ from: "me", text: t });
    setDraft("");
    setChips([]);
    const r = reply(c, t, turn.current++);
    setTimeout(() => {
      if (!alive.current) return;
      setReadUpTo(id);
      if (r.react) setMsgs((all) => all.map((m) => (m.id === id ? { ...m, react: r.react } : m)));
      queue.current.push(...r.beats);
      nextChips.current = r.chips;
      run();
    }, 650 + (t.length % 5) * 130);
  };

  const react = (id: number) => setMsgs((all) => all.map((m) => (m.id === id ? { ...m, react: m.react ? undefined : "❤️" } : m)));

  const unlock = (id: number) => {
    if (!spend(PHOTO_PRICE)) return setPaywall(true);
    setMsgs((all) => all.map((m) => (m.id === id && m.photo ? { ...m, photo: { unlocked: true } } : m)));
  };

  const lastMine = msgs.findLast((m) => m.from === "me")?.id;
  const seen = msgs.filter((m) => m.photo && (m.photo.unlocked || premium));

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      {/* Her, out of focus, filling the room. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Portrait companion={c} sizes="100vw" className="scale-125 opacity-80 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/50 via-ink-950/55 to-ink-950/95" />
      </div>

      <header className="glass relative z-10 flex items-center gap-1 rounded-none border-x-0 border-t-0 px-2 pt-[env(safe-area-inset-top)] backdrop-blur-xl sm:px-4">
        <Link href="/app/chats" aria-label="Back to chats" className="grid size-11 place-items-center rounded-full text-ivory active:scale-95">
          <CaretLeft weight="regular" className="size-5" aria-hidden />
        </Link>
        <button type="button" onClick={() => setProfile(true)} className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-left active:opacity-70">
          <Avatar companion={c} size="sm" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[1.0625rem] font-medium tracking-[-0.01em]">{c.name}</span>
            <span className={`block truncate text-xs transition-colors ${status ? "text-blush" : c.online ? "text-sage" : "text-faint"}`}>
              {status === "typing" ? "typing…" : status === "recording" ? "recording a voice note…" : c.online ? "online now" : "last seen recently"}
            </span>
          </span>
        </button>
        <button type="button" onClick={() => setPaywall(true)} className="glass mr-1 inline-flex h-8 items-center gap-1.5 rounded-full pr-3 pl-1.5 text-sm font-medium tabular-nums active:scale-95" aria-label={`${coins} coins. Get more`}>
          <span className="grid size-5 place-items-center rounded-full bg-linear-to-b from-[#f6e6c4] to-[#a7854c] text-ink-950 shadow-[inset_0_1px_0_#fff8]">
            <Coins weight="bold" className="size-3" aria-hidden />
          </span>
          {coins.toLocaleString()}
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl px-3 pt-8 pb-4 sm:px-4">
          {/* Start of the conversation: who she is. */}
          <div className="rise flex flex-col items-center text-center">
            <button type="button" onClick={() => setProfile(true)} className="relative aspect-[4/5] w-24 overflow-hidden rounded-[1.25rem] shadow-lift ring-1 ring-white/15 active:scale-[0.97]" aria-label={`View ${c.name}'s profile`}>
              <Portrait companion={c} sizes="96px" />
            </button>
            <p className="mt-3 text-xl font-medium tracking-[-0.02em]">
              {c.name}, {c.age}
            </p>
            <p className="text-sm text-muted">
              {c.city} · {c.sign}
            </p>
            <p className="mt-2 max-w-64 text-[0.8125rem] text-balance text-faint">{c.tagline}</p>
          </div>

          <div role="log" aria-live="polite" aria-label={`Conversation with ${c.name}`} className="mt-6 flex flex-col">
            {msgs.map((m, i) => {
              const prev = msgs[i - 1];
              const next = msgs[i + 1];
              const newDay = prev?.day !== m.day;
              const first = newDay || prev.from !== m.from;
              const last = !next || next.from !== m.from || next.day !== m.day;
              const her = m.from === "her";
              const shape = her ? `rounded-bl-md ${first ? "" : "rounded-tl-md"}` : `rounded-br-md ${first ? "" : "rounded-tr-md"}`;
              return (
                <div key={m.id} className="contents">
                  {newDay && <p className="my-4 text-center text-[0.6875rem] font-medium tracking-wide text-faint uppercase">{m.day}</p>}
                  <div className={`flex items-end gap-2 ${her ? "" : "flex-row-reverse"} ${first ? "mt-3" : "mt-[3px]"} ${m.react ? "mb-4" : ""}`}>
                    {her && (
                      <span className="w-7 shrink-0">
                        {last && (
                          <span className="relative block size-7 overflow-hidden rounded-full bg-ink-800">
                            <Portrait companion={c} face />
                          </span>
                        )}
                      </span>
                    )}
                    <div className={`relative flex max-w-[78%] min-w-0 flex-col animate-bubble-in ${her ? "items-start" : "items-end [transform-origin:bottom_right]"}`} onDoubleClick={() => react(m.id)}>
                      {m.photo ? (
                        <PhotoMsg c={c} m={m} open={m.photo.unlocked || premium} shape={shape} canPay={coins >= PHOTO_PRICE} onUnlock={() => unlock(m.id)} onPaywall={() => setPaywall(true)} />
                      ) : m.voice ? (
                        <VoiceNote {...m.voice} shape={shape} />
                      ) : m.text && isEmoji(m.text) ? (
                        <p className="text-[2.75rem] leading-none">{m.text}</p>
                      ) : (
                        <p
                          className={`rounded-[1.25rem] px-3.5 py-2 text-[0.9375rem] leading-[1.4] whitespace-pre-line [overflow-wrap:anywhere] ${shape} ${
                            her ? "glass text-ivory" : "bg-linear-to-b from-blush-hi to-blush text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_8px_24px_-12px_rgb(0_0_0/0.8)]"
                          }`}
                        >
                          {m.text}
                        </p>
                      )}
                      {m.react && (
                        <span className={`absolute -bottom-3.5 grid h-6 min-w-6 place-items-center rounded-full bg-ink-700 px-1 text-xs shadow-glow ring-2 ring-ink-950 animate-bubble-in ${her ? "left-2" : "right-2"}`} aria-label={`Reacted ${m.react}`}>
                          {m.react}
                        </span>
                      )}
                    </div>
                  </div>
                  {last && (
                    <p className={`mt-1 flex items-center gap-1 text-[0.6875rem] text-faint tabular-nums ${her ? "pl-9" : "justify-end pr-1"} ${m.react ? "mt-2" : ""}`}>
                      {m.time}
                      {m.id === lastMine && (
                        <>
                          {" · "}
                          {m.id <= readUpTo ? (
                            <span className="inline-flex items-center gap-0.5 text-blush">
                              <Checks weight="bold" className="size-3" aria-hidden /> Read
                            </span>
                          ) : (
                            "Delivered"
                          )}
                        </>
                      )}
                    </p>
                  )}
                </div>
              );
            })}

            {status && (
              <div className="mt-3 flex items-end gap-2 animate-bubble-in" aria-label={status === "typing" ? `${c.name} is typing` : `${c.name} is recording a voice note`}>
                <span className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-ink-800">
                  <Portrait companion={c} face />
                </span>
                {status === "typing" ? (
                  <span className="glass flex h-9 items-center gap-1 rounded-[1.25rem] rounded-bl-md px-3.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1.5 rounded-full bg-ivory/80 motion-safe:animate-[breathe_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.16}s` }} />
                    ))}
                  </span>
                ) : (
                  <span className="glass flex h-9 items-center gap-2 rounded-[1.25rem] rounded-bl-md px-3.5 text-[0.8125rem] text-muted">
                    <span className="size-2 rounded-full bg-rose motion-safe:animate-[breathe_1s_ease-in-out_infinite]" />
                    <Microphone weight="fill" className="size-3.5 text-ivory" aria-hidden />
                    recording…
                  </span>
                )}
              </div>
            )}
            <div ref={end} className="h-px" />
          </div>
        </div>
      </div>

      <div className="glass relative z-10 rounded-none border-x-0 border-b-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {chips.length > 0 && (
          <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-3 pt-2.5 [scrollbar-width:none]">
            {chips.map((q, i) => (
              <Chip key={q} onClick={() => send(q)} className="h-8 animate-bubble-in text-[0.8125rem]" style={{ animationDelay: `${i * 50}ms` }}>
                {q}
              </Chip>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft || "❤️");
          }}
          className="mx-auto flex max-w-2xl items-end gap-2 px-3 pt-2.5"
        >
          <button type="button" onClick={() => send("Send me a photo 📸")} aria-label="Ask for a photo" className="glass grid size-11 shrink-0 place-items-center rounded-full text-ivory active:scale-90">
            <Camera weight="regular" className="size-5" aria-hidden />
          </button>
          <label htmlFor="msg" className="sr-only">
            Message {c.name}
          </label>
          <textarea
            id="msg"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (draft.trim()) send(draft);
              }
            }}
            placeholder={`Message ${c.name}…`}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={1000}
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-[1.375rem] border border-white/10 bg-black/30 px-4 py-[0.625rem] text-base leading-[1.375rem] text-ivory shadow-[inset_0_1px_2px_rgb(0_0_0/0.5)] transition-[border-color] [field-sizing:content] placeholder:text-faint focus:border-white/30 focus:outline-none"
          />
          {/* Empty composer sends a heart; with text it becomes send. */}
          <button type="submit" aria-label={draft.trim() ? "Send" : "Send a heart"} className="pearl chrome relative grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-150 active:scale-90">
            <ArrowUp weight="bold" className={`absolute size-5 transition-[opacity,transform] duration-200 ${draft.trim() ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} aria-hidden />
            <Heart weight="fill" className={`absolute size-5 text-blush-lo transition-[opacity,transform] duration-200 ${draft.trim() ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} aria-hidden />
          </button>
        </form>
      </div>

      <Paywall open={paywall} onClose={() => setPaywall(false)} reason={`Unlock everything ${c.name} sends you.`} />

      <Sheet open={profile} onClose={() => setProfile(false)} title={`About ${c.name}`}>
        <div className="flex items-center gap-4">
          <Avatar companion={c} size="lg" />
          <div>
            <p className="font-display text-3xl leading-none">{c.name}</p>
            <p className="mt-1 text-sm text-muted">
              {c.age} · {c.city}
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-ivory">{bios[c.id]}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {c.traits.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <p className="mt-6 text-sm font-medium text-muted">Photos she&apos;s sent</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5 overflow-hidden rounded-card">
          {seen.length ? (
            seen.map((m) => (
              <div key={m.id} className="relative aspect-[4/5] overflow-hidden">
                <Portrait companion={c} src={c.gallery[m.id % 2 ? 0 : 1]} sizes="160px" className={CROPS[m.id % CROPS.length]} />
              </div>
            ))
          ) : (
            <p className="col-span-3 rounded-2xl border border-line bg-white/[0.03] p-4 text-sm text-muted">Nothing yet. Ask her for one.</p>
          )}
        </div>
        <div className="mt-8 flex gap-2">
          <ButtonLink size="lg" variant="secondary" className="flex-1" href={`/app/${c.id}`}>
            Full profile
          </ButtonLink>
          <Button size="lg" className="flex-1" onClick={() => setProfile(false)}>
            Keep talking
          </Button>
        </div>
      </Sheet>
    </main>
  );
}

function PhotoMsg({ c, m, open, shape, canPay, onUnlock, onPaywall }: { c: Companion; m: Msg; open: boolean; shape: string; canPay: boolean; onUnlock: () => void; onPaywall: () => void }) {
  return (
    <figure className={`relative aspect-[4/5] w-52 overflow-hidden rounded-[1.25rem] shadow-lift ring-1 ring-white/15 ${shape}`}>
      <Portrait companion={c} src={c.gallery[m.id % 2 ? 0 : 1]} sizes="208px" className={`${CROPS[m.id % CROPS.length]} ${open ? "animate-develop" : "blur-xl brightness-[1.3] saturate-150"}`} />
      {!open && (
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/30 p-3 text-center">
          <span className="glass grid size-11 place-items-center rounded-full">
            <LockSimple weight="fill" className="size-[1.125rem] text-ivory" aria-hidden />
          </span>
          <Button onClick={canPay ? onUnlock : onPaywall} className="h-9 px-4 text-sm">
            {canPay ? `Unlock · ${PHOTO_PRICE} coins` : "Get coins"}
          </Button>
          <button type="button" onClick={onPaywall} className="text-xs font-medium text-ivory drop-shadow underline-offset-4 hover:underline">
            Free with Premium
          </button>
        </figcaption>
      )}
    </figure>
  );
}

/** A voice note from her. No audio in the demo: playing it reveals the transcript word by word. */
function VoiceNote({ text, secs, shape }: { text: string; secs: number; shape: string }) {
  const [t, setT] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(
      () =>
        setT((x) => {
          const n = Math.min(x + 0.1, secs);
          if (n >= secs) setOn(false);
          return n;
        }),
      100,
    );
    return () => clearInterval(id);
  }, [on, secs]);

  const words = text.split(" ");
  const shown = Math.ceil((words.length * t) / secs);
  const bars = Array.from({ length: 30 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + text.length) * Math.cos(i * 0.6)));
  const left = Math.ceil(on ? secs - t : secs);

  return (
    <div className={`glass w-60 rounded-[1.25rem] px-2.5 py-2 ${shape}`}>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (t >= secs) setT(0);
            setOn(!on);
          }}
          aria-label={on ? "Pause voice note" : "Play voice note"}
          className="pearl grid size-9 shrink-0 place-items-center rounded-full active:scale-90"
        >
          {on ? <Pause weight="fill" className="size-4" aria-hidden /> : <Play weight="fill" className="size-4 translate-x-px" aria-hidden />}
        </button>
        <span className="flex h-8 flex-1 items-center gap-[2px]" aria-hidden>
          {bars.map((b, i) => (
            <span key={i} className={`w-[3px] rounded-full transition-colors duration-100 ${i / bars.length < t / secs ? "bg-blush" : "bg-ivory/35"}`} style={{ height: `${b * 100}%` }} />
          ))}
        </span>
        <span className="w-8 text-right text-[0.6875rem] text-muted tabular-nums">0:{String(left).padStart(2, "0")}</span>
      </div>
      {t > 0 && (
        <p className="mt-1.5 px-1 pb-0.5 text-[0.8125rem] leading-snug text-ivory/90">
          {words.slice(0, shown).join(" ")}
          {shown < words.length && <span className="text-faint"> …</span>}
        </p>
      )}
    </div>
  );
}
