"use client";

import { ChatCircleDots, Square, SquaresFour } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState, ViewTransition, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { boardGrid, setDensity, useDensity } from "@/components/board/density";
import { Crossfade } from "@/components/board/crossfade";
import { fitName } from "@/components/board/fit-name";
import { DiscoverCell, QuoteCell } from "@/components/board/interludes";
import { ViewSwitch } from "@/components/discover/view-switch";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { Button, ButtonLink, Chip, CompanionCard, Facts } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";

type Vibe = (typeof vibes)[number];
type Filter = { online: boolean; fresh: boolean; vibe: Vibe | null };
const everyone: Filter = { online: false, fresh: false, vibe: null };

// shortcut: fixed editor's pick until there's a ranking signal.
const pick = companions.find((c) => c.id === "luna")!;
const second = pick.gallery[0];
const online = companions.filter((c) => c.online).length;
// She is already the hero, so on the board she goes to the end instead of repeating right under it.
const board = [...companions.filter((c) => c.id !== pick.id), pick];
/** The board re-lays itself under a short crossfade instead of jumping (instant under reduced motion, see globals.css). */
function switchDensity(d: 1 | 2) {
  if (!document.startViewTransition) return setDensity(d);
  document.startViewTransition(() => flushSync(() => setDensity(d)));
}

const faces = companions.filter((c) => c.online).slice(0, 3);

/** The board's cells: her cards, with a line from one of them after the fifth and the way into Discover after the tenth. */
function cells(shown: typeof companions, tile: boolean) {
  const out: { key: string; node: ReactNode }[] = shown.map((c, i) => ({
    key: c.id,
    node: (
      <CompanionCard
        companion={c}
        href={`/app/${c.id}`}
        size={tile ? "tile" : "large"}
        // The pick's portrait above already carries her morph name.
        morph={c.id !== pick.id}
        priority={i < 4}
      />
    ),
  }));
  // Her line comes right before her card.
  if (shown.length >= 6) out.splice(5, 0, { key: `quote-${shown[5].id}`, node: <QuoteCell companion={shown[5]} tile={tile} /> });
  if (shown.length >= 9) out.splice(11, 0, { key: "discover", node: <DiscoverCell faces={faces} tile={tile} /> });
  return out;
}

// Editorial rhythm from 3 columns up: alternate columns sit lower, like prints pinned unevenly on a board.
// `translate` (not transform) so it composes with the entrance and re-flow motion. Padding keeps the last row clear of what follows.
const stagger = `
@media (width >= 40rem) and (width < 64rem) { .stagger-2 > :nth-child(3n+2) { translate: 0 2rem } .stagger-2 { padding-bottom: 2rem } }
@media (width >= 64rem) { .stagger-1 > :nth-child(3n+2) { translate: 0 3.5rem } .stagger-1 { padding-bottom: 3.5rem } }
@media (width >= 64rem) and (width < 96rem) { .stagger-2 > :nth-child(even) { translate: 0 3rem } .stagger-2 { padding-bottom: 3rem } }
@media (width >= 96rem) { .stagger-2 > :nth-child(5n+2), .stagger-2 > :nth-child(5n+4) { translate: 0 3rem } .stagger-2 { padding-bottom: 3rem } }
`;

