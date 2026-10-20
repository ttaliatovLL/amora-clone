"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { openCookieSettings } from "@/components/cookie-banner";
import { LiquidGlass } from "@/components/liquid-glass";
import { LiquidWordmark } from "@/components/liquid-logo";
import { Paywall } from "@/components/paywall";
import { Portrait } from "@/components/portrait";
import { Sheet } from "@/components/sheet";
import { ChatCircleDots } from "@phosphor-icons/react/ssr";
import { EARNED_EVENT } from "@/lib/progress";
import { Avatar, Bubble, Button, ButtonLink, Chip, CompanionCard, cx, Field, Glyph, OnlinePill, Segmented, Switch, Tags, Typing, Wordmark } from "@/components/ui";
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

const brandFiles: { name: string; role: string; file: string; ext: string[]; field?: "paper" }[] = [
  { name: "Wordmark", role: "Paper on ink; the default", file: "amora-wordmark", ext: ["svg", "png"] },
  { name: "Wordmark, ink", role: "For paper and light fields", file: "amora-wordmark-ink", ext: ["svg", "png"], field: "paper" },
  { name: "Mark", role: "The A and one rouge square", file: "amora-mark", ext: ["svg", "png"] },
  { name: "App icon", role: "Ink square; PWA, Apple touch, maskable", file: "amora-icon", ext: ["svg", "png"] },
  { name: "Liquid wordmark", role: "Still from the real shader, transparent", file: "amora-liquid", ext: ["png"] },
];

const sizes: [string, string, string][] = [
  ["text-mega", "Mega", "font-display text-mega"],
  ["text-title", "Page title", "font-display text-title"],
  ["text-head", "Head", "font-display text-head"],
  ["text-lead", "Lead: she remembers what you said", "text-lead"],
  ["text-body", "Body: it's 1am and I'm surrounded by boxes I still haven't unpacked.", "text-body"],
  ["text-small", "Small: secondary lines and fine print.", "text-small text-muted"],
];

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-small text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="reveal scroll-mt-6 pt-16 md:pt-24">
      <h2 className="font-display text-head">{title}</h2>
      {note && <p className="mt-3 max-w-[60ch] text-body text-muted md:mt-4">{note}</p>}
      <div className="mt-6 md:mt-8">{children}</div>
    </section>
  );
}

