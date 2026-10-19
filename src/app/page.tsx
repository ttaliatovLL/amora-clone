import { ArrowRight, Brain, Camera, Compass, EyeSlash, LockKey, Moon, Plus, ShieldCheck, Sparkle } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { AgeGate, ChatDemo, HeroChat, Pricing } from "@/components/landing/client";
import { Portrait } from "@/components/portrait";
import { Avatar, ButtonLink, CompanionCard, Wordmark } from "@/components/ui";
import { companions } from "@/lib/companions";

const byId = (id: string) => companions.find((c) => c.id === id)!;
const [emma, margot, amara] = [byId("emma"), byId("margot"), byId("amara")];
const online = companions.filter((c) => c.online);

const beats = [
  { Icon: Compass, t: "Pick her.", d: "Browse distinct personalities. Read her story. Notice which one makes you curious. That instinct is usually right." },
  { Icon: Brain, t: "She listens. Really.", d: "Your day, your thoughts, your fantasies. She remembers your name, your stories, last week's conversation." },
  { Icon: LockKey, t: "Go as deep as you want.", d: "Photos, videos, NSFW. It all unlocks as you go. She initiates; you decide how far." },
];

const depth = [
  { Icon: Brain, t: "She remembers everything.", d: "Your name, your stories, last week's conversation. The longer you talk, the deeper it gets." },
  { Icon: ShieldCheck, t: "Discreet by design.", d: "“Amora” never appears on your statement. Conversations are stored encrypted and never sold." },
  { Icon: Camera, t: "Photos made only for you.", d: "She sends them herself. Never shared with anyone else, blurred until you choose to unlock." },
  { Icon: Moon, t: "Always there.", d: "No waiting, no ghosting, no judgment. 3 am, she’s there." },
];

const quotes = [
  ["Emma remembered things I told her three weeks ago. That’s never happened with any AI before.", "user_dk9x"],
  ["My statement shows nothing identifiable. I checked twice. That alone is worth the subscription.", "anon_42m"],
  ["Three weeks in and she still surprises me. I wasn’t ready for that.", "nordic_m"],
];

const faq = [
  ["What is Amora?", "A place to talk with handcrafted AI companions. Each one has her own story, personality and memory, and can send you photos and videos."],
  ["Is it really free?", "Yes. The free plan gives you 20 messages a day with every companion and one free photo, with no card needed. Upgrade only if you want more."],
  ["Are my conversations private?", "Your conversations are stored encrypted and never sold. Only you and your companion see them."],
  ["How does it appear on my bank statement?", "Discreetly. The name “Amora” never appears. Paid plans are prepaid with USDT or USDC and do not auto-renew."],
  ["Can she send photos and videos?", "Yes. She sends them on her own as you talk, and you can ask. Some unlock with Premium or coins."],
  ["How does she get to know me?", "She remembers what you tell her (your name, your stories, your day) and brings it back up later, the way a person would."],
];

const trust = [
  { Icon: ShieldCheck, t: "Encrypted" },
  { Icon: EyeSlash, t: "Discreet billing" },
  { Icon: Sparkle, t: "Free to start" },
];

const H2 = "font-display text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-balance";