export default function Board() {
  const [f, setF] = useState<Filter>(everyone);
  const density = useDensity();
  const all = !f.online && !f.fresh && !f.vibe;
  const filterKey = `${f.online}${f.fresh}${f.vibe}`;
  const shown = board.filter((c) => (!f.online || c.online) && (!f.fresh || c.isNew) && (!f.vibe || c.vibe === f.vibe));

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-12 md:px-8 md:pt-12 md:pb-24">
      <header className="rise flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-[clamp(2rem,calc((100vw-2rem)/9.5),4.75rem)] leading-[0.92]">
          Who&apos;s up
          <br /> tonight
        </h1>
        <div className="flex flex-col gap-4 md:mb-2 md:items-end">
        <ViewSwitch on="board" />
        <p className="flex items-center gap-2 text-body text-muted tabular">
          {online > 0 && <span className="live-dot size-2 rounded-full bg-live" aria-hidden />}
          {online > 0 ? (
            <span>
              <span className="text-paper">{online} online</span> of {companions.length} on the board
            </span>
          ) : (
            <span>
              <span className="text-paper">{companions.length} on the board</span>, nobody online yet
            </span>
          )}
        </p>
        </div>
      </header>

      {/* Tonight's pick: her comp card opened flat. Phones: portrait beside her details. Desktop: portrait, a paper back, her second shot. */}
      <section aria-label="Tonight's pick" className="rise mt-6 flex gap-4 md:mt-10 md:h-[min(62svh,34rem)] md:gap-0" style={{ ["--i" as string]: 1 }}>
        <Link
          href={`/app/${pick.id}`}
          aria-label={`${pick.name}, ${pick.age}, ${pick.city}`}
          className="press relative block aspect-[3/4] w-[42%] shrink-0 overflow-hidden bg-ink-2 select-none active:scale-[0.99] md:h-full md:w-auto md:aspect-[4/5]"
        >
          <ViewTransition name={`portrait-${pick.id}`} share="morph" default="none">
            <div className="absolute inset-0">
              <Crossfade
                a={<Portrait companion={pick} priority sizes="(max-width: 768px) 45vw, 45vw" />}
                // On wide screens her second shot sits on the back of the card instead.
                b={second && <div className="absolute inset-0 lg:hidden"><Portrait companion={pick} src={second} sizes="(max-width: 768px) 45vw, 45vw" /></div>}
              />
            </div>
          </ViewTransition>
        </Link>

        <div className="flex min-w-0 flex-1 md:bg-paper md:text-ink">
          <div className="@container flex min-w-0 flex-1 flex-col md:p-8 lg:p-10">
            <p className="flex items-center gap-2 text-small font-medium text-paper/80 md:text-body md:text-ink">
              Tonight&apos;s pick
              {pick.online && (
                <>
                  <span aria-hidden className="opacity-50">·</span>
                  <span className="live-dot size-2 rounded-full bg-live" aria-hidden /> Online
                </>
              )}
            </p>
            <p className="mt-3 hidden max-w-[22ch] text-[clamp(1.25rem,0.8rem+0.9vw,1.75rem)] leading-[1.15] font-medium [overflow-wrap:anywhere] md:block">
              {/[.!?…]$/.test(pick.tagline) ? pick.tagline : `${pick.tagline}.`}
            </p>
            <h2 className="mt-auto font-display [text-wrap:balance]" style={fitName(pick.name, "5.5rem", "0rem", 2)}>
              {pick.name}
            </h2>
            <Facts className="mt-2 text-small text-paper/70 tabular md:mt-4 md:text-lead md:text-ink/70" items={[pick.age, pick.city, pick.sign]} />
            <p className="mt-2 line-clamp-2 text-small text-muted md:hidden">{pick.tagline}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row md:mt-8">
              <ButtonLink href={`/app/${pick.id}/chat`} size="sm" className="min-w-0 sm:flex-1 md:h-11 md:px-6 md:text-body lg:flex-initial lg:px-10">
                <ChatCircleDots weight="fill" className="size-5 shrink-0" aria-hidden />
                <span className="truncate">Chat</span>
              </ButtonLink>
              <SaveButton id={pick.id} name={pick.name} label className="h-10! text-small! md:h-11! md:text-body!" />
            </div>
          </div>
          {second && (
            <Link href={`/app/${pick.id}`} tabIndex={-1} aria-hidden className="relative hidden w-[38%] shrink-0 overflow-hidden bg-ink-3 lg:block">
              <Portrait companion={pick} src={second} sizes="25vw" />
            </Link>
          )}
        </div>
      </section>

      {/* Filters: one row, scrolls sideways on phones; density toggle pinned at its end. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 -mx-4 mt-8 flex items-center gap-2 bg-ink px-4 py-3 md:top-20 md:mx-0 md:mt-12 md:px-0">
        <div role="group" aria-label="Filter companions" // The right edge fades on phones so the rail reads as scrollable rather than cut off.
          className="-ml-4 flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain pr-8 pl-4 [mask-image:linear-gradient(90deg,#000_calc(100%-2rem),transparent)] [scrollbar-width:none] md:ml-0 md:pr-0 md:pl-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden">
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
          onClick={() => switchDensity(density === 1 ? 2 : 1)}
          aria-label={density === 1 ? "Show more per row" : "Show bigger cards"}
          className="press grid size-10 shrink-0 place-items-center bg-ink-3 text-paper hover:bg-ink-4"
        >
          {density === 1 ? <SquaresFour size={20} aria-hidden /> : <Square size={20} aria-hidden />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "companion" : "companions"}
      </p>

      {shown.length ? (
        <MotionConfig reducedMotion="user">
          <style>{stagger}</style>
          <div className={`${boardGrid[density]} stagger-${density} relative`}>
            <AnimatePresence mode="popLayout" initial={false}>
              {cells(shown, density === 2).map(({ key, node }, i) => (
                <motion.div
                  key={key}
                  // Only filter changes re-flow with motion; the density swap has its own view transition.
                  layout="position"
                  layoutDependency={filterKey}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  transition={{ default: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 5) * 0.06 }, layout: { type: "spring", stiffness: 420, damping: 40 } }}
                >
                  {node}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </MotionConfig>
      ) : (
        <div className="py-20 md:py-32">
          <p className="font-display text-head">Nobody like that</p>
          <p className="mt-3 max-w-[40ch] text-body text-paper">No one on the board matches all of those right now. Try fewer filters.</p>
          <Button variant="paper" className="mt-6" onClick={() => setF(everyone)}>
            Show everyone
          </Button>
        </div>
      )}
    </main>
  );
}