export default function SystemPage() {
  const [vibe, setVibe] = useState<string | null>(null);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [data, setData] = useState<"Demo" | "Worst case" | "Empty">("Demo");
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(true);
  const [annual, setAnnual] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const list = data === "Worst case" ? worstCompanions : data === "Empty" ? [] : companions;
  const shown = list.filter((c) => (!vibe || c.vibe === vibe) && (!onlineOnly || c.online));
  const featured = list[0] ?? companions[0];
  const second = list[1] ?? companions[1];

  return (
    <main className="min-h-dvh bg-ink">
      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <Wordmark className="md:text-[1.125rem]" />
        <span className="truncate text-small text-muted">Living style guide</span>
      </header>
      <div className="page pb-32!">
        <div className="rise grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-10">
          <div>
            <h1 className="font-display text-title">Night agency</h1>
            <p className="mt-4 max-w-[44ch] text-lead text-muted md:mt-6">A model agency after dark: a black room, big square portraits, names set wide, one rouge light on the action.</p>
            <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
              <Button size="lg" onClick={() => setPaywall(true)}>
                Open the paywall
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setSheet(true)}>
                Open a sheet
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden bg-ink-2 md:justify-self-end">
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

        <Section id="spacing" title="Spacing" note="One rhythm on every screen. Gutters 16 / 32 and content capped at 1440 like the board; sections 64 / 96 apart, landing bands 96 / 128; a heading sits 24 / 32 above its content; groups 8 apart, list rows 4.">
          <div className="grid gap-1">
            {(
              [
                ["Row gap", "gap-1", "w-1"],
                ["Group gap", "gap-2", "w-2"],
                ["Row padding", "p-4", "w-4"],
                ["Panel padding", "p-5 / md:p-6", "w-6"],
                ["Field padding", "p-6 / md:p-8", "w-8"],
                ["Heading to content", "mt-6 / md:mt-8", "w-8"],
                ["Section to section", "mt-16 / md:mt-24", "w-24"],
                ["Landing band", "py-24 / md:py-32", "w-32"],
              ] as const
            ).map(([label, cls, w]) => (
              <div key={label} className="flex items-center gap-4 bg-ink-2 px-4 py-3">
                <span className="w-32 shrink-0 text-small text-paper sm:w-40 md:w-56">{label}</span>
                <span className="hidden w-36 shrink-0 text-small text-muted tabular sm:block">{cls}</span>
                <span className="min-w-0 flex-1">
                  <span className={cx("block h-3 max-w-full bg-rouge", w)} aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="controls" title="Controls" note="Square and flat. Rouge is the action, paper the second choice, ink everything quieter. Heights 40 / 44 / 48. Hover lifts the fill one tone; press scales to 0.97.">
          <div className="grid gap-10">
            <Demo label="Variants">
              <Button>Start chatting</Button>
              <Button variant="paper">Save to board</Button>
              <Button variant="secondary">Maybe later</Button>
              <Button variant="ghost">Skip</Button>
            </Demo>
            <Demo label="Sizes, 40 / 44 / 48">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Demo>
            <Demo label="States">
              <Button arrow>With arrow</Button>
              <ButtonLink href="/system#controls" variant="paper" arrow>
                Link with arrow
              </ButtonLink>
              <Button variant="secondary">
                <ChatCircleDots weight="fill" className="size-[1.125rem]" aria-hidden />
                With icon
              </Button>
              <Button loading={loading} onClick={() => (setLoading(true), setTimeout(() => setLoading(false), 1600))}>
                {loading ? "Sending" : "Tap to load"}
              </Button>
              <Button disabled>Disabled</Button>
            </Demo>
            <Demo label="Chips: toggles 40, tags 32, with counts">
              <Chip pressed={vibe === null} onClick={() => setVibe(null)} count={list.length}>
                All
              </Chip>
              {vibes.map((v) => (
                <Chip key={v} pressed={vibe === v} onClick={() => setVibe(vibe === v ? null : v)} count={list.filter((c) => c.vibe === v).length}>
                  {v}
                </Chip>
              ))}
              <Chip pressed={onlineOnly} onClick={() => setOnlineOnly(!onlineOnly)}>
                <span className="size-2 rounded-full bg-live" aria-hidden />
                Online now
              </Chip>
              <Chip disabled pressed={false}>
                Disabled
              </Chip>
            </Demo>
            <Demo label="Tags and status">
              {featured.traits.slice(0, 2).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
              <Chip count={12}>Saved</Chip>
              <OnlinePill />
              <span className="inline-flex h-6 items-center bg-rouge px-2 text-[0.8125rem] font-medium text-ink">New</span>
              <div className="relative w-56 bg-ink-4 p-2">
                <Tags tags={featured.tags.map((t) => `#${t}`)} max={5} />
              </div>
            </Demo>
            <Demo label="Switches and segmented controls">
              <Switch label="Notifications" on={notify} onChange={setNotify} />
              <Switch label="Always on" on disabled />
              <Segmented label="Billing" className="w-full max-w-72" value={annual} onChange={setAnnual} options={[{ value: true, label: "Twelve months" }, { value: false, label: "One month" }]} />
              <Segmented label="Billing with notes" className="w-full max-w-80" value={annual} onChange={setAnnual} options={[{ value: true, label: "Annual", note: "Save 30%" }, { value: false, label: "Monthly", note: "One month" }]} />
              <div className="w-full max-w-78 bg-paper p-3">
                <Segmented label="On paper" tone="paper" className="w-full" value={annual} onChange={setAnnual} options={[{ value: true, label: "Twelve months" }, { value: false, label: "One month" }]} />
              </div>
            </Demo>
            <div className="grid max-w-3xl gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="off" />
              <Field label="Display name" name="nick" placeholder="What should she call you?" hint="Only your companion sees this." autoComplete="off" />
              <Field label="Email, with an error" name="email-bad" type="email" defaultValue="you@example" error="Enter your email address, like you@example.com." autoComplete="off" />
              <Field
                label="Password, with a trailing control"
                name="pw"
                type={showPw ? "text" : "password"}
                defaultValue="night-agency"
                autoComplete="off"
                trailing={
                  <button type="button" onClick={() => setShowPw(!showPw)} aria-pressed={showPw} className="press inline-flex h-10 items-center px-3 text-small text-muted hover:bg-ink-5 hover:text-paper">
                    {showPw ? "Hide" : "Show"}
                  </button>
                }
              />
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
            <Button variant="secondary" onClick={() => window.dispatchEvent(new CustomEvent(EARNED_EVENT, { detail: "first-words" }))}>
              Achievement toast
            </Button>
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

        <Section id="brand-assets" title="Brand files" note="Everything in public/brand: vector first, PNG for tools that need it. The liquid wordmark is also the README banner (docs/brand).">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {brandFiles.map(({ name, role, file, ext, field }) => (
              <div key={file} className="bg-ink-2">
                <div className={cx("grid aspect-[16/10] place-items-center p-8", field === "paper" ? "bg-paper" : "bg-ink-3")}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand files are static, never resized */}
                  <img src={`/brand/${file}.${ext[0]}`} alt={name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-end justify-between gap-4 px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-small font-medium text-paper">{name}</p>
                    <p className="text-small text-muted">{role}</p>
                  </div>
                  <p className="flex shrink-0 gap-3 text-small">
                    {ext.map((e) => (
                      <a key={e} href={`/brand/${file}.${e}`} download className="text-paper underline underline-offset-4 hover:text-rouge">
                        {e.toUpperCase()}
                      </a>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Dev-only break-ui toggle: swaps the dataset at the data boundary. */}
      <div className="fixed bottom-4 left-1/2 z-40 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 shadow-[var(--shadow-float)]">
        <Segmented
          label="Dataset"
          value={data}
          onChange={setData}
          options={(["Demo", "Worst case", "Empty"] as const).map((d) => ({ value: d, label: d }))}
          className="bg-ink-4"
        />
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
