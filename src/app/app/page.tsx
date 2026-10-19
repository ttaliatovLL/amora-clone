"use client";

import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Fire, Heart, MoonStars, Sparkle, SquaresFour } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState } from "react";
import { Portrait } from "@/components/portrait";
import { Avatar, Chip, CompanionCard, OnlinePill, Tags } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";

const stories = [...companions.filter((c) => c.isNew), ...companions.filter((c) => c.online && !c.isNew)];
const vibeIcon: Record<(typeof vibes)[number], Icon> = { Sweet: Heart, Playful: Sparkle, Mysterious: MoonStars, Bold: Fire };
// shortcut: fixed editor's pick until there's a ranking signal.
const pick = companions.find((c) => c.id === "katya")!;
// Every seventh card opens up into a landscape feature, so the grid has a rhythm instead of a wall.
const isWide = (i: number) => i % 7 === 4;

export default function Discover() {
  const [vibe, setVibe] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const shown = companions.filter((c) => (!vibe || c.vibe === vibe) && (!onlineOnly || c.online));
  const online = companions.filter((c) => c.online).length;
  const clear = () => {
    setVibe(null);
    setOnlineOnly(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-3 pb-36 sm:px-8 md:pt-10 md:pb-16">
      <div className="rise flex items-end justify-between gap-4">
        <h1 className="font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-[0.95]">
          Who&apos;s up
          <br className="sm:hidden" /> <em>tonight.</em>
        </h1>
        <p className="mb-1.5 flex shrink-0 items-center gap-1.5 text-[0.8125rem] text-muted tabular-nums">
          <span className="live-dot size-1.5 rounded-full bg-sage" aria-hidden />
          {online} online
        </p>
      </div>

      <section aria-label="Online and new" className="rise -mx-4 mt-6 sm:-mx-8" style={{ ["--i" as string]: 1 }}>
        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8">
          {stories.map((c) => (
            <Link key={c.id} href={`/app/${c.id}`} className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 transition-transform active:scale-[0.94]">
              <Avatar companion={c} size="lg" story showOnline={false} />
              <span className={`w-full truncate text-center text-[0.75rem] ${c.isNew ? "text-blush" : "text-muted"}`}>{c.isNew ? "New" : c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tonight's pick: one cinematic moment before the grid. */}
      <Link
        href={`/app/${pick.id}`}
       
        className="rise group relative mt-6 block aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift transition-transform duration-200 ease-out active:scale-[0.99] sm:aspect-[16/8]"
        style={{ ["--i" as string]: 2 }}
      >
        <Portrait companion={pick} priority sizes="(max-width: 640px) 100vw, 1100px" className="transition-transform duration-[1400ms] ease-out-expo sm:object-[50%_22%] [@media(hover:hover)]:group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-black/20" />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/12" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="glass inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-ivory">
            <Sparkle weight="fill" className="size-3.5 text-blush" aria-hidden />
            Tonight&apos;s pick
          </span>
          {pick.online && <OnlinePill />}
        </div>
        <div className="glass absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 rounded-[1.5rem] p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[24rem] sm:p-5">
          <div className="min-w-0">
            <p className="font-display text-[2.25rem] leading-none">
              {pick.name}
              <span className="ml-2 text-[0.55em] font-normal text-ivory/55">{pick.age}</span>
            </p>
            <p className="mt-1.5 line-clamp-2 text-sm text-ivory/75">{pick.tagline}.</p>
            <Tags tags={pick.tags} className="mt-3" />
          </div>
          <span className="pearl chrome grid size-12 shrink-0 place-items-center rounded-full transition-transform duration-200 group-active:scale-95" aria-hidden>
            <ArrowRight weight="bold" className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </span>
          <span className="sr-only">Say hi to {pick.name}</span>
        </div>
      </Link>

      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 mt-8 py-3 sm:-mx-8 md:top-0">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink-950 via-ink-950/85 to-transparent" aria-hidden />
        <div className="relative flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:px-8" role="group" aria-label="Filter companions">
          <Chip pressed={vibe === null && !onlineOnly} onClick={clear}>
            <SquaresFour weight="regular" className="size-4" aria-hidden />
            All
          </Chip>
          <Chip pressed={onlineOnly} onClick={() => setOnlineOnly(!onlineOnly)}>
            <span className="size-2 rounded-full bg-sage" aria-hidden />
            Online now
          </Chip>
          {vibes.map((v) => {
            const I = vibeIcon[v];
            return (
              <Chip key={v} pressed={vibe === v} onClick={() => setVibe(vibe === v ? null : v)}>
                <I weight={vibe === v ? "fill" : "regular"} className="size-4" aria-hidden />
                {v}
              </Chip>
            );
          })}
        </div>
      </div>

      <p className="mt-1 text-[0.8125rem] text-faint tabular-nums" aria-live="polite">
        {shown.length} {shown.length === 1 ? "companion" : "companions"}
      </p>

      {shown.length ? (
        <div className="mt-3 grid grid-flow-dense grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((c, i) => (
            <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} priority={i < 4} wide={isWide(i)} morph className="reveal" />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <MoonStars weight="light" className="mx-auto size-12 text-muted" aria-hidden />
          <p className="mt-4 font-display text-2xl">Nobody like that is up right now.</p>
          <button type="button" onClick={clear} className="mt-3 text-blush underline underline-offset-4">
            Show everyone
          </button>
        </div>
      )}
    </main>
  );
}
