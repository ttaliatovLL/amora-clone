"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Camera, Gift, LockSimple, MagnifyingGlass, Microphone, PushPin } from "@phosphor-icons/react";
import { StoryViewer } from "@/components/chat/story";
import { Portrait } from "@/components/portrait";
import { Avatar, ButtonLink, cx } from "@/components/ui";
import { beatText, gifts } from "@/lib/chat-script";
import { scripts } from "@/lib/chat-scripts";
import { getConvo, useConvos } from "@/lib/chat-scripts/store";
import { companions } from "@/lib/companions";
import { useProgress } from "@/lib/progress";

// shortcut: seen moments live in memory for this tab, like the conversations.
const seenMoments = new Set<string>();

/** The inbox: everyone she's talking to, newest first, previews straight from the conversations. */
export function ChatList() {
  const touched = useConvos();
  const [q, setQ] = useState("");
  const order = Object.keys(scripts);
  const { saved } = useProgress();
  // The viewer gets a frozen copy of the row, so marking moments seen does not reorder it underneath.
  const [story, setStory] = useState<{ list: typeof companions; start: number } | null>(null);
  const [seen, setSeen] = useState(() => new Set(seenMoments));
  const onSeen = useCallback((id: string) => {
    seenMoments.add(id);
    setSeen(new Set(seenMoments));
  }, []);

  const rows = companions
    .filter((c) => scripts[c.id])
    .map((c) => {
      const v = touched[c.id] ?? getConvo(c.id);
      const last = v.msgs.at(-1);
      const b = last?.beat;
      const text = !b ? "" : typeof b === "object" && "gift" in b ? `${gifts.find((g) => g.id === b.gift)?.name} for ${c.name}` : beatText(b, c.name);
      const kind: Kind | null = !b || typeof b === "string" ? null : "gift" in b ? "gift" : "voice" in b ? "voice" : b.locked && !last?.unlocked ? "locked" : "photo";
      return { c, v, kind, pinned: saved.includes(c.id), preview: last?.from === "me" ? `You: ${text}` : text, when: last?.day === "Today" ? last.time : (last?.day ?? "") };
    })
    // Pinned (saved to the board) first, then newest.
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.v.touched - a.v.touched || order.indexOf(a.c.id) - order.indexOf(b.c.id));

  // One unread, unopened conversation "types" now and then, so the inbox feels inhabited.
  const typist = rows.find((r) => r.c.online && r.v.unread > 0 && !r.v.opened)?.c.id;
  const typing = useTyping(typist);

  const needle = q.trim().toLowerCase();
  const shown = needle ? rows.filter((r) => `${r.c.name} ${r.c.city} ${r.preview}`.toLowerCase().includes(needle)) : rows;
  // Today's moments: unseen first, then who is online.
  const moments = rows.map((r) => r.c).sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)) || Number(b.online) - Number(a.online));

  return (
    <MotionConfig reducedMotion="user">
    <main className="page lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start lg:gap-x-16">
      {/* Desktop: heading, search and who's here stay put on the left while the conversations scroll on the right. */}
      <div className="lg:sticky lg:top-32">
        <h1 className="rise font-display text-title">Chats</h1>

        <label className="rise mt-6 flex h-12 items-center gap-3 bg-ink-3 px-4 transition-[background-color,box-shadow] duration-150 hover:bg-ink-4 focus-within:bg-ink-4 focus-within:ring-2 focus-within:ring-rouge md:mt-8" style={{ "--i": 1 } as React.CSSProperties}>
          <MagnifyingGlass size={18} className="shrink-0 text-faint" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search names, cities, messages"
            aria-label="Search chats"
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 bg-transparent text-base text-paper placeholder:text-faint focus:outline-none"
          />
        </label>

        {!needle && moments.length > 0 && (
          <section aria-label="Moments" className="rise mt-8" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 className="flex items-baseline justify-between gap-3 text-body font-medium">
              Moments
              <span className="text-small font-normal text-muted tabular">{moments.some((c) => !seen.has(c.id)) ? `${moments.filter((c) => !seen.has(c.id)).length} new today` : "All caught up"}</span>
            </h2>
            <ul className="-mx-4 mt-3 flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0">
              {moments.map((c, n) => (
                <motion.li key={c.id} layout="position" transition={{ type: "spring", stiffness: 400, damping: 36 }} className="snap-start">
                  <button type="button" onClick={() => setStory({ list: moments, start: n })} className="press group block w-20 text-left md:w-24 lg:w-full" aria-label={`${c.name}'s moment${seen.has(c.id) ? "" : ", new"}`}>
                    <span className={cx("relative block aspect-[4/5] w-full overflow-hidden bg-ink-3 transition-opacity duration-300", seen.has(c.id) && "opacity-55")}>
                      <Portrait companion={c} src={c.gallery[0]} sizes="112px" priority={n < 4} className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105" />
                      {!seen.has(c.id) && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-rouge ring-2 ring-ink" aria-hidden />}
                      {c.online && <span className="absolute right-1.5 bottom-1.5 size-2.5 rounded-full bg-live ring-2 ring-ink" aria-hidden />}
                    </span>
                    <span className={cx("mt-1.5 block truncate text-small group-hover:text-paper", seen.has(c.id) ? "text-muted" : "text-paper/85")}>{c.name}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {shown.length ? (
        <ul className="-mx-3 mt-6 flex flex-col gap-0.5 md:mt-8 lg:mt-0" aria-label="Conversations">
          {shown.map(({ c, v, kind, pinned, preview, when }, i) => (
            <li key={c.id} className="rise" style={{ "--i": Math.min(i, 8) + 3 } as React.CSSProperties}>
              <Link href={`/app/${c.id}/chat`} className="press flex items-center gap-3.5 px-3 py-2.5 hover:bg-ink-2 active:bg-ink-3 md:gap-4 md:py-3">
                <span className="lg:hidden">
                  <Avatar companion={c} size="md" />
                </span>
                <span className="hidden lg:block">
                  <Avatar companion={c} size="lg" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className={cx("truncate text-body", v.unread ? "font-semibold" : "font-medium")}>{c.name}</span>
                      {pinned && <PushPin size={14} weight="fill" className="shrink-0 self-center text-muted" aria-label="Pinned" />}
                      <span className="hidden shrink-0 text-small text-faint lg:inline">{c.city}</span>
                    </span>
                    <span className={cx("shrink-0 text-small tabular", v.unread ? "text-rouge" : "text-faint")}>{when}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-3 lg:mt-1">
                    <span className="relative min-w-0 flex-1">
                      <AnimatePresence initial={false} mode="popLayout">
                        {typing && typist === c.id ? (
                          <motion.span key="typing" {...swap} className="flex items-center gap-2 text-body text-rouge">
                            typing
                            <span className="flex gap-1" aria-hidden>
                              {[0, 1, 2].map((d) => (
                                <span key={d} className="size-1 rounded-full bg-rouge motion-safe:animate-[breathe_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${d * 0.18}s` }} />
                              ))}
                            </span>
                          </motion.span>
                        ) : (
                          <motion.span key="preview" {...swap} className={cx("flex min-w-0 items-center gap-1.5 text-body", v.unread ? "text-paper" : "text-muted")}>
                            {kind && <KindIcon kind={kind} />}
                            <span className="min-w-0 truncate">{preview}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {v.unread > 0 && (
                      <span className="grid h-6 min-w-6 shrink-0 place-items-center bg-rouge px-1.5 text-small font-semibold text-ink tabular" aria-label={`${v.unread} unread`}>
                        {v.unread > 99 ? "99+" : v.unread}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 bg-ink-2 p-5 md:p-6 lg:mt-0">
          <p className="text-lead [overflow-wrap:anywhere]">No one matches “{q.trim()}”.</p>
          <p className="mt-2 text-body text-muted">Try a name or a city, or find someone new on the board.</p>
          <ButtonLink href="/app" variant="secondary" size="sm" arrow className="mt-5">
            Open the board
          </ButtonLink>
        </div>
      )}
      <AnimatePresence>{story && <StoryViewer key="story" list={story.list} start={story.start} onSeen={onSeen} onClose={() => setStory(null)} />}</AnimatePresence>
    </main>
    </MotionConfig>
  );
}

const swap = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } } as const;

type Kind = "gift" | "voice" | "photo" | "locked";
function KindIcon({ kind }: { kind: Kind }) {
  const Icon = { gift: Gift, voice: Microphone, photo: Camera, locked: LockSimple }[kind];
  return <Icon size={16} weight="fill" className={cx("shrink-0", kind === "locked" ? "text-rouge" : "opacity-70")} aria-hidden />;
}

/** On for a few seconds, off for longer, while a companion is "typing" in the inbox. */
function useTyping(id: string | undefined) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!id) return;
    let t: ReturnType<typeof setTimeout>;
    const cycle = (next: boolean) => {
      setOn(next);
      t = setTimeout(() => cycle(!next), next ? 3400 : 7200);
    };
    t = setTimeout(() => cycle(true), 1800);
    return () => {
      clearTimeout(t);
      setOn(false);
    };
  }, [id]);
  return on;
}
