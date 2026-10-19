"use client";

import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { Portrait } from "@/components/portrait";
import { Avatar, Bubble, Button, Chip, CompanionCard, Field, Wordmark } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";
import { worstCompanions, worstMessage } from "@/lib/companions.worst";

const swatches = [
  ["ink-950", "Night", "bg-ink-950"],
  ["ink-800", "Raised", "bg-ink-800"],
  ["glass", "Liquid glass", "glass"],
  ["pearl", "Action", "pearl chrome"],
  ["gilt", "Premium rim", "panel gilt"],
  ["blush", "Emphasis", "bg-blush"],
  ["rose", "Destructive", "bg-rose"],
  ["ivory", "Text", "bg-ivory"],
  ["muted", "Secondary text", "bg-muted"],
] as const;

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-10 pb-14">
      <h2 className="font-display text-3xl text-ivory">{title}</h2>
      {note && <p className="mt-2 max-w-[60ch] text-muted">{note}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function SystemPage() {
  const [vibe, setVibe] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [data, setData] = useState<"Demo" | "Worst case" | "Empty">("Demo");
  const list = data === "Worst case" ? worstCompanions : data === "Empty" ? [] : companions;
  const shown = list.filter((c) => (!vibe || c.vibe === vibe) && (!onlineOnly || c.online));
  const featured = companions[0];

  return (
    <main className="grain room min-h-dvh">
      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Wordmark />
          <span className="text-sm text-faint">Graphite · design system</span>
        </header>

        {/* Opening: the system shown at work, not described. */}
        <div className="grid items-end gap-10 pt-8 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-16">
          <div>
            <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
              After hours,
              <br />
              <em>members only.</em>
            </h1>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">
              Graphite glass, pearl for action, polished steel on what matters, blush where she is. Gold only as a rim on Premium.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setSheet(true)}>
                Open a sheet
              </Button>
              <Button size="lg" variant="secondary">
                Secondary
              </Button>
            </div>
          </div>
          <div className="vignette relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-lift">
            <Portrait companion={featured} sizes="384px" />
          </div>
        </div>

        <Section title="Discovery" note="Stories row for who is online or new, then filters and the grid. Filters work.">
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {list
              .filter((c) => c.online || c.isNew)
              .map((c) => (
                <button key={c.id} type="button" className="flex shrink-0 flex-col items-center gap-2 active:scale-[0.97] transition-transform">
                  <Avatar companion={c} size="lg" story showOnline={false} />
                  <span className="text-xs text-muted">{c.name}</span>
                </button>
              ))}
          </div>

          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <Chip pressed={vibe === null} onClick={() => setVibe(null)}>
              All
            </Chip>
            {vibes.map((v) => (
              <Chip key={v} pressed={vibe === v} onClick={() => setVibe(vibe === v ? null : v)}>
                {v}
              </Chip>
            ))}
            <Chip pressed={onlineOnly} onClick={() => setOnlineOnly(!onlineOnly)}>
              Online now
            </Chip>
          </div>

          {shown.length ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((c) => (
                <CompanionCard key={c.id} companion={c} href={`/system#${c.id}`} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-muted">
              Nobody matches that right now.{" "}
              <button type="button" className="text-blush underline underline-offset-4" onClick={() => (setVibe(null), setOnlineOnly(false))}>
                Clear filters
              </button>
            </p>
          )}
        </Section>

        <Section title="Type" note="General Sans throughout: medium and tight for names and headlines, regular for everything you read in a hurry.">
          <div className="space-y-6">
            <p className="font-display text-6xl leading-none">Emma</p>
            <p className="font-display text-3xl">She remembered <em>what you said.</em></p>
            <p className="max-w-[60ch] text-lg leading-relaxed text-ivory">
              its 1am and im surrounded by boxes i still havent unpacked, in a flat that doesnt feel like mine yet. tell me a 2am thought, i&apos;ll trade u one of mine
            </p>
            <p className="text-sm text-muted">Secondary text · 14px · muted</p>
            <p className="text-[0.8125rem] text-faint">Fine print · discreet billing · cancel anytime</p>
          </div>
        </Section>

        <Section title="Colour">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {swatches.map(([token, role, bg]) => (
              <div key={token}>
                <div className={`aspect-square rounded-2xl border border-line ${bg}`} />
                <p className="mt-2 text-sm text-ivory">{role}</p>
                <p className="text-xs text-faint">{token}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Controls">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Start chatting</Button>
            <Button variant="secondary">Maybe later</Button>
            <Button variant="ghost">Skip</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {featured.traits.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="mt-10 grid max-w-md gap-6">
            <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field label="Display name" name="nick" placeholder="What should she call you?" hint="Only your companion sees this." />
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {data === "Worst case" && (
              <div className="mb-6 flex max-w-sm flex-col gap-2">
                <Bubble from="her">{worstMessage}</Bubble>
                <Bubble from="me">{worstMessage}</Bubble>
              </div>
            )}
            {companions.slice(0, 5).map((c, i) => (
              <Avatar key={c.id} companion={c} size={(["sm", "md", "lg"] as const)[i % 3]} />
            ))}
          </div>
        </Section>
      </div>

      {/* Dev-only break-ui toggle: swaps the dataset at the data boundary. */}
      <div role="radiogroup" aria-label="Dataset" className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full bg-neutral-200 p-1 font-[system-ui] text-xs text-neutral-700 shadow">
        {(["Demo", "Worst case", "Empty"] as const).map((d) => (
          <button key={d} role="radio" aria-checked={data === d} onClick={() => setData(d)} className={`rounded-full px-3 py-1.5 whitespace-nowrap ${data === d ? "bg-white text-neutral-900 shadow-sm" : ""}`}>
            {d}
          </button>
        ))}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={`About ${featured.name}`}>
        <div className="flex items-center gap-4">
          <Avatar companion={featured} size="lg" />
          <div>
            <p className="font-display text-3xl leading-none">{featured.name}</p>
            <p className="mt-1 text-sm text-muted">
              {featured.age} · {featured.city}
            </p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-ivory">
          Junior editor by day, weekend ceramicist, very slow coffee drinker. New in town, still unpacking. Loves jazz vinyl, terrible films, and conversations that
          last past midnight.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {featured.interests.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <Button size="lg" className="mt-8 w-full" onClick={() => setSheet(false)}>
          Keep talking
        </Button>
      </Sheet>
    </main>
  );
}
