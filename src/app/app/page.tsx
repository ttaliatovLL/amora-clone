"use client";

import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Fire, Heart, MoonStars, Sparkle, SquaresFour } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState } from "react";
import { Portrait } from "@/components/portrait";
import { Avatar, Chip, CompanionCard } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";

const stories = [...companions.filter((c) => c.isNew), ...companions.filter((c) => c.online && !c.isNew)];
const vibeIcon: Record<(typeof vibes)[number], Icon> = { Sweet: Heart, Playful: Sparkle, Mysterious: MoonStars, Bold: Fire };
// shortcut: fixed editor's pick until there's a ranking signal.
const pick = companions.find((c) => c.id === "katya")!;

export default function Discover() {
  const [vibe, setVibe] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const shown = companions.filter((c) => (!vibe || c.vibe === vibe) && (!onlineOnly || c.online));
  const clear = () => {
    setVibe(null);
    setOnlineOnly(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-32 sm:px-8 md:pt-10 md:pb-16">
      <h1 className="font-display text-[clamp(2.5rem,8vw,4rem)] leading-[0.92]">
        Who&apos;s up <em className="text-champagne">tonight?</em>
      </h1>

      <section aria-label="Online and new" className="-mx-4 mt-7 sm:-mx-8">
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8">
          {stories.map((c) => (
            <Link key={c.id} href={`/app/${c.id}`} className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 transition-transform active:scale-[0.96]">
              <Avatar companion={c} size="lg" story showOnline={false} />
              <span className="w-full truncate text-center text-xs text-muted">{c.isNew ? `New · ${c.name}` : c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tonight's pick: one editorial moment before the grid. */}
      <Link
        href={`/app/${pick.id}`}
        className="aura group relative mt-8 grid overflow-hidden rounded-[2rem] ring-1 ring-gold/25 transition-transform active:scale-[0.99] sm:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative z-[2] order-2 flex flex-col justify-end p-6 sm:order-1 sm:p-9">
          <p className="flex items-center gap-1.5 text-sm text-champagne">
            <Sparkle weight="fill" className="size-4" aria-hidden />
            Tonight&apos;s pick
          </p>
          <p className="mt-3 font-display text-5xl leading-none sm:text-6xl">{pick.name}</p>
          <p className="mt-3 max-w-[34ch] text-muted">{pick.tagline}.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm text-ivory">
            Say hi
            <ArrowRight weight="light" className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
        <div className="relative order-1 aspect-[16/11] sm:order-2 sm:aspect-auto sm:min-h-80">
          <Portrait companion={pick} sizes="(max-width: 640px) 100vw, 480px" className="transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-linear-to-t from-ink-900 via-transparent to-transparent sm:bg-linear-to-r" />
        </div>
      </Link>

      <div className="sticky top-14 z-30 -mx-4 mt-8 bg-ink-950/70 py-3 backdrop-blur-xl sm:-mx-8 md:top-0">
        <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:px-8" role="group" aria-label="Filter companions">
          <Chip pressed={vibe === null && !onlineOnly} onClick={clear}>
            <SquaresFour weight="light" className="size-4" aria-hidden />
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
                <I weight={vibe === v ? "fill" : "light"} className="size-4" aria-hidden />
                {v}
              </Chip>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-sm text-faint" aria-live="polite">
        {shown.length} {shown.length === 1 ? "companion" : "companions"}
      </p>

      {shown.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((c, i) => (
            <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <MoonStars weight="thin" className="mx-auto size-14 text-gold" aria-hidden />
          <p className="mt-4 font-display text-3xl">Nobody like that is up right now.</p>
          <button type="button" onClick={clear} className="mt-4 text-champagne underline underline-offset-4">
            Show everyone
          </button>
        </div>
      )}
    </main>
  );
}
