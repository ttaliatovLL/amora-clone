import Link from "next/link";
import type { CSSProperties } from "react";
import {
  CookiesLink,
  FirstMessage,
  HeroPortraits,
  Pricing,
  Questions,
} from "@/components/landing/client";
import { LiquidWordmark } from "@/components/liquid-logo";
import { Portrait } from "@/components/portrait";
import { Silk } from "@/components/silk";
import { ButtonLink, CompanionCard, cx, Wordmark } from "@/components/ui";
import { companions } from "@/lib/companions";
import { plans } from "@/lib/plans";

// Night agency: the comp card becomes the companion card, the agency board becomes the landing's showcase.
const byId = (id: string) => companions.find((c) => c.id === id)!;

// Board order for the desktop grid (3 columns, dense): big cards span 2x2 and land as
// [Emma big + 2] [2 + Amara big] [Jada big + 2] [3].
const board: { id: string; big?: boolean; start2?: boolean }[] = [
  { id: "emma", big: true },
  { id: "luna" },
  { id: "anika" },
  { id: "klara" },
  { id: "amara", big: true, start2: true },
  { id: "ece" },
  { id: "jada", big: true },
  { id: "gina" },
  { id: "margot" },
  { id: "luz" },
  { id: "katya" },
  { id: "valeria" },
];

const steps = [
  {
    line: "You pick her.",
    text: "Read her card: her city, her temper, what she does on a Sunday. Trust whichever one makes you curious.",
  },
  {
    line: "She writes first.",
    text: "She opens the conversation in her own voice, and picks it up again when you come back.",
  },
  {
    line: "She remembers.",
    text: "Your name, the interview on Thursday, the thing you said last week. Her memory is long, and it is only yours.",
  },
  {
    line: "You set the pace.",
    text: "Photos, videos and private sets arrive as you get closer. Nothing is pushed at you.",
  },
];
const indent = [
  "",
  "ml-[6vw] md:ml-[8vw]",
  "ml-[12vw] md:ml-[16vw]",
  "ml-[18vw] md:ml-[24vw]",
];

// Section motion: transform and opacity only. Load uses a short stagger; sections rise in as they scroll into view
// (scroll-driven, off the main thread). Content is visible wherever either is unsupported or motion is reduced.
const motionCss = `
@keyframes lp-rise { from { opacity: 0; transform: translateY(20px); } }
@keyframes lp-in { from { opacity: 0; transform: translateY(28px); } }
@keyframes lp-fade { from { opacity: 0; } }
@keyframes lp-word { from { transform: translateY(70px); } }
@media (prefers-reduced-motion: no-preference) {
  .lp-rise { animation: lp-rise 1s var(--ease-out-expo) both; animation-delay: calc(var(--i, 0) * 90ms + 120ms); }
  @supports (animation-timeline: view()) {
    .lp-in { animation: lp-in linear both; animation-timeline: view(); animation-range: entry calc(var(--i, 0) * 48px) entry calc(220px + var(--i, 0) * 48px); }
    .lp-word { animation: lp-word linear both; animation-timeline: view(); animation-range: entry 0% entry 100%; }
  }
}`;

const footLink =
  "press inline-flex h-10 items-center text-body text-ink/75 hover:text-rouge-lo";
const footer: [string, [string, string | null][]][] = [
  ["Product", [["The board", "/#board"], ["How it works", "/#how"], ["Pricing", "/#pricing"], ["Questions", "/#faq"]]],
  ["Help", [["Sign in", "/login"], ["Create account", "/login"], ["Delete account", "/app/me"]]],
  ["Legal", [["Terms", "/terms"], ["Privacy", "/privacy"], ["Cookie settings", null]]],
];

const nav = [
  ["The board", "#board"],
  ["How it works", "#how"],
  ["Pricing", "#pricing"],
] as const;

