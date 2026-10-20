"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowDown, ArrowUp, Camera, CaretLeft, Coins, Gift, Heart, Info, X } from "@phosphor-icons/react";
import { GiftBubble, PhotoBubble, TextBubble, VoiceNote, giftIcon } from "@/components/chat/message";
import { Activity, Backdrop, Celebrate, HeartBurst, useMinute } from "@/components/chat/presence";
import { Paywall } from "@/components/paywall";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { Sheet } from "@/components/sheet";
import { Avatar, ButtonLink, Tags, cx } from "@/components/ui";
import { PHOTO_PRICE, gifts, intent, localTime, photoSrc, typingMs, type Beat, type GiftId, type Option } from "@/lib/chat-script";
import { scripts } from "@/lib/chat-scripts";
import { getConvo, setConvo, useConvo, type Msg } from "@/lib/chat-scripts/store";
import { bios, type Companion } from "@/lib/companions";
import { track } from "@/lib/progress";
import { spend, useWallet } from "@/lib/wallet";

const clock = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isGallery = (b: Beat) => typeof b === "object" && "photo" in b && b.photo === "gallery";
type Status = "typing" | "recording" | "photo" | null;

export function Chat({ companion: c }: { companion: Companion }) {
  const s = scripts[c.id];
  const convo = useConvo(c.id);
  const { msgs, turn, readUpTo, readAt } = convo;
  const { coins, premium } = useWallet();
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [tray, setTray] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [profile, setProfile] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);
  const [pill, setPill] = useState(false);
  const [online, setOnline] = useState(() => c.online || getConvo(c.id).touched > 0);
  const [party, setParty] = useState<{ gift: GiftId; n: number } | null>(null);
  const [asked, setAsked] = useState(false);
  const minute = useMinute();
  const herTime = s && minute ? localTime(s.tz, minute) : "";

  const list = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const first = useRef(true);
  const queue = useRef<Beat[]>([]);
  const running = useRef(false);
  const alive = useRef(true);
  const gen = useRef(0); // bumps on every mount, so a loop left over from a hidden visit stops
  const input = useRef<HTMLInputElement>(null);
  const shell = useRef<HTMLElement>(null);
  const parties = useRef(0);

  // iOS keeps the layout viewport full height under the keyboard (Android resizes it via interactiveWidget), so pin the chat to the visible area while the keyboard is up.
  useEffect(() => {
    const vv = window.visualViewport;
    const el = shell.current;
    if (!vv || !el) return;
    const fit = () => {
      const kb = Math.abs(vv.scale - 1) < 0.01 && window.innerHeight - vv.height > 80;
      el.style.height = kb ? `${vv.height}px` : "";
      el.style.transform = kb ? `translateY(${vv.offsetTop}px)` : "";
      el.toggleAttribute("data-kb", kb);
    };
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => {
      vv.removeEventListener("resize", fit);
      vv.removeEventListener("scroll", fit);
    };
  }, []);

  const push = (m: Omit<Msg, "id" | "day" | "time">) => {
    const id = Math.max(-1, ...getConvo(c.id).msgs.map((x) => x.id)) + 1;
    setConvo(c.id, (v) => ({ msgs: [...v.msgs, { ...m, id, day: "Today", time: clock() }], touched: Date.now() }));
    return id;
  };

  // She sends one beat at a time: typing (or recording) for as long as it would take, then the bubble.
  const run = async () => {
    if (running.current) return;
    running.current = true;
    const g = gen.current;
    const live = () => alive.current && gen.current === g;
    setBusy(true);
    while (queue.current.length && live()) {
      const b = queue.current[0];
      if (isGallery(b) && getConvo(c.id).photoSent) {
        queue.current.shift();
        continue;
      }
      setOnline(true);
      setStatus(typeof b === "string" ? "typing" : "voice" in b ? "recording" : "photo");
      await wait(typingMs(b));
      if (!live()) break;
      queue.current.shift();
      setStatus(null);
      push({ from: "her", beat: b, unlocked: !(typeof b === "object" && "photo" in b && b.locked) });
      if (isGallery(b)) setConvo(c.id, () => ({ photoSent: true }));
      if (!atBottom.current) setPill(true);
      await wait(380);
    }
    if (!live()) return; // cleanup already reset running/busy/status
    running.current = false;
    setStatus(null);
    setBusy(false);
  };

  const say = (beats: Beat[]) => {
    queue.current.push(...beats);
    run();
  };

  useEffect(() => {
    alive.current = true;
    gen.current++;
    setConvo(c.id, () => ({ unread: 0 }));
    // Next keeps this page alive (hidden) when you navigate away; finish what she was saying.
    if (queue.current.length) run();
    let t: ReturnType<typeof setTimeout> | undefined;
    if (!getConvo(c.id).opened && s) {
      // Marked inside the timer so a dev double-mount doesn't swallow her greeting.
      t = setTimeout(() => {
        setConvo(c.id, () => ({ opened: true }));
        say(s.live);
      }, 1100);
    }
    return () => {
      alive.current = false;
      running.current = false;
      setStatus(null);
      setBusy(false);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per mount; say/run read refs only
  }, [c.id]);

  // Follow the conversation unless the reader scrolled up to look at something.
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    // Instant, not smooth: a smooth scroll's in-between positions would read as "the reader scrolled up". Bubbles animate in instead.
    if (first.current || atBottom.current) el.scrollTop = el.scrollHeight;
    first.current = false;
  }, [msgs.length, status]);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const ro = new ResizeObserver(() => atBottom.current && (el.scrollTop = el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const onScroll = () => {
    const el = list.current!;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
    if (atBottom.current) setPill(false);
  };
  const jump = () => {
    atBottom.current = true;
    setPill(false);
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  };

  /** I send something; she reads it after a moment, maybe hearts it, then answers. */
  const send = (beat: Msg["beat"], answer: Beat[], heart = false) => {
    atBottom.current = true;
    setBusy(true); // hide quick replies until she has answered
    const id = push({ from: "me", beat });
    track.message(c.id);
    setTimeout(() => {
      if (!alive.current) return void queue.current.push(...answer);
      setOnline(true);
      setConvo(c.id, (v) => ({ readUpTo: id, readAt: clock(), msgs: heart ? v.msgs.map((m) => (m.id === id ? { ...m, heart: true } : m)) : v.msgs }));
      setTimeout(() => (alive.current ? say(answer) : queue.current.push(...answer)), 450);
    }, 700 + (id % 4) * 190);
  };

  const pick = (o: Option) => {
    if (o.say === "What are you up to?") setAsked(true);
    setConvo(c.id, (v) => ({ turn: v.turn + 1 }));
    send(o.say, o.her, o.heart);
  };

  // HANDOVER: AI chat. Replace intent() + scripted answers with POST /api/chat → { beats: Beat[] }, then send(t, beats).
  // Keep say()/run(): it paces replies like a person typing. See docs/INTEGRATIONS.md#1-ai-chat-humanized-conversations
  const sendText = (text: string) => {
    const t = text.trim();
    if (!t || !s) return;
    setDraft("");
    const v = getConvo(c.id);
    const kind = intent(t);
    if (kind === "photo") return send(t, v.photoSent ? s.photoAgain : s.photo);
    if (kind === "night") return send(t, s.night);
    setConvo(c.id, (x) => ({ fallback: x.fallback + 1 }));
    send(t, s.fallback[v.fallback % s.fallback.length]);
  };

  const sendGift = (id: GiftId) => {
    const g = gifts.find((x) => x.id === id)!;
    if (!s) return;
    if (!spend(g.price)) {
      toast("Not enough coins", { description: `${g.name} is ${g.price} coins.`, action: { label: "Get coins", onClick: () => setPaywall(true) } });
      return;
    }
    setTray(false);
    track.gift();
    toast(`${g.name} for ${c.name}`, { description: `${g.price} coins spent` });
    const n = ++parties.current;
    setParty({ gift: id, n });
    setTimeout(() => setParty((p) => (p?.n === n ? null : p)), 1800);
    send({ gift: id }, id === s.love ? s.loveReply : s.gift(g.name), true);
  };

  // HANDOVER: payments + media. Charge the unlock on the server (never trust the local wallet) and return the media URL. See docs/INTEGRATIONS.md#4-payments-coins-and-premium
  const unlock = (id: number) => {
    if (!spend(PHOTO_PRICE)) {
      toast("Not enough coins", { description: `A private photo is ${PHOTO_PRICE} coins.`, action: { label: "Get coins", onClick: () => setPaywall(true) } });
      return;
    }
    setConvo(c.id, (v) => ({ msgs: v.msgs.map((m) => (m.id === id ? { ...m, unlocked: true } : m)) }));
    track.unlock();
    toast("Photo unlocked", { description: `${PHOTO_PRICE} coins spent` });
  };

  const toggleHeart = (id: number) => setConvo(c.id, (v) => ({ msgs: v.msgs.map((m) => (m.id === id ? { ...m, heart: !m.heart } : m)) }));

  // After the script runs out, two open doors so the thread never dead-ends.
  const extras: Option[] = s ? [...(asked ? [] : [{ say: "What are you up to?", her: [s.moment] }]), { say: "Goodnight", her: s.night }] : [];
  const options = !busy && s ? (s.turns[turn] ?? extras) : undefined;
  const lastMine = msgs.findLast((m) => m.from === "me")?.id;
  const statusLine =
    status === "typing" ? "typing…" : status === "recording" ? "recording a voice note…" : status === "photo" ? "choosing a photo…" : online ? (s?.mood ?? "Online") : `Last seen ${s?.lastSeen ?? "recently"}`;

  return (
    <MotionConfig reducedMotion="user">
    <main ref={shell} className="group fixed inset-0 z-30 flex bg-ink md:top-20">
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header bar */}
        <header className="bg-ink-2 pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex h-16 w-full max-w-[760px] items-center gap-1 px-2 sm:px-4">
            <Link href="/app/chats" aria-label="Back to chats" className="press grid size-11 shrink-0 place-items-center text-paper hover:bg-ink-3">
              <CaretLeft size={22} aria-hidden />
            </Link>
            <button type="button" onClick={() => setProfile(true)} className="press flex min-w-0 flex-1 items-center gap-3 py-2 pr-2 text-left" aria-label={`${c.name}'s profile`}>
              <Avatar companion={c} size="sm" showOnline={false} />
              <span className="min-w-0">
                <span className="block truncate font-display text-[1.05rem]">{c.name}</span>
                <span className="relative mt-1 block h-5 overflow-hidden" aria-live="polite">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={status ?? "idle"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className={cx("flex items-center gap-1.5 text-small", status ? "text-rouge" : online ? "text-paper/80" : "text-muted")}
                    >
                      {online && !status && <span className="live-dot size-1.5 shrink-0 rounded-full bg-live" aria-hidden />}
                      <span className="min-w-0 truncate">{statusLine}</span>
                      {!status && herTime && <span className="hidden shrink-0 text-muted tabular sm:inline">· {herTime} in {c.city}</span>}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </button>
            <Link href="/app/me#coins" className="press inline-flex h-10 items-center gap-2 bg-ink-3 px-3 text-small font-medium tabular hover:bg-ink-4 md:hidden" aria-label={`${coins} coins`}>
              <Coins size={16} weight="fill" className="text-rouge" aria-hidden />
              {coins.toLocaleString()}
            </Link>
            {/* HANDOVER: a voice-call button (realtime voice, e.g. ElevenLabs) would sit here. See docs/INTEGRATIONS.md#8-voice-calls-future */}
            <button type="button" onClick={() => setProfile(true)} className="press grid size-11 shrink-0 place-items-center text-paper hover:bg-ink-3" aria-label={`About ${c.name}`}>
              <Info size={22} aria-hidden />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="relative min-h-0 flex-1">
          <Backdrop c={c} />
          <div ref={list} onScroll={onScroll} className="relative h-full overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-[760px] px-3 pt-8 pb-5 sm:px-5">
              <Intro c={c} style={s?.style} time={herTime} onOpen={() => setProfile(true)} />
              <div role="log" aria-label={`Conversation with ${c.name}`} className="flex flex-col">
                {msgs.map((m, i) => {
                  const prev = msgs[i - 1];
                  const next = msgs[i + 1];
                  const newDay = prev?.day !== m.day;
                  const her = m.from === "her";
                  const firstOfRun = newDay || prev.from !== m.from;
                  const tail = !next || next.from !== m.from || next.day !== m.day;
                  return (
                    <div key={m.id} className="contents">
                      {newDay && (
                        <p className="my-6 flex justify-center">
                          <span className="bg-ink-3/80 px-3 py-1 text-small text-muted">{m.day}</span>
                        </p>
                      )}
                      <Row her={her} first={firstOfRun} heart={m.heart} onHeart={her ? () => toggleHeart(m.id) : undefined} animate={m.day === "Today" && m.id >= convoStart(c.id)}>
                        <Content m={m} c={c} her={her} tail={tail} fresh={m.day === "Today" && m.id >= convoStart(c.id)} premium={premium} onUnlock={() => unlock(m.id)} onOpen={setViewer} />
                      </Row>
                      {tail && (
                        <p className={cx("mt-1.5 text-small text-faint tabular", her ? "" : "text-right")}>
                          {m.time}
                          {m.id === lastMine && (
                            <motion.span key={m.id <= readUpTo ? "read" : "sent"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className={m.id <= readUpTo ? "text-paper/70" : ""}>
                              {m.id <= readUpTo ? ` · Read ${readAt}` : " · Delivered"}
                            </motion.span>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
                {status && <Activity kind={status} label={`${c.name} is ${statusLine}`} />}
              </div>
            </div>
          </div>
          <AnimatePresence>{party && <Celebrate key={party.n} gift={party.gift} />}</AnimatePresence>
          {pill && (
            <button
              type="button"
              onClick={jump}
              className="press animate-bubble-in absolute bottom-4 left-1/2 inline-flex h-10 -translate-x-1/2 items-center gap-2 bg-paper px-4 text-small font-medium text-ink shadow-[var(--shadow-float)]"
            >
              <ArrowDown size={16} weight="bold" aria-hidden />
              New message
            </button>
          )}
        </div>

        {/* Composer */}
        <div className="bg-ink-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] group-data-[kb]:pb-3">
          <div className="mx-auto w-full max-w-[760px]">
            {options && !tray && (
              <div className="flex gap-2 overflow-x-auto overscroll-x-contain px-3 pt-3 [scrollbar-width:none] sm:px-5 md:flex-wrap" role="group" aria-label="Quick replies">
                {options.map((o, i) => (
                  <motion.button
                    key={`${turn}-${o.say}`}
                    type="button"
                    onClick={() => pick(o)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32, delay: 0.08 + i * 0.07 }}
                    className="press h-10 max-w-full shrink-0 truncate bg-ink-4 px-4 text-small text-paper hover:bg-ink-5"
                  >
                    {o.say}
                  </motion.button>
                ))}
              </div>
            )}
            <div className={cx("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]", tray ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="min-h-0 overflow-hidden" inert={!tray}>
                <div className="px-3 pt-4 sm:px-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-body font-medium">Send {c.name} a gift</p>
                    <button type="button" onClick={() => setPaywall(true)} className="press text-small text-muted tabular hover:text-paper">
                      {coins.toLocaleString()} coins · Top up
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {gifts.map((g) => {
                      const Icon = giftIcon[g.id];
                      return (
                        <button key={g.id} type="button" onClick={() => sendGift(g.id)} className="press flex flex-col items-center gap-1.5 bg-ink-3 px-1 pt-3.5 pb-2.5 hover:bg-ink-4" aria-label={`${g.name}, ${g.price} coins`}>
                          <Icon size={26} weight="light" aria-hidden />
                          <span className="line-clamp-1 text-small leading-tight">{g.label}</span>
                          <span className="inline-flex items-center gap-1 text-small text-faint tabular">
                            <Coins size={12} weight="fill" className="text-rouge" aria-hidden />
                            {g.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendText(draft);
              }}
              className="flex items-center gap-2 px-3 pt-3 sm:px-5"
            >
              <IconButton label={tray ? "Close gifts" : "Send a gift"} pressed={tray} onClick={() => setTray(!tray)}>
                {tray ? <X size={20} aria-hidden /> : <Gift size={22} aria-hidden />}
              </IconButton>
              <IconButton label="Ask for a photo" onClick={() => sendText("Send me a photo?")} disabled={busy}>
                <Camera size={22} aria-hidden />
              </IconButton>
              <input
                ref={input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setTray(false)}
                placeholder={`Message ${c.name}`}
                enterKeyHint="send"
                autoComplete="off"
                aria-label={`Message ${c.name}`}
                className="h-12 min-w-0 flex-1 bg-ink-3 px-4 text-base text-paper placeholder:text-faint focus:bg-ink-4 focus:ring-2 focus:ring-rouge focus:outline-none"
              />
              <button type="submit" disabled={!draft.trim()} aria-label="Send" className="press grid size-12 shrink-0 place-items-center bg-rouge text-ink hover:bg-rouge-hi disabled:bg-ink-3 disabled:text-faint">
                <ArrowUp size={20} weight="bold" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Desktop: her, large, beside the conversation. */}
      <aside className="relative hidden w-[min(36vw,560px)] shrink-0 bg-ink-2 xl:block">
        <Portrait companion={c} sizes="560px" priority />
        <div className="scrim-b absolute inset-x-0 bottom-0 h-2/3" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <p className="font-display text-[clamp(3rem,4.6vw,5rem)] [overflow-wrap:anywhere]">{c.name}</p>
          <p className="mt-3 text-lead text-paper/85 tabular">
            {c.age} · {c.city}
            {herTime && ` · ${herTime} there`}
          </p>
          <p className="mt-3 max-w-[34ch] text-body text-paper/70">{bios[c.id] ?? c.tagline}</p>
          <div className="mt-6 flex gap-2">
            <ButtonLink href={`/app/${c.id}`} variant="paper">
              View profile
            </ButtonLink>
            <SaveButton id={c.id} name={c.name} label />
          </div>
        </div>
      </aside>

      <Sheet open={profile} onClose={() => setProfile(false)} title={c.name}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-3">
          <Portrait companion={c} sizes="512px" />
          <div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-[clamp(2.25rem,10vw,3.25rem)]">{c.name}</p>
            <p className="mt-2 text-body text-paper/85 tabular">
              {c.age} · {c.city} · {c.sign}
            </p>
          </div>
        </div>
        <p className="mt-5 text-body">{bios[c.id] ?? c.tagline}</p>
        <Tags tags={c.tags.map((t) => `#${t}`)} max={4} className="mt-4" />
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
          <ButtonLink href={`/app/${c.id}`} variant="paper" size="lg">
            View profile
          </ButtonLink>
          <SaveButton id={c.id} name={c.name} label />
        </div>
      </Sheet>
      <Paywall open={paywall} onClose={() => setPaywall(false)} reason={`Coins unlock ${c.name}'s private photos and gifts. Premium opens every photo.`} />
      <AnimatePresence>{viewer && <Viewer key={viewer} src={viewer} name={c.name} onClose={() => setViewer(null)} />}</AnimatePresence>
    </main>
    </MotionConfig>
  );
}

/** Messages seeded from the script appear still; only new ones animate in. */
const convoStart = (id: string) => scripts[id]?.history.reduce((n, d) => n + d.lines.length, 0) ?? 0;

/** The top of every thread: who she is, where, what time it is there, how she texts. */
function Intro({ c, style, time, onOpen }: { c: Companion; style?: string; time: string; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4 flex gap-4 bg-ink-2/80 p-3 sm:p-4"
    >
      <button type="button" onClick={onOpen} className="press relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-ink-3 sm:w-28" aria-label={`View ${c.name}'s profile`}>
        <Portrait companion={c} sizes="112px" />
      </button>
      <div className="flex min-w-0 flex-col py-1">
        <p className="font-display text-lead [overflow-wrap:anywhere]">{c.name}</p>
        <p className="mt-1.5 text-body text-paper/85 tabular">
          {c.age} · {c.city}
          {time && <span className="text-muted"> · {time} there</span>}
        </p>
        {style && <p className="mt-2 text-small text-paper/70">{style}</p>}
        <p className="mt-auto pt-2 text-small text-faint">Private. Only you can see this.</p>
      </div>
    </motion.div>
  );
}

/** One bubble row. Double-tap or long-press her bubble to heart it. */
function Row({ her, first, heart, onHeart, animate, children }: { her: boolean; first: boolean; heart?: boolean; onHeart?: () => void; animate: boolean; children: ReactNode }) {
  // Hearts already there when the thread mounts sit still; new ones pop and burst.
  const [born] = useState(!!heart);
  const lastTap = useRef(0);
  const press = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fired = useRef(false);
  const cancel = () => clearTimeout(press.current);
  const handlers = onHeart && {
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      fired.current = false;
      press.current = setTimeout(() => {
        fired.current = true;
        navigator.vibrate?.(8);
        onHeart();
      }, 480);
    },
    onPointerUp: (e: React.PointerEvent) => {
      cancel();
      if (fired.current || (e.target as HTMLElement).closest("button")) return;
      const now = e.timeStamp;
      if (now - lastTap.current < 320) {
        lastTap.current = 0;
        onHeart();
      } else lastTap.current = now;
    },
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
  return (
    <div className={cx("flex", her ? "justify-start" : "justify-end", first ? "mt-4" : "mt-1", heart && "mb-3")}>
      <div
        {...handlers}
        className={cx("relative max-w-[min(80%,34rem)] min-w-0 touch-manipulation select-none [-webkit-touch-callout:none]", animate && "animate-bubble-in", !her && "[transform-origin:bottom_right]")}
      >
        {children}
        <AnimatePresence>
          {heart && (
            <motion.span
              initial={born ? false : { scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 600, damping: 16 }}
              className={cx("absolute -bottom-3 grid size-6 place-items-center rounded-full bg-ink-5 text-rouge ring-2 ring-ink", her ? "right-2" : "left-2")}
              role="img"
              aria-label={her ? "You loved this" : "She loved this"}
            >
              <Heart size={12} weight="fill" aria-hidden />
              {!born && <HeartBurst />}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Content({ m, c, her, tail, fresh, premium, onUnlock, onOpen }: { m: Msg; c: Companion; her: boolean; tail: boolean; fresh: boolean; premium: boolean; onUnlock: () => void; onOpen: (src: string) => void }) {
  const b = m.beat;
  if (typeof b === "string") return <TextBubble her={her} tail={tail} text={b} />;
  if ("gift" in b) return <GiftBubble id={b.gift} tail={tail} name={c.name} />;
  if ("voice" in b) return <VoiceNote her={her} tail={tail} transcript={b.voice} secs={b.secs} />;
  const src = photoSrc(c, b.photo) ?? "";
  return <PhotoBubble src={src} her={her} tail={tail} fresh={fresh} locked={!m.unlocked && !premium} name={c.name} onUnlock={onUnlock} onOpen={() => onOpen(src)} />;
}

function IconButton({ label, pressed, onClick, disabled, children }: { label: string; pressed?: boolean; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      className={cx("press grid size-12 shrink-0 place-items-center disabled:opacity-40", pressed ? "bg-paper text-ink" : "bg-ink-3 text-paper hover:bg-ink-4")}
    >
      {children}
    </button>
  );
}

function Viewer({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo from ${name}`}
      className="fixed inset-0 z-50 bg-ink/95"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div className="absolute inset-0" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 360, damping: 32 }}>
        <Image src={src} alt={`Photo from ${name}`} fill sizes="100vw" className="object-contain" />
      </motion.div>
      <button type="button" onClick={onClose} autoFocus className="press absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-11 place-items-center bg-ink-3 text-paper" aria-label="Close photo">
        <X size={20} aria-hidden />
      </button>
    </motion.div>
  );
}