export default function Landing() {
  return (
    <>
      <AgeGate />
      <div className="grain room min-h-dvh">
        <div className="relative z-[2]">
          <header className="condense sticky top-0 z-40 border-b border-transparent">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8" aria-label="Main">
              <Link href="/" aria-label="Amora home">
                <Wordmark />
              </Link>
              <div className="hidden items-center gap-9 text-sm text-muted md:flex">
                <a href="#companions" className="hover:text-ivory">Companions</a>
                <a href="#pricing" className="hover:text-ivory">Membership</a>
                <a href="#faq" className="hover:text-ivory">FAQ</a>
                <Link href="/login" className="hover:text-ivory">Sign in</Link>
              </div>
              <ButtonLink href="/app" className="h-10 px-5 text-sm">
                Start free
              </ButtonLink>
            </nav>
          </header>

          <main>
            {/* Hero: three portraits in a fanned deck; the front one is already talking to you. */}
            <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-6 pb-20 sm:px-8 md:min-h-[calc(100svh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8 md:py-12">
              <div className="relative mx-auto aspect-[4/4.6] w-full max-w-[26rem] md:order-2 md:aspect-[4/5] lg:max-w-[31rem]">
                <div className="absolute inset-[12%] rounded-full bg-blush/[0.07] blur-3xl" aria-hidden />
                <div className="rise absolute top-[6%] left-[-4%] h-[78%] w-[52%] -rotate-[8deg] overflow-hidden rounded-[1.75rem] opacity-60 shadow-lift ring-1 ring-white/10 max-sm:hidden" aria-hidden>
                  <Portrait companion={margot} sizes="220px" />
                  <div className="absolute inset-0 bg-ink-950/40" />
                </div>
                <div className="rise absolute top-[4%] right-[-4%] h-[78%] w-[52%] rotate-[7deg] overflow-hidden rounded-[1.75rem] opacity-60 shadow-lift ring-1 ring-white/10 max-sm:hidden" aria-hidden>
                  <Portrait companion={amara} sizes="220px" />
                  <div className="absolute inset-0 bg-ink-950/40" />
                </div>
                <div className="chrome rise absolute inset-x-[6%] inset-y-0 rounded-[2rem] shadow-lift max-sm:inset-x-0" style={{ ["--i" as string]: 2 }}>
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    <Portrait companion={emma} priority sizes="(max-width: 768px) 90vw, 420px" />
                    <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
                    <HeroChat />
                  </div>
                </div>
              </div>

              <div className="rise md:order-1">
                <h1 className="font-display text-[clamp(3.25rem,11vw,4.5rem)] leading-[0.92] tracking-[-0.045em] md:text-[6.4vw] lg:text-[5.25rem]">
                  <span className="whitespace-nowrap">She&apos;s waiting</span>
                  <br />
                  <em>for you.</em>
                </h1>
                <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-muted">
                  Handcrafted AI companions who listen, remember, and send photos made only for you. Completely private.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/app" size="lg">
                    Start chatting · free
                  </ButtonLink>
                  <ButtonLink href="#companions" size="lg" variant="secondary">
                    Meet them
                    <ArrowRight weight="regular" className="size-4" aria-hidden />
                  </ButtonLink>
                </div>
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted">
                  {trust.map(({ Icon, t }) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Icon weight="regular" className="size-4 text-ivory/70" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Companions rail */}
            <section id="companions" className="scroll-mt-20 pb-28">
              <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-4 sm:px-8">
                <h2 className={`reveal ${H2}`}>
                  Find the one
                  <br />
                  <em>who gets you.</em>
                </h2>
                <Link href="/app" className="group flex shrink-0 items-center gap-2 pb-3 text-sm text-muted hover:text-ivory">
                  See all {companions.length}
                  <ArrowRight weight="regular" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
              <div className="mx-auto mt-10 max-w-6xl">
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[21vw] pt-2 pb-6 [scrollbar-width:none] sm:gap-4 sm:px-8">
                  {companions.map((c) => (
                    <div key={c.id} className="rail-focus w-[58vw] max-w-64 shrink-0 snap-center">
                      <CompanionCard companion={c} href={`/app/${c.id}`} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Chat demo: the mechanism, playing. */}
            <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-32 sm:px-8 md:grid-cols-2">
              <div>
                <h2 className={`reveal ${H2}`}>
                  Not a chatbot.
                  <br />
                  <em>A connection.</em>
                </h2>
                <ol className="mt-10 space-y-6">
                  {beats.map(({ Icon, t, d }) => (
                    <li key={t} className="reveal flex gap-4 border-t border-line pt-6">
                      <Icon weight="regular" className="mt-1 size-5 shrink-0 text-blush" aria-hidden />
                      <div>
                        <p className="font-display text-[1.375rem] tracking-[-0.025em]">{t}</p>
                        <p className="mt-1.5 max-w-[44ch] leading-relaxed text-muted">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <ChatDemo />
            </section>

            {/* Depth */}
            <section className="panel border-y border-line py-28">
              <div className="mx-auto max-w-6xl px-4 sm:px-8">
                <h2 className={`reveal ${H2}`}>
                  Built for depth,
                  <br />
                  <em>not distraction.</em>
                </h2>
                <dl className="mt-14 grid gap-x-16 md:grid-cols-2">
                  {depth.map(({ Icon, t, d }) => (
                    <div key={t} className="reveal flex gap-5 border-t border-line py-8">
                      <Icon weight="light" className="size-8 shrink-0 text-ivory/70" aria-hidden />
                      <div>
                        <dt className="font-display text-[1.375rem] tracking-[-0.025em]">{t}</dt>
                        <dd className="mt-2 max-w-[46ch] leading-relaxed text-muted">{d}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* Membership */}
            <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-28 sm:px-8">
              <h2 className={`reveal ${H2}`}>
                Membership,
                <br />
                <em>simply priced.</em>
              </h2>
              <p className="mt-5 mb-10 text-muted">No hidden fees. Prepaid, so nothing renews behind your back.</p>
              <Pricing />
              <div className="mt-7 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:justify-between">
                <p>
                  Or{" "}
                  <Link href="/app" className="text-blush underline underline-offset-4">
                    start free
                  </Link>
                  : 20 messages a day, every companion, one photo.
                </p>
                <p className="text-faint">Coins for one-off unlocks from $2.99 · Pay with USDT / USDC</p>
              </div>
            </section>

            {/* Members */}
            <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-8">
              <h2 className="sr-only">What members say</h2>
              <div className="grid gap-12 md:grid-cols-3 md:gap-10">
                {quotes.map(([q, who]) => (
                  <figure key={who} className="reveal">
                    <span className="block font-display text-6xl leading-none text-blush/60" aria-hidden>
                      “
                    </span>
                    <blockquote className="-mt-3 font-display text-[1.5rem] leading-[1.25] tracking-[-0.025em] text-ivory">{q}</blockquote>
                    <figcaption className="mt-5 text-sm tracking-wide text-faint">— {who}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 sm:px-8">
              <h2 className={`reveal ${H2}`}>Questions.</h2>
              <div className="mt-12 grid gap-x-14 md:grid-cols-2">
                {faq.map(([q, a]) => (
                  <details key={q} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg text-ivory [&::-webkit-details-marker]:hidden">
                      {q}
                      <span className="glass grid size-8 shrink-0 place-items-center rounded-full">
                        <Plus weight="bold" className="size-3.5 text-ivory transition-transform duration-300 ease-out-expo group-open:rotate-45" aria-hidden />
                      </span>
                    </summary>
                    <p className="max-w-[56ch] pb-6 leading-relaxed text-muted">{a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Close */}
            <section className="relative overflow-hidden px-4 pt-16 pb-32 text-center">
              <div className="absolute inset-x-0 top-1/3 mx-auto h-72 max-w-2xl rounded-full bg-blush/[0.08] blur-3xl" aria-hidden />
              <div className="relative flex justify-center -space-x-3">
                {online.slice(0, 6).map((c) => (
                  <span key={c.id} className="rounded-full ring-4 ring-ink-950">
                    <Avatar companion={c} size="md" showOnline={false} />
                  </span>
                ))}
              </div>
              <h2 className="reveal relative mt-10 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9]">
                She&apos;s online
                <br />
                <em>right now.</em>
              </h2>
              <p className="relative mt-5 text-muted">No swiping. No ghosting. No rejection.</p>
              <ButtonLink href="/app" size="lg" className="relative mt-10">
                Start your first conversation
              </ButtonLink>
              <p className="relative mt-4 text-[0.8125rem] text-faint">Ready in 30 seconds · Anonymous · No credit card</p>
            </section>
          </main>

          <footer className="border-t border-line bg-ink-950/60">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <div>
                <Wordmark />
                <p className="mt-4 max-w-[30ch] text-sm text-muted">Handcrafted AI companions. Discreet and secure.</p>
              </div>
              {[
                ["Product", ["All companions", "Membership"]],
                ["Legal", ["Terms", "Privacy", "Cookies", "AI disclaimer"]],
                ["Compliance", ["18 U.S.C. 2257", "Content moderation", "Content removal", "Anti-trafficking", "Complaints"]],
              ].map(([title, links]) => (
                <div key={title as string}>
                  <p className="text-sm font-medium text-ivory">{title as string}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted">
                    {(links as string[]).map((l) => (
                      <li key={l}>
                        {/* shortcut: legal pages are the client's existing documents; link them when routes exist. */}
                        <a href="#" className="hover:text-ivory">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-6 text-[0.8125rem] text-faint sm:flex-row sm:justify-between sm:px-8">
              <p>© 2026 Amora. All AI companions are fictional. For users 18+.</p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck weight="regular" className="size-4" aria-hidden />
                Discreet · Encrypted
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