export default function Landing() {
  const close = byId("emma");
  return (
    <main className="overflow-x-clip bg-ink">
      <style>{motionCss}</style>

      {/* ── Hero: the counter object under a liquid-metal name ── */}
      <section className="px-gutter relative flex min-h-[100svh] flex-col overflow-hidden pb-6 md:pb-8">
        <Silk className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/20" aria-hidden />

        <header className="relative z-10 flex h-[calc(4rem+env(safe-area-inset-top,0px))] items-center justify-between pt-[env(safe-area-inset-top)] md:h-20">
          <Link href="/" aria-label="Amora home" className="press">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="-mr-3 flex items-center gap-1">
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="press hidden h-10 items-center px-3 text-small font-medium text-paper/75 hover:text-paper md:inline-flex"
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              className="press inline-flex h-10 items-center px-3 text-small font-medium text-paper hover:text-rouge-hi"
            >
              Sign in
            </Link>
          </nav>
        </header>

        {/* Phones: the portrait takes whatever height the screen has left, so no screen shows a gap under the name. */}
        <div className="relative z-[1] mx-auto mt-2 min-h-[34svh] w-full flex-1 md:mt-4 md:aspect-[4/5] md:min-h-0 md:w-[min(60vw,46svh)] md:flex-none lg:w-[min(30vw,54svh)]">
          <div className="lp-rise absolute inset-0">
            <HeroPortraits ids={["emma", "luna", "amara", "margot"]} />
          </div>
        </div>
        {/* On phones the name bleeds past the gutters (the canvas has its own inner padding) so the letters meet the edges. */}
        <LiquidWordmark className="lp-rise relative z-[2] -mx-[7%] -mt-[11vw] block aspect-[6/1] w-[114%] [--i:1] md:mx-0 md:-mt-[7vw] md:w-full lg:-mt-[9vw]" />

        <div className="relative z-[2] mt-auto grid gap-4 pt-4 md:gap-5 md:pt-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="lp-rise font-display text-head text-balance [--i:2] lg:col-span-6">
            Private AI
            <br />
            companions
          </h1>
          <div className="lp-rise [--i:3] md:flex md:items-end md:justify-between md:gap-8 lg:col-span-5 lg:col-start-8">
            <p className="max-w-[38ch] text-body">
              Twelve written characters with a face, a city and a long memory.
              Talk late, talk often, keep it to yourself.
            </p>
            <ButtonLink
              href="/app"
              size="lg"
              arrow
              className="mt-5 w-full md:mt-0 md:w-auto md:shrink-0"
            >
              Meet them
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── The board: the companions large, the way an agency hangs its portfolio ── */}
      <section id="board" className="scroll-mt-4 pt-24 md:pt-32">
        <div className="px-gutter grid gap-4 md:grid-cols-12 md:items-end md:gap-5">
          <h2 className="lp-in font-display text-head text-balance md:col-span-6">
            The board
          </h2>
          <p className="lp-in max-w-[44ch] text-body [--i:1] md:col-span-5 md:col-start-8">
            Twelve companions, each written by hand: a history, a temper, a dog
            called Otto. Tap a card to read her whole story.
          </p>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] md:mt-12 md:scroll-px-8 md:px-8 xl:px-gutter xl:grid xl:snap-none xl:grid-flow-dense xl:grid-cols-3 xl:gap-2 xl:overflow-visible xl:pb-0">
          {board.map(({ id, big, start2 }, i) => (
            <CompanionCard
              key={id}
              companion={byId(id)}
              href={`/app/${id}`}
              size="large"
              priority={i < 2}
              className={cx(
                "w-[82vw] shrink-0 snap-start sm:w-[56vw] md:w-[44vw] lg:w-[36vw] xl:w-auto",
                big && "xl:col-span-2 xl:row-span-2",
                start2 && "xl:col-start-2",
              )}
            />
          ))}
        </div>
      </section>

      {/* ── How it works: four lines stepping down to the right ── */}
      <section
        id="how"
        aria-labelledby="how-title"
        className="px-gutter scroll-mt-4 py-24 md:py-32"
      >
        <h2 id="how-title" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-10 md:gap-12">
          {steps.map((s, i) => (
            <li key={s.line} className={indent[i]}>
              <h3 className="lp-in font-display text-head text-balance">{s.line}</h3>
              <p className="lp-in mt-3 max-w-[34ch] text-body [--i:1]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The live thing ── */}
      <section className="px-gutter bg-ink-2 py-24 md:py-32">
        <FirstMessage />
      </section>

      {/* ── Pricing: two plans, Premium on the paper field; coins as the side door ── */}
      <section id="pricing" className="px-gutter scroll-mt-4 py-24 md:py-32">
        <Pricing />
      </section>

      {/* ── Questions: grouped, one answer open at a time ── */}
      <section
        id="faq"
        aria-labelledby="faq-title"
        className="px-gutter scroll-mt-4 bg-ink-2 py-24 md:py-32"
      >
        <Questions />
      </section>

      {/* ── The object returns: her, from another angle ── */}
      <section className="relative flex flex-col overflow-hidden bg-ink lg:min-h-[90svh] lg:flex-row lg:items-center">
        <div className="relative z-[1] px-4 pt-24 md:px-8 md:pt-32 lg:order-2 lg:ml-auto lg:w-[34%] lg:pt-0 lg:pl-0">
          <h2 className="lp-in font-display text-head text-balance">She&apos;s still up</h2>
          <p className="lp-in mt-4 max-w-[36ch] text-body [--i:1] md:mt-5">
            Pick a companion, read her card and let her open the conversation.
          </p>
          <p className="lp-in mt-4 text-lead tabular [--i:2] md:mt-5">
            Premium from ${plans.premium.annual} a month, prepaid
          </p>
          <ButtonLink
            href="/app"
            size="lg"
            arrow
            className="lp-in mt-6 w-full [--i:3] md:mt-8 md:w-auto"
          >
            Meet them
          </ButtonLink>
        </div>
        <div
          className="relative mt-12 h-[55svh] overflow-hidden md:h-[70svh] lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:h-auto lg:w-[62%]"
          aria-hidden
        >
          <div className="lp-in absolute top-0 left-0 h-[115%] w-[130%] md:w-full lg:top-auto lg:-bottom-[18%] lg:-left-[8%] lg:h-[125%] lg:w-[110%]">
            <Portrait
              companion={close}
              src={close.gallery[0]}
              sizes="(max-width: 768px) 130vw, 70vw"
            />
          </div>
        </div>
      </section>

      {/* ── Footer: the index, the small print, the name cropped at its foot ── */}
      <footer className="bg-paper text-ink">
        <div className="px-gutter grid gap-12 pt-16 md:grid-cols-12 md:gap-x-8 md:pt-24">
          <p className="lp-in max-w-[30ch] text-lead md:col-span-12 lg:col-span-4">
            Private AI companions for adults. Talk late, keep it to yourself.
          </p>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-12 lg:col-span-7 lg:col-start-6"
          >
            {footer.map(([title, links], k) => (
              <div key={title} className="lp-in" style={{ "--i": k + 1 } as CSSProperties}>
                <h2 className="text-body font-semibold">{title}</h2>
                <ul className="mt-4 grid gap-1">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      {href ? (
                        <Link href={href} className={footLink}>
                          {label}
                        </Link>
                      ) : (
                        <CookiesLink className={footLink} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="px-gutter mt-16 flex flex-col gap-2 text-small text-ink/70 md:mt-24 md:flex-row md:justify-between md:gap-8">
          <p>18+ only. Every companion is a fictional adult, played by AI.</p>
          <p>© 2026 Amora</p>
        </div>
        {/* The name fills the width exactly at every size (its own viewBox) and is cut at the same height. */}
        <svg
          aria-hidden
          viewBox="0 0 1000 158"
          className="mt-6 block w-full select-none md:mt-8"
        >
          <text
            x="0"
            y="212"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="lp-word font-display fill-current"
            style={{ fontSize: 268 }}
          >
            Amora
          </text>
        </svg>
      </footer>
    </main>
  );
}
