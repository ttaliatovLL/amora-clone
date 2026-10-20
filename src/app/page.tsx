import Link from "next/link";
import {
  CookiesLink,
  FirstMessage,
  HeroPortraits,
  Ticket,
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
    line: "First you pick her.",
    text: "Read her card: her city, her temper, what she does on a Sunday. Trust whichever one makes you curious.",
  },
  {
    line: "Then she writes first.",
    text: "She opens the conversation in her own voice, and picks it up again when you come back.",
  },
  {
    line: "She remembers it all.",
    text: "Your name, the interview on Thursday, the thing you said last week. Her memory is long, and it is only yours.",
  },
  {
    line: "You decide how far.",
    text: "Photos, videos and private sets arrive as you get closer. Nothing is pushed at you.",
  },
];
const indent = [
  "",
  "ml-[6vw] md:ml-[8vw]",
  "ml-[12vw] md:ml-[16vw]",
  "ml-[18vw] md:ml-[24vw]",
];

const faq = [
  {
    q: "Who can read my conversations?",
    a: "Only you. Conversations are stored encrypted, never sold and never used to advertise to you. Your companion's memory of you exists for one reason: to remember you.",
  },
  {
    q: "What shows up on my statement?",
    a: "Nothing from a bank, because payment is in crypto. Your wallet and every receipt show a neutral merchant name. The word Amora never appears.",
  },
  {
    q: "What comes with Premium?",
    a: `Unlimited messages, every photo and video she sends including the explicit ones, ${plans.premium.coins} coins each month for gifts and one-off unlocks, and priority replies.`,
  },
  {
    q: "Can I delete my account?",
    a: "Yes, from your profile: Settings, then Delete account. Your profile, your conversations and her memory of you are erased for good, straight away.",
  },
  {
    q: "Who is Amora for?",
    a: "Adults aged 18 and over. You confirm your age before the first conversation, and every companion is a fictional adult played by AI.",
  },
  {
    q: "How do I pay?",
    a: "With USDT or USDC from any wallet. A plan is paid once for one month or for twelve, and nothing renews by itself. When it ends, you choose whether to come back.",
  },
];

