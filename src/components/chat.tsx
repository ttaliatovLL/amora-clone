"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, CaretLeft, Coins, LockSimple } from "@phosphor-icons/react/ssr";
import { Sheet } from "@/components/sheet";
import { Portrait } from "@/components/portrait";
import { Paywall } from "@/components/paywall";
import { Avatar, Bubble, Button, Chip, Typing } from "@/components/ui";
import { bios, type Companion } from "@/lib/companions";
import { spend, useWallet } from "@/lib/wallet";

type Msg = { id: number; from: "her" | "me"; text?: string; photo?: { price: number; unlocked: boolean } };

// shortcut: canned replies stand in for the AI backend; swap `reply()` for an API call.
const lines = [
  "mm, tell me more. i'm listening",
  "ok that made me smile. what happened next?",
  "you're easy to talk to, you know that?",
  "honestly same. i've been thinking about that all day",
  "wait, go back. i want the whole story",
];
const quick = ["Hey, what's up?", "Send me a photo", "Tell me about yourself", "I'm bored, entertain me", "What are you doing rn?"];
const PHOTO_PRICE = 10;
// shortcut: re-crops of her portrait stand in for distinct photos.
const CROPS = ["scale-[1.35] origin-[50%_25%]", "scale-[1.6] origin-[40%_35%]", "scale-[1.2] origin-[60%_70%]"];

const opener = (c: Companion) =>
  c.id === "emma"
    ? "its 1am and im surrounded by boxes i still havent unpacked, in a flat that doesnt feel like mine yet. somehow ur the one im telling this to. dont make it weird. tell me a 2am thought, i'll trade u one of mine"
    : `hey, you found me. i was just thinking about ${c.interests[0]?.toLowerCase() ?? "you"}. what are you up to tonight?`;

export function Chat({ companion: c }: { companion: Companion }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "her", text: opener(c) }]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const { coins, premium } = useWallet();
  const [paywall, setPaywall] = useState(false);
  const [profile, setProfile] = useState(false);
  const nextId = useRef(1);
  const turns = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "end" });
  }, [msgs, typing]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const push = (m: Omit<Msg, "id">) => setMsgs((all) => [...all, { ...m, id: nextId.current++ }]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    push({ from: "me", text: t });
    setDraft("");
    setTyping(true);
    const wantsPhoto = /photo|pic|see you/i.test(t) || ++turns.current % 3 === 0;
    timer.current = setTimeout(() => {
      setTyping(false);
      if (wantsPhoto) {
        push({ from: "her", text: "took this earlier. only for you" });
        push({ from: "her", photo: { price: PHOTO_PRICE, unlocked: false } });
      } else push({ from: "her", text: lines[turns.current % lines.length] });
    }, 1200 + Math.min(t.length * 25, 1300));
  };

  const unlock = (id: number) => {
    if (!spend(PHOTO_PRICE)) return setPaywall(true);
    setMsgs((all) => all.map((m) => (m.id === id && m.photo ? { ...m, photo: { ...m.photo, unlocked: true } } : m)));
  };

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden">
      {/* Her, out of focus, filling the room. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Portrait companion={c} sizes="100vw" className="scale-125 opacity-70 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/60 via-plum/30 to-ink-950/90" />
      </div>

      <header className="glass relative z-10 flex items-center gap-2 rounded-none border-x-0 border-t-0 px-2 pt-[env(safe-area-inset-top)] backdrop-blur-xl sm:px-4">
        <Link href={`/app/${c.id}`} aria-label={`Back to ${c.name}'s profile`} className="grid size-11 place-items-center rounded-full text-ivory active:scale-95">
          <CaretLeft weight="light" className="size-5" aria-hidden />
        </Link>
        <button type="button" onClick={() => setProfile(true)} className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-left">
          <Avatar companion={c} size="sm" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-xl">{c.name}</span>
            <span className={`block text-xs ${typing ? "text-champagne" : c.online ? "text-sage" : "text-faint"}`}>{typing ? "typing…" : c.online ? "online now" : "away"}</span>
          </span>
        </button>
        <span className="glass mr-2 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm tabular-nums" aria-label={`${coins} coins`}>
          <Coins weight="duotone" className="size-4 text-gold" aria-hidden />
          {coins.toLocaleString()}
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div role="log" aria-live="polite" aria-label={`Conversation with ${c.name}`} className="mx-auto flex max-w-2xl flex-col gap-2.5 px-4 py-6">
          {msgs.map((m) =>
            m.photo ? (
              <figure key={m.id} className="animate-bubble-in relative aspect-[4/5] w-56 self-start overflow-hidden rounded-[1.375rem] rounded-bl-md shadow-lift ring-1 ring-gold/20">
                <Portrait
                  companion={c}
                  sizes="224px"
                  className={`${CROPS[m.id % CROPS.length]} ${m.photo.unlocked || premium ? "animate-develop" : "blur-lg brightness-[1.6] saturate-150"}`}
                />
                {!m.photo.unlocked && !premium && (
                  <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/30 p-3 text-center">
                    <span className="glass grid size-11 place-items-center rounded-full">
                      <LockSimple weight="duotone" className="size-5 text-champagne" aria-hidden />
                    </span>
                    {coins >= m.photo.price ? (
                      <Button onClick={() => unlock(m.id)} className="h-9 px-4 text-sm">
                        Unlock · {m.photo.price} coins
                      </Button>
                    ) : (
                      <Button onClick={() => setPaywall(true)} className="h-9 px-4 text-sm">
                        Get coins
                      </Button>
                    )}
                    <button type="button" onClick={() => setPaywall(true)} className="text-xs text-champagne-hi underline-offset-4 hover:underline">
                      Free with Premium
                    </button>
                  </figcaption>
                )}
              </figure>
            ) : (
              <Bubble key={m.id} from={m.from} className="animate-bubble-in">
                {m.text}
              </Bubble>
            ),
          )}
          {typing && <Typing className="animate-bubble-in" />}
          <div ref={end} />
        </div>
      </div>

      <div className="glass relative z-10 rounded-none border-x-0 border-b-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {msgs.length < 6 && (
          <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">
            {quick.map((q) => (
              <Chip key={q} onClick={() => send(q)} disabled={typing} className="h-8 text-[0.8125rem]">
                {q}
              </Chip>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="mx-auto flex max-w-2xl items-center gap-2 px-4 pt-3"
        >
          <label htmlFor="msg" className="sr-only">
            Message {c.name}
          </label>
          <input
            id="msg"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${c.name}…`}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={1000}
            className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-ink-950/50 px-5 text-base text-ivory placeholder:text-faint focus:border-champagne-lo focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim() || typing}
            aria-label="Send"
            className="foil grid size-12 shrink-0 place-items-center rounded-full shadow-glow transition-[transform,opacity] duration-150 active:scale-90 disabled:opacity-35"
          >
            <ArrowUp weight="bold" className="size-5" aria-hidden />
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
          {msgs.filter((m) => m.photo && (m.photo.unlocked || premium)).length ? (
            msgs
              .filter((m) => m.photo && (m.photo.unlocked || premium))
              .map((m) => (
                <div key={m.id} className="relative aspect-[4/5] overflow-hidden">
                  <Portrait companion={c} sizes="160px" className={CROPS[m.id % CROPS.length]} />
                </div>
              ))
          ) : (
            <p className="col-span-3 rounded-card bg-ink-850 p-4 text-sm text-muted">Nothing yet. Ask her for one.</p>
          )}
        </div>
        <Button size="lg" className="mt-8 w-full" onClick={() => setProfile(false)}>
          Keep talking
        </Button>
      </Sheet>
    </main>
  );
}
