"use client";

import { ChatCircleDots, Square, SquaresFour } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState, ViewTransition } from "react";
import { boardGrid, setDensity, useDensity } from "@/components/board/density";
import { Crossfade } from "@/components/board/crossfade";
import { fitName } from "@/components/board/fit-name";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { Button, ButtonLink, Chip, CompanionCard, cx } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";

type Vibe = (typeof vibes)[number];
type Filter = { online: boolean; fresh: boolean; vibe: Vibe | null };
const everyone: Filter = { online: false, fresh: false, vibe: null };

// shortcut: fixed editor's pick until there's a ranking signal.
const pick = companions.find((c) => c.id === "luna")!;
const online = companions.filter((c) => c.online).length;
// She is already the hero, so on the board she goes to the end instead of repeating right under it.
const board = [...companions.filter((c) => c.id !== pick.id), pick];
/**
 * Which cards open into landscape features on the 3-column desktop board, so it has a rhythm instead of a wall:
 * about every sixth card, only where two columns are free (no broken rows), then one added or dropped so the last row ends full.
 */
function features(n: number) {
  const wide: number[] = [];
  const cols: number[] = [];
  let col = 0;
  for (let i = 0; i < n; i++) {
    cols.push(col);
    const w = i >= 3 && col <= 1 && (!wide.length || i - wide[wide.length - 1] >= 6);
    if (w) wide.push(i);
    col = (col + (w ? 2 : 1)) % 3;
  }
  const gap = (n + wide.length) % 3;
  const last = wide.at(-1) ?? -1;
  if (gap === 1) wide.pop();
  else if (gap === 2) {
    // Only single cards follow the last feature, so their columns stay valid.
    const j = cols.findLastIndex((c, i) => i > last + 1 && c <= 1);
    if (j > 0) wide.push(j);
  }
  return new Set(wide);
}