// Section motion: transform and opacity only. Load uses a short stagger; sections rise in as they scroll into view
// (scroll-driven, off the main thread). Content is visible wherever either is unsupported or motion is reduced.
const motionCss = `
@keyframes lp-rise { from { opacity: 0; transform: translateY(20px); } }
@keyframes lp-in { from { opacity: 0; transform: translateY(28px); } }
@keyframes lp-fade { from { opacity: 0; } }
@media (prefers-reduced-motion: no-preference) {
  .lp-rise { animation: lp-rise 1s var(--ease-out-expo) both; animation-delay: calc(var(--i, 0) * 90ms + 120ms); }
  @supports (animation-timeline: view()) {
    .lp-in { animation: lp-in linear both; animation-timeline: view(); animation-range: entry calc(var(--i, 0) * 48px) entry calc(220px + var(--i, 0) * 48px); }
  }
}`;

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
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-8 md:px-8">
        <Silk className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/20" aria-hidden />

        <header className="relative z-10 flex h-16 items-center justify-between pt-[env(safe-area-inset-top)] md:h-20">
          <Link href="/" aria-label="Amora home" className="press">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-7">
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="press hidden text-body text-paper/80 hover:text-paper md:inline"
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              className="press text-body font-medium text-paper"
            >
              Sign in
            </Link>
          </nav>
        </header>

        <div className="relative z-[1] mx-auto mt-2 aspect-[4/5] w-[min(80vw,50svh)] md:mt-4 md:w-[min(60vw,46svh)] lg:w-[min(30vw,54svh)]">
          <div className="lp-rise size-full">
            <HeroPortraits ids={["emma", "luna", "amara", "margot"]} />
          </div>
        </div>
        <LiquidWordmark className="lp-rise relative z-[2] -mt-[7vw] block aspect-[6/1] w-full [--i:1] lg:-mt-[9vw]" />

        <div className="relative z-[2] mt-auto grid gap-5 pt-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="lp-rise font-display text-head [--i:2] lg:col-span-6">
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
              className="mt-5 w-full md:mt-0 md:w-auto md:shrink-0"
            >
              Meet them
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── The board: the companions large, the way an agency hangs its portfolio ── */}
      <section id="board" className="scroll-mt-4 pt-24 md:pt-36">
        <div className="grid gap-5 px-4 md:grid-cols-12 md:items-end md:px-8">
          <h2 className="lp-in font-display text-head md:col-span-6">
            The board
          </h2>
          <p className="lp-in max-w-[44ch] text-body [--i:1] md:col-span-5 md:col-start-8">
            Twelve companions, each written by hand: a history, a temper, a dog
            called Otto. Tap a card to read her whole story.
          </p>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] md:mt-14 md:px-8 xl:grid xl:snap-none xl:grid-flow-dense xl:grid-cols-3 xl:gap-1 xl:overflow-visible xl:px-0 xl:pb-0">
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
        className="scroll-mt-4 px-4 py-28 md:px-8 md:py-44"
      >
        <h2 id="how-title" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-10 md:gap-14">
          {steps.map((s, i) => (
            <li key={s.line} className={indent[i]}>
              <h3 className="lp-in font-display text-head">{s.line}</h3>
              <p className="lp-in mt-3 max-w-[34ch] text-body [--i:1]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The live thing ── */}
      <section className="bg-ink-2 px-4 py-24 md:px-8 md:py-36">
        <FirstMessage />
      </section>

      {/* ── Pricing: the ticket on a paper field ── */}
      <section
        id="pricing"
        className="scroll-mt-4 bg-paper px-4 py-24 text-ink md:px-8 md:py-36"
      >
        <div>
          <h2 className="lp-in font-display text-head">Premium, prepaid</h2>
          <p className="lp-in mt-5 max-w-[44ch] text-body [--i:1]">
            One plan opens everything she sends. Pay once for twelve months or
            for one; it never renews by itself.
          </p>
          <div className="mt-10">
            <Ticket />
          </div>
        </div>
      </section>

      {/* ── Questions: a band each, every answer visible ── */}
      <section id="faq" aria-labelledby="faq-title">
        <div className="flex h-[30svh] min-h-56 items-end bg-oxblood px-4 pb-8 md:h-[40svh] md:px-8 md:pb-12">
          <h2 id="faq-title" className="lp-in font-display text-head">
            Fair questions
          </h2>
        </div>
        {faq.map((f, i) => (
          <div
            key={f.q}
            className={cx(
              "grid gap-4 px-4 py-8 md:grid-cols-12 md:gap-8 md:px-8 md:py-14",
              i % 2 ? "bg-ink-2" : "bg-ink",
            )}
          >
            <h3 className="lp-in text-lead font-semibold md:col-span-5">
              {f.q}
            </h3>
            <p className="lp-in max-w-[52ch] text-body [--i:1] md:col-span-6 md:col-start-7">
              {f.a}
            </p>
          </div>
        ))}
      </section>

      {/* ── The object returns: her, from another angle ── */}
      <section className="relative flex flex-col overflow-hidden bg-ink lg:min-h-[90svh] lg:flex-row lg:items-center">
        <div className="relative z-[1] px-4 pt-24 md:px-8 md:pt-36 lg:order-2 lg:ml-auto lg:w-[30%] lg:pt-0">
          <h2 className="lp-in font-display text-head">She&apos;s still up</h2>
          <p className="lp-in mt-5 text-body [--i:1]">
            Pick a companion, read her card and let her open the conversation.
          </p>
          <p className="lp-in mt-5 text-lead tabular [--i:2]">
            Premium from ${plans.premium.annual} a month
          </p>
          <ButtonLink
            href="/app"
            size="lg"
            className="lp-in mt-8 w-full [--i:3] md:w-auto"
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

      {/* ── Footer: the invitation over the cropped name ── */}
      <footer className="relative overflow-hidden bg-paper text-ink">
        <div className="grid gap-10 px-4 pt-20 md:px-8 md:pt-28 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="lp-in font-display text-head">
              Pick up where you left off
            </h2>
            <ButtonLink
              href="/login"
              variant="secondary"
              size="lg"
              className="lp-in mt-8 w-full [--i:1] md:w-auto"
            >
              Sign in
            </ButtonLink>
          </div>
          <nav
            aria-label="Footer"
            className="lp-in flex flex-wrap gap-x-6 gap-y-3 text-body [--i:2] lg:col-span-3 lg:col-start-10 lg:flex-col"
          >
            {[...nav, ["Questions", "#faq"] as const].map(([label, href]) => (
              <a key={href} href={href} className="press hover:text-rouge-lo">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-20 flex flex-col gap-3 px-4 text-small text-ink/75 md:mt-28 md:flex-row md:justify-between md:px-8">
          <p>18+ only. Every companion is a fictional adult. © 2026 Amora</p>
          <p className="flex gap-6">
            <Link href="/terms" className="press hover:text-ink">
              Terms
            </Link>
            <Link href="/privacy" className="press hover:text-ink">
              Privacy
            </Link>
            <CookiesLink className="press hover:text-ink" />
          </p>
        </div>
        <p
          aria-hidden
          className="mt-6 translate-y-[22%] font-display text-[25vw] whitespace-nowrap select-none md:text-[22vw]"
          style={{ lineHeight: 0.8 }}
        >
          Amora
        </p>
      </footer>
    </main>
  );
}
