"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { openCookieSettings } from "@/components/cookie-banner";
import { LiquidGlass } from "@/components/liquid-glass";
import { LiquidWordmark } from "@/components/liquid-logo";
import { Paywall } from "@/components/paywall";
import { Portrait } from "@/components/portrait";
import { Sheet } from "@/components/sheet";
import { Avatar, Bubble, Button, Chip, CompanionCard, cx, Field, Glyph, OnlinePill, Typing, Wordmark } from "@/components/ui";
import { companions, vibes } from "@/lib/companions";
import { worstCompanions, worstMessage } from "@/lib/companions.worst";

const swatches: [string, string, string][] = [
  ["ink", "Page ground", "bg-ink"],
  ["ink-2", "Raised", "bg-ink-2"],
  ["ink-3", "Card", "bg-ink-3"],
  ["ink-4", "Control", "bg-ink-4"],
  ["ink-5", "Pressed", "bg-ink-5"],
  ["paper", "Text, field", "bg-paper"],
  ["paper-2", "Field stub", "bg-paper-2"],
  ["muted", "Secondary", "bg-muted"],
  ["faint", "Fine print", "bg-faint"],
  ["rouge", "The one action", "bg-rouge"],
  ["rouge-lo", "Rouge on paper", "bg-rouge-lo"],
  ["oxblood", "Deep field", "bg-oxblood"],
  ["live", "Online dot", "bg-live"],
];