export default function Board() {
  const [f, setF] = useState<Filter>(everyone);
  const density = useDensity();
  const all = !f.online && !f.fresh && !f.vibe;
  const shown = board.filter((c) => (!f.online || c.online) && (!f.fresh || c.isNew) && (!f.vibe || c.vibe === f.vibe));
  const wide = features(shown.length);

  return (
    <main className="mx-auto max-w-[1600px] pt-4 pb-10 md:px-8 md:pt-10 md:pb-20">
      <header className="rise flex flex-col gap-3 px-4 md:px-0 xl:flex-row xl:items-end xl:justify-between">
        <h1 className="font-display text-[clamp(2.25rem,calc((100vw-2rem)/7.8),7.5rem)] leading-[0.92]">
          Who&apos;s up
          <br /> tonight
        </h1>
        <p className="flex items-center gap-2 text-body text-muted tabular xl:mb-3">
          <span className="live-dot size-2 rounded-full bg-live" aria-hidden />
          <span>
            <span className="text-paper">{online} online</span> of {companions.length} on the board
          </span>
        </p>
      </header>

      {/* Tonight's pick: her comp card, opened up. */}
      <section aria-label="Tonight's pick" className="rise mt-6 md:mt-10 md:flex md:gap-1" style={{ ["--i" as string]: 1 }}>
        <Link
          href={`/app/${pick.id}`}
          aria-label={`${pick.name}, ${pick.age}, ${pick.city}`}
          className="press @container relative block aspect-[4/5] w-full overflow-hidden bg-ink-2 active:scale-[0.99] md:w-[min(55%,calc(min(78svh,54rem)*0.8))] md:shrink-0"
        >
          <ViewTransition name={`portrait-${pick.id}`} share="morph" default="none">
            <div className="absolute inset-0">
              <Crossfade
                a={<Portrait companion={pick} priority sizes="(max-width: 768px) 100vw, 45vw" />}
                b={pick.gallery[0] && <Portrait companion={pick} src={pick.gallery[0]} sizes="(max-width: 768px) 100vw, 45vw" />}
              />
            </div>
          </ViewTransition>
          <div className="scrim-b absolute inset-x-0 bottom-0 h-1/2 md:hidden" />
          <p className="absolute inset-x-0 bottom-0 p-4 font-display leading-[0.9] text-paper md:hidden" style={fitName(pick.name, "6rem")}>{pick.name}</p>
        </Link>

        <div className="@container flex flex-col px-4 pt-4 md:min-w-0 md:flex-1 md:justify-end md:bg-ink-2 md:p-8 lg:p-14">
          <h2 className="hidden font-display leading-[0.9] md:block" style={fitName(pick.name, "8.5rem", "0rem")}>{pick.name}</h2>
          <p className="flex flex-wrap items-center gap-x-2 text-body text-paper/80 tabular md:mt-5 md:text-lead">
            <span className="text-paper">Tonight&apos;s pick</span>
            <span aria-hidden>·</span>
            {pick.age} · {pick.city} · {pick.sign}
            {pick.online && <span className="live-dot ml-1 size-2 rounded-full bg-live" aria-label="Online" />}
          </p>
          <p className="mt-1 text-body text-muted md:mt-2 md:max-w-[40ch] md:text-lead">{pick.tagline}.</p>
          <div className="mt-5 flex gap-2 md:mt-8">
            <ButtonLink href={`/app/${pick.id}/chat`} className="flex-1 lg:flex-none lg:px-10">
              <ChatCircleDots weight="fill" className="size-5" aria-hidden />
              Chat with {pick.name}
            </ButtonLink>
            <SaveButton id={pick.id} name={pick.name} label />
          </div>
        </div>
      </section>

      {/* Filters: one row, scrolls sideways on phones; density toggle pinned at its end. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 mt-10 flex items-center gap-2 bg-ink py-3 md:top-20 md:mt-14">
        <div role="group" aria-label="Filter companions" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] md:px-0 [&::-webkit-scrollbar]:hidden">
          <Chip pressed={all} onClick={() => setF(everyone)}>
            All
          </Chip>
          <Chip pressed={f.online} onClick={() => setF({ ...f, online: !f.online })}>
            <span className="size-2 rounded-full bg-live" aria-hidden />
            Online
          </Chip>
          <Chip pressed={f.fresh} onClick={() => setF({ ...f, fresh: !f.fresh })}>
            New
          </Chip>
          {vibes.map((v) => (
            <Chip key={v} pressed={f.vibe === v} onClick={() => setF({ ...f, vibe: f.vibe === v ? null : v })}>
              {v}
            </Chip>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDensity(density === 1 ? 2 : 1)}
          aria-label={density === 1 ? "Show more per row" : "Show bigger cards"}
          className="press mr-4 grid size-10 shrink-0 place-items-center bg-ink-3 text-paper hover:bg-ink-4 md:mr-0"
        >
          {density === 1 ? <SquaresFour size={20} aria-hidden /> : <Square size={20} aria-hidden />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "companion" : "companions"}
      </p>

      {shown.length ? (
        <div className={boardGrid[density]}>
          {shown.map((c, i) => (
            <CompanionCard
              key={c.id}
              companion={c}
              href={`/app/${c.id}`}
              size={density === 2 ? "tile" : "large"}
              wide={density === 1 && wide.has(i)}
              // The pick's portrait above already carries her morph name.
              morph={c.id !== pick.id}
              // Features are a desktop rhythm; on the 2-column tablet board they stay single.
              className={cx(i < 3 ? "rise" : "reveal", density === 1 && wide.has(i) && "md:col-span-1! md:aspect-[4/5]! lg:col-span-2! lg:aspect-auto!")}
              style={{ ["--i" as string]: i + 2 }}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-20 md:px-0 md:py-32">
          <p className="font-display text-head">Nobody like that</p>
          <p className="mt-3 max-w-[40ch] text-body text-muted">No one on the board matches all of those right now. Try fewer filters.</p>
          <Button variant="paper" className="mt-6" onClick={() => setF(everyone)}>
            Show everyone
          </Button>
        </div>
      )}
    </main>
  );
}
