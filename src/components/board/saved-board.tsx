"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import { boardGrid, useHydrated } from "@/components/board/density";
import { ButtonLink, CompanionCard } from "@/components/ui";
import { companions } from "@/lib/companions";
import { useProgress } from "@/lib/progress";

// shortcut: the first three online companions stand in for real suggestions.
const suggested = companions.filter((c) => c.online).slice(0, 3);

/** The member's own board. Renders a quiet shell until hydrated, so nobody sees the empty state flash. */
export function SavedBoard() {
  const ids = useProgress().saved;
  const ready = useHydrated();
  const saved = ids.map((id) => companions.find((c) => c.id === id)).filter((c) => c !== undefined);

  if (!ready) return <main className="min-h-[60svh]" />;

  return (
    <main className="mx-auto max-w-[1600px] pt-4 pb-10 md:px-8 md:pt-10 md:pb-20">
      {saved.length ? (
        <>
          <header className="rise flex flex-col gap-3 px-4 md:px-0 xl:flex-row xl:items-end xl:justify-between">
            <h1 className="font-display text-[clamp(2.25rem,calc((100vw-2rem)/7.8),7.5rem)] leading-[0.92]">
              Your board
            </h1>
            <p className="text-body text-muted tabular xl:mb-3">
              <span className="text-paper">{saved.length}</span> {saved.length === 1 ? "companion" : "companions"} saved
            </p>
          </header>
          <div className={`${boardGrid[1]} mt-6 md:mt-10`}>
            {saved.map((c, i) => (
              <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} morph priority={i < 2} className={i < 3 ? "rise" : "reveal"} style={{ ["--i" as string]: i + 1 }} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Wide screens: the headline holds the left, the way back sits at its foot on the right, like the board's header. */}
          <header className="rise flex flex-col gap-4 px-4 md:px-0 xl:flex-row xl:items-end xl:justify-between xl:gap-16">
            <h1 className="font-display text-[clamp(2.25rem,calc((100vw-2rem)/7.8),7.5rem)] leading-[0.92]">
              Nobody
              <br /> here yet
            </h1>
            <div className="xl:mb-3 xl:max-w-[30ch]">
              <p className="max-w-[38ch] text-body text-paper md:text-lead">Tap the bookmark on any card and she stays here, a tap away.</p>
              <ButtonLink href="/app" variant="paper" className="mt-6">
                Go to the board
                <ArrowRight weight="bold" className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </header>
          <section aria-label="Up tonight" className="mt-12 md:mt-24">
            <h2 className="rise px-4 text-lead text-paper md:px-0" style={{ ["--i" as string]: 1 }}>Up tonight, to start with</h2>
            <div className={`${boardGrid[1]} mt-4`}>
              {suggested.map((c, i) => (
                <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} morph priority={i < 2} className="rise" style={{ ["--i" as string]: i + 2 }} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
