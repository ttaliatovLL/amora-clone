"use client";

import { boardGrid, useDensity, useHydrated } from "@/components/board/density";
import { ButtonLink, CompanionCard } from "@/components/ui";
import { companions } from "@/lib/companions";
import { useProgress } from "@/lib/progress";

// shortcut: the first four online companions stand in for real suggestions (one full row at 2 and 4 columns).
const suggested = companions.filter((c) => c.online).slice(0, 4);

/** The member's own board. Renders a quiet shell until hydrated, so nobody sees the empty state flash. */
export function SavedBoard() {
  const ids = useProgress().saved;
  const ready = useHydrated();
  const density = useDensity();
  const saved = ids.map((id) => companions.find((c) => c.id === id)).filter((c) => c !== undefined);

  if (!ready) return <main className="min-h-[60svh]" />;
  const size = density === 2 ? "tile" : "large";

  return (
    <main className="page">
      {saved.length ? (
        <>
          <header className="rise flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="font-display text-title">Your board</h1>
            <p className="text-body text-muted tabular md:mb-2">
              <span className="text-paper">{saved.length}</span> {saved.length === 1 ? "companion" : "companions"} saved
            </p>
          </header>
          <div className={`${boardGrid[density]} mt-6 md:mt-10`}>
            {saved.map((c, i) => (
              <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} size={size} morph priority={i < 4} className={i < 8 ? "rise" : "reveal"} style={{ ["--i" as string]: i + 1 }} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Wide screens: the headline holds the left, the way back sits at its foot on the right, like the board's header. */}
          <header className="rise flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-16">
            <h1 className="font-display text-title">
              Nobody
              <br /> here yet
            </h1>
            <div className="md:mb-2 md:max-w-[32ch]">
              <p className="max-w-[38ch] text-body text-paper">Tap the bookmark on any card and she stays here, a tap away.</p>
              <ButtonLink href="/app" variant="paper" size="sm" arrow className="mt-5">
                Go to the board
              </ButtonLink>
            </div>
          </header>
          <section aria-label="Up tonight" className="mt-12 md:mt-16">
            <h2 className="rise text-lead text-paper" style={{ ["--i" as string]: 1 }}>Up tonight, to start with</h2>
            <div className={`${boardGrid[density]} mt-4 md:mt-6`}>
              {suggested.map((c, i) => (
                <CompanionCard key={c.id} companion={c} href={`/app/${c.id}`} size={size} morph priority={i < 2} className="rise" style={{ ["--i" as string]: i + 2 }} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
