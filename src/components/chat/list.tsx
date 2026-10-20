"use client";

import Link from "next/link";
import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Portrait } from "@/components/portrait";
import { Avatar, ButtonLink, cx } from "@/components/ui";
import { beatText, gifts } from "@/lib/chat-script";
import { scripts } from "@/lib/chat-scripts";
import { getConvo, useConvos } from "@/lib/chat-scripts/store";
import { companions } from "@/lib/companions";

/** The inbox: everyone she's talking to, newest first, previews straight from the conversations. */
export function ChatList() {
  const touched = useConvos();
  const [q, setQ] = useState("");
  const order = Object.keys(scripts);

  const rows = companions
    .filter((c) => scripts[c.id])
    .map((c) => {
      const v = touched[c.id] ?? getConvo(c.id);
      const last = v.msgs.at(-1);
      const b = last?.beat;
      const text = !b ? "" : typeof b === "object" && "gift" in b ? `${gifts.find((g) => g.id === b.gift)?.name} for ${c.name}` : beatText(b, c.name);
      return { c, v, preview: last?.from === "me" ? `You: ${text}` : text, when: last?.day === "Today" ? last.time : (last?.day ?? "") };
    })
    .sort((a, b) => b.v.touched - a.v.touched || order.indexOf(a.c.id) - order.indexOf(b.c.id));

  const needle = q.trim().toLowerCase();
  const shown = needle ? rows.filter((r) => `${r.c.name} ${r.c.city} ${r.preview}`.toLowerCase().includes(needle)) : rows;
  const active = rows.filter((r) => r.c.online);

  return (
    <main className="mx-auto max-w-4xl px-4 pt-4 pb-10 sm:px-8 md:pt-10 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-x-16 xl:gap-x-24">
      {/* Desktop: heading, search and who's here stay put on the left while the conversations scroll on the right. */}
      <div className="lg:sticky lg:top-28">
        <h1 className="rise font-display text-[clamp(2.25rem,9vw,3.75rem)]">Chats</h1>

        <label className="rise mt-6 flex h-12 items-center gap-3 bg-ink-3 px-4 transition-[background-color,box-shadow] focus-within:bg-ink-4 focus-within:ring-2 focus-within:ring-rouge" style={{ "--i": 1 } as React.CSSProperties}>
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

        {!needle && active.length > 0 && (
          <section aria-label="Active now" className="rise mt-7 lg:mt-10" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 className="flex items-baseline justify-between gap-3 text-body font-medium">
              Active now
              <span className="hidden text-small font-normal text-muted tabular lg:inline">{active.length} online</span>
            </h2>
            <ul className="-mx-4 mt-3 flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
              {active.map(({ c }) => (
                <li key={c.id} className="snap-start">
                  <Link href={`/app/${c.id}/chat`} className="press group block w-24 md:w-36 lg:w-auto">
                    <span className="relative block aspect-square overflow-hidden bg-ink-3">
                      <Portrait companion={c} face />
                      <span className="absolute right-1.5 bottom-1.5 size-2.5 rounded-full bg-live ring-2 ring-ink" aria-hidden />
                    </span>
                    <span className="mt-2 block truncate text-small text-paper/85 group-hover:text-paper">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {shown.length ? (
        <ul className="mt-6 -mx-3 lg:mt-0 lg:pt-1" aria-label="Conversations">
          {shown.map(({ c, v, preview, when }, i) => (
            <li key={c.id} className="rise" style={{ "--i": Math.min(i, 8) + 3 } as React.CSSProperties}>
              <Link href={`/app/${c.id}/chat`} className="press flex items-center gap-4 px-3 py-3 hover:bg-ink-2 active:bg-ink-3 lg:gap-5 lg:py-4">
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
                      <span className="hidden shrink-0 text-small text-faint lg:inline">{c.city}</span>
                    </span>
                    <span className={cx("shrink-0 text-small tabular", v.unread ? "text-rouge" : "text-faint")}>{when}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-3 lg:mt-1">
                    <span className={cx("min-w-0 flex-1 truncate text-body", v.unread ? "text-paper" : "text-muted")}>{preview}</span>
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
        <div className="mt-10 bg-ink-2 p-6 lg:mt-0">
          <p className="text-lead [overflow-wrap:anywhere]">No one matches “{q.trim()}”.</p>
          <p className="mt-2 text-body text-muted">Try a name or a city, or find someone new on the board.</p>
          <ButtonLink href="/app" variant="secondary" className="mt-5">
            Open the board
          </ButtonLink>
        </div>
      )}
    </main>
  );
}
