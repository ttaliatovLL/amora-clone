"use client";

import { MotionConfig } from "motion/react";
import { useState, type ReactNode } from "react";
import { Deck } from "@/components/discover/deck";
import { ViewSwitch } from "@/components/discover/view-switch";
import { Chip, CompanionCard } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";

type Vibe = (typeof vibes)[number];
// shortcut: online first, then the board's order, until there is a ranking signal.
const deck = [...companions.filter((c) => c.online), ...companions.filter((c) => !c.online)];
const online = companions.filter((c) => c.online);
const fresh = companions.filter((c) => c.isNew);

/** Discover: the deck up top (one at a time), rails below for browsing by mood. */
export function Discover() {
  const [vibe, setVibe] = useState<Vibe>(vibes[0]);
  const byVibe = companions.filter((c) => c.vibe === vibe);

  return (
    <MotionConfig reducedMotion="user">
      <main className="page">
        <header className="rise flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-title max-md:sr-only">
            One at
            <br /> a time
          </h1>
          <ViewSwitch on="discover" className="md:mb-2" />
        </header>

        <section aria-label="Deck" className="rise mt-6 grid gap-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)_minmax(0,1fr)] lg:items-end" style={{ ["--i" as string]: 1 }}>
          <div className="hidden lg:block">
            <p className="max-w-[30ch] text-lead text-paper">Drag her right to save, left to pass. Everyone you pass stays on the board.</p>
          </div>
          <Deck list={deck} />
          <dl className="hidden gap-2 text-body text-muted lg:grid lg:justify-self-end">
            {[
              ["←", "Skip"],
              ["→ or S", "Save"],
              ["U", "Undo"],
            ].map(([k, v]) => (
              <div key={v} className="flex items-center gap-3">
                <dt className="inline-flex h-8 min-w-8 items-center justify-center bg-ink-3 px-2 text-small text-paper">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Rail title="Online now" note={`${online.length} up tonight`} list={online} />
        <Rail title="New this week" list={fresh} />
        <Rail
          title="By vibe"
          list={byVibe}
          controls={
            <div role="group" aria-label="Vibe" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {vibes.map((v) => (
                <Chip key={v} pressed={vibe === v} onClick={() => setVibe(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          }
          railKey={vibe}
        />
      </main>
    </MotionConfig>
  );
}

function Rail({ title, note, list, controls, railKey }: { title: string; note?: string; list: typeof companions; controls?: ReactNode; railKey?: string }) {
  if (!list.length) return null;
  return (
    <section aria-label={title} className="mt-16 md:mt-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-head">{title}</h2>
        {note && <p className="text-body text-muted tabular">{note}</p>}
        {controls}
      </div>
      {/* Scrolls sideways; snaps card to card. Re-keyed on a vibe change so the new set rises in. */}
      <ul key={railKey} className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-8 md:scroll-px-0 md:gap-3 md:px-0 [&::-webkit-scrollbar]:hidden">
        {list.map((c, i) => (
          <li key={c.id} className="rise w-[42vw] shrink-0 snap-start sm:w-52 lg:w-60" style={{ ["--i" as string]: Math.min(i, 6) }}>
            <CompanionCard companion={c} href={`/app/${c.id}`} size="tile" />
          </li>
        ))}
      </ul>
    </section>
  );
}