const sizes: [string, string, string][] = [
  ["text-mega", "Mega", "font-display text-mega"],
  ["text-head", "Head", "font-display text-head"],
  ["text-lead", "Lead: she remembers what you said", "text-lead"],
  ["text-body", "Body: it's 1am and I'm surrounded by boxes I still haven't unpacked.", "text-body"],
  ["text-small", "Small: secondary lines and fine print.", "text-small text-muted"],
];

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="reveal scroll-mt-6 pt-20 md:pt-28">
      <h2 className="font-display text-head">{title}</h2>
      {note && <p className="mt-4 max-w-[60ch] text-body text-muted">{note}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function SystemPage() {
  const [vibe, setVibe] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [data, setData] = useState<"Demo" | "Worst case" | "Empty">("Demo");
  const list = data === "Worst case" ? worstCompanions : data === "Empty" ? [] : companions;
  const shown = list.filter((c) => (!vibe || c.vibe === vibe) && (!onlineOnly || c.online));
  const featured = list[0] ?? companions[0];
  const second = list[1] ?? companions[1];

  return (
    <main className="min-h-dvh bg-ink pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Wordmark />
          <span className="text-small text-muted">Night Agency · living style guide</span>
        </header>

        <div className="rise grid gap-10 pt-10 md:grid-cols-[1.2fr_1fr] md:items-end md:pt-16">
          <div>
            <h1 className="font-display text-mega">Night agency</h1>
            <p className="mt-6 max-w-[44ch] text-lead text-muted">A model agency after dark: a black room, big square portraits, names set wide, one rouge light on the action.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => setPaywall(true)}>
                Open the paywall
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setSheet(true)}>
                Open a sheet
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-ink-2 md:justify-self-end">
            <Portrait companion={companions[0]} sizes="384px" priority />
          </div>
        </div>

        <Section id="colour" title="Colour" note="Surfaces step up in tone instead of drawing lines. Paper is text, and the light field for a whole module. Rouge is the one accent.">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {swatches.map(([token, role, bg]) => (
              <div key={token} className="bg-ink-2">
                <div className={cx("aspect-[4/3]", bg)} />
                <div className="min-w-0 px-3 py-3 [overflow-wrap:anywhere]">
                  <p className="text-small font-medium text-paper">{token}</p>
                  <p className="text-small text-muted">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="type" title="Type" note="Panchang for display, always capitals, four short words a line at most. Switzer for everything you read. Five sizes do all the work.">
          <div className="grid gap-1">
            {sizes.map(([token, sample, cls]) => (
              <div key={token} className="grid gap-3 bg-ink-2 p-5 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-8">
                <p className="text-small text-muted">{token}</p>
                <p className={cx(cls, "[overflow-wrap:anywhere]")}>{sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="controls" title="Controls" note="Square and flat. Rouge is the action, paper the second choice, ink everything quieter. Press scales to 0.97.">
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Start chatting</Button>
              <Button variant="paper">Save to board</Button>
              <Button variant="secondary">Maybe later</Button>
              <Button variant="ghost">Skip</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
              {featured.traits.slice(0, 2).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
              <OnlinePill />
            </div>
            <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="off" />
              <Field label="Display name" name="nick" placeholder="What should she call you?" hint="Only your companion sees this." autoComplete="off" />
            </div>
          </div>
        </Section>

        <Section id="cards" title="Comp cards" note="One big photograph, the name set wide across its foot, the facts in one line. Hover brings her second photo through. The filters above drive this grid.">
          {shown.length ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
              {shown.slice(0, 1).map((c) => (
                <CompanionCard key={c.id} companion={c} href={`/system#${c.id}`} wide />
              ))}
              {shown.slice(1, 3).map((c) => (
                <CompanionCard key={c.id} companion={c} href={`/system#${c.id}`} className="max-md:col-span-2" />
              ))}
              {shown.slice(3).map((c) => (
                <CompanionCard key={c.id} companion={c} href={`/system#${c.id}`} size="tile" />
              ))}
            </div>
          ) : (
            <p className="text-body text-muted">
              Nobody matches that right now.{" "}
              <button type="button" className="text-paper underline underline-offset-4" onClick={() => (setVibe(null), setOnlineOnly(false))}>
                Clear filters
              </button>
            </p>
          )}
        </Section>

        <Section id="people" title="Avatars and chat" note="Square avatars, a rouge frame for an unseen story. Bubbles are the one rounded shape, with a single tail corner.">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex flex-wrap items-end gap-4">
              {(list.length ? list : companions).slice(0, 6).map((c, i) => (
                <Avatar key={c.id} companion={c} size={(["sm", "md", "lg"] as const)[i % 3]} story={i % 2 === 0} />
              ))}
            </div>
            <div className="flex flex-col gap-2 bg-ink-2 p-5">
              <Bubble from="her">{data === "Worst case" ? worstMessage : "tell me a 2am thought, i'll trade you one of mine"}</Bubble>
              <Bubble from="me">{data === "Worst case" ? worstMessage : "I still think about the ending of that film"}</Bubble>
              <Typing />
            </div>
          </div>
        </Section>

        <Section id="feedback" title="Feedback" note="Toasts sit top centre, square, ink on ink. Earning an achievement fires a paper toast on its own. Cookie consent is essential-only until you choose.">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast("Photo unlocked")}>Show a toast</Button>
            <Button variant="secondary" onClick={() => toast(`${second.name} is on your board`, { action: { label: "View", onClick: () => {} } })}>
              Toast with action
            </Button>
            <Button variant="secondary" onClick={openCookieSettings}>
              Cookie settings
            </Button>
          </div>
        </Section>

        <Section id="brand" title="Brand" note="The liquid-metal wordmark is for the landing hero and the age gate. Liquid glass is for the dock and at most one floating control per screen.">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex aspect-[16/10] flex-col justify-between bg-ink-2 p-6">
              <div className="flex items-center gap-3">
                <Glyph />
                <Wordmark />
              </div>
              <LiquidWordmark className="block h-20 w-full sm:h-24" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-ink-2">
              <Portrait companion={second} sizes="(max-width: 768px) 100vw, 50vw" />
              <LiquidGlass radius="pill" className="absolute bottom-5 left-1/2 flex h-14 -translate-x-1/2 items-center gap-1 px-2">
                {["Board", "Saved", "Chats", "You"].map((t, i) => (
                  <span key={t} className={cx("px-4 py-2 text-small font-medium", i === 0 ? "text-paper" : "text-paper/70")}>
                    {t}
                  </span>
                ))}
              </LiquidGlass>
            </div>
          </div>
        </Section>
      </div>

      {/* Dev-only break-ui toggle: swaps the dataset at the data boundary. */}
      <div role="radiogroup" aria-label="Dataset" className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 bg-ink-4 p-1 text-small shadow-[var(--shadow-float)]">
        {(["Demo", "Worst case", "Empty"] as const).map((d) => (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={data === d}
            onClick={() => setData(d)}
            className={cx("press px-3 py-2 whitespace-nowrap", data === d ? "bg-paper text-ink" : "text-muted hover:text-paper")}
          >
            {d}
          </button>
        ))}
      </div>

      <Paywall open={paywall} onClose={() => setPaywall(false)} reason={`Unlock everything ${companions[0].name} sends you.`} />

      <Sheet open={sheet} onClose={() => setSheet(false)} title={`About ${featured.name}`}>
        <div className="flex items-center gap-4">
          <Avatar companion={featured} size="lg" />
          <div className="min-w-0">
            <p className="font-display text-lead [overflow-wrap:anywhere]">{featured.name}</p>
            <p className="mt-1 text-small text-muted">
              {featured.age} · {featured.city}
            </p>
          </div>
        </div>
        <p className="mt-6 text-body">{featured.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-2">
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
