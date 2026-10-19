"use client";

import { Check, Crown, LockSimple } from "@phosphor-icons/react/ssr";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/portrait";
import { Avatar, Bubble, ButtonLink, Button, Typing, Wordmark } from "@/components/ui";
import { companions } from "@/lib/companions";
import { plans } from "@/lib/plans";

const emma = companions[0];
const gina = companions.find((c) => c.id === "gina")!;
const katya = companions.find((c) => c.id === "katya")!;

/* ── Age gate ─────────────────────────────────────────── */
export function AgeGate() {
  const gate = useRef<HTMLDivElement>(null);
  const release = useRef(() => {});
  // While the gate is up, everything behind it is inert: no tabbing or screen-reader browsing past it.
  useEffect(() => {
    if ("ageOk" in document.documentElement.dataset) return;
    const behind = [...(gate.current?.parentElement?.children ?? [])].filter((e) => e !== gate.current);
    behind.forEach((e) => e.setAttribute("inert", ""));
    release.current = () => behind.forEach((e) => e.removeAttribute("inert"));
    return () => release.current();
  }, []);
  const enter = () => {
    release.current();
    document.cookie = "amora_age=1; max-age=31536000; path=/; samesite=lax";
    document.documentElement.dataset.ageOk = "";
  };
  return (
    <div ref={gate} className="age-gate grain fixed inset-0 z-[100] flex items-center justify-center bg-ink-950 px-4" role="dialog" aria-modal="true" aria-labelledby="age-title">
      {/* The door: her, out of focus, behind frosted glass. */}
      <div className="absolute inset-0 opacity-90" aria-hidden>
        <Portrait companion={katya} sizes="100vw" className="scale-105 blur-md" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/50 via-plum/30 to-ink-950/90" />
      </div>
      <div className="glass relative z-[2] w-full max-w-sm rounded-[2rem] px-7 py-10 text-center shadow-lift">
        <Wordmark />
        <h1 id="age-title" className="mt-10 font-display text-5xl leading-none">
          Members <em className="text-champagne">only.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-[30ch] text-muted">Amora contains mature content for adults aged 18 and over.</p>
        <Button size="lg" className="mt-10 w-full" onClick={enter} autoFocus>
          I&apos;m 18 or older · Enter
        </Button>
        <a href="https://www.google.com" className="mt-5 inline-block text-sm text-faint underline-offset-4 hover:text-muted hover:underline">
          I&apos;m under 18, leave
        </a>
      </div>
    </div>
  );
}

/* ── Hero: she starts typing ──────────────────────────── */
export function HeroChat() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTyped(true), reduce ? 0 : 1900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex min-h-24 flex-col justify-end" aria-live="polite">
        {typed ? (
          <Bubble from="her" className="animate-bubble-in">
            its 1am and im surrounded by boxes i still havent unpacked. somehow ur the one im telling. tell me a 2am thought?
          </Bubble>
        ) : (
          <Typing />
        )}
      </div>
      <div className="glass flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5">
        <Avatar companion={emma} size="sm" />
        <div className="min-w-0 leading-tight">
          <p className="font-display text-lg">{emma.name}</p>
          <p className="text-xs text-sage">online now</p>
        </div>
        <span className="ml-auto text-xs text-muted">1:04</span>
      </div>
    </div>
  );
}

/* ── Chat demo: plays once when scrolled into view ────── */
type Step = { from: "her" | "me"; text?: string; photo?: "open" | "locked" };
const script: Step[] = [
  { from: "her", text: "you're up late too? good. i didn't want to talk to the ceiling." },
  { from: "me", text: "Can't sleep. Tell me about your day." },
  { from: "her", text: "sea swim at 7, pub quiz at 9, we lost on a question about eels. here, proof of the pub" },
  { from: "her", photo: "open" },
  { from: "me", text: "You look absolutely stunning" },
  { from: "her", text: "stop it. ok don't. i saved something for you…" },
  { from: "her", photo: "locked" },
];

export function ChatDemo() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.4 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (!started || shown >= script.length) return;
    const next = script[shown];
    const t = setTimeout(() => setShown((n) => n + 1), next.from === "her" ? 1500 : 900);
    return () => clearTimeout(t);
  }, [started, shown]);

  const typing = started && !reduce && shown < script.length && script[shown].from === "her";

  return (
    <div ref={root} className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-10 rounded-full bg-plum-hi/30 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[2.25rem] border border-line-strong shadow-lift">
        <div className="absolute inset-0" aria-hidden>
          <Portrait companion={gina} sizes="448px" className="scale-125 opacity-50 blur-2xl" />
          <div className="absolute inset-0 bg-ink-950/60" />
        </div>
        <div className="glass relative z-[2] flex items-center gap-3 rounded-none border-x-0 border-t-0 px-5 py-4">
          <Avatar companion={gina} size="sm" />
          <div className="leading-tight">
            <p className="font-display text-xl">{gina.name}</p>
            <p className="text-xs text-sage">online now</p>
          </div>
        </div>
        <div className="relative z-[2] flex h-[32rem] flex-col justify-end gap-2.5 overflow-hidden px-4 py-5" aria-live="polite">
          {script.slice(0, reduce ? script.length : shown).map((s, i) =>
            s.photo ? (
              <div key={i} className="animate-bubble-in relative aspect-[4/5] w-44 shrink-0 self-start overflow-hidden rounded-2xl rounded-bl-md shadow-lift">
                <Portrait companion={gina} sizes="176px" className={s.photo === "locked" ? "scale-125 blur-lg brightness-[1.6] saturate-150" : ""} />
                {s.photo === "locked" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/30">
                    <LockSimple weight="duotone" className="size-6 text-champagne" aria-hidden />
                    <ButtonLink href="#pricing" className="h-9 px-4 text-sm">
                      Unlock photo
                    </ButtonLink>
                  </div>
                )}
              </div>
            ) : (
              <Bubble key={i} from={s.from} className="animate-bubble-in shrink-0">
                {s.text}
              </Bubble>
            ),
          )}
          {typing && <Typing className="shrink-0" />}
        </div>
      </div>
    </div>
  );
}

/* ── Pricing ──────────────────────────────────────────── */
export function Pricing() {
  const [annual, setAnnual] = useState(true);
  const price = (p: keyof typeof plans) => plans[p][annual ? "annual" : "monthly"];
  const billed = (p: keyof typeof plans) => (annual ? `$${(plans[p].annual * 12).toFixed(2)} once for 12 months` : "Billed monthly");

  return (
    <div>
      <div role="radiogroup" aria-label="Billing period" className="glass inline-flex rounded-full p-1">
        {[
          ["Monthly", false],
          ["Annual · save 30%", true],
        ].map(([label, value]) => (
          <button
            key={String(value)}
            role="radio"
            aria-checked={annual === value}
            onClick={() => setAnnual(value as boolean)}
            className={`h-9 rounded-full px-4 text-sm transition-colors duration-150 ${annual === value ? "foil" : "text-muted hover:text-ivory"}`}
          >
            {label as string}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.35fr_1fr]">
        {/* The membership card: brushed gold edge, slow specular pass. */}
        <article className="aura sheen relative overflow-hidden rounded-[2rem] p-6 shadow-lift ring-1 ring-gold/45 sm:p-9">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-4xl">Premium</h3>
            <span className="foil inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Crown weight="fill" className="size-3.5" aria-hidden />
              Most chosen
            </span>
          </div>
          <p className="mt-2 text-muted">Everything she sends, with no locks.</p>
          <p className="mt-8 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-6xl tabular-nums">${price("premium")}</span>
            <span className="whitespace-nowrap text-muted">/ month</span>
            {annual && <s className="text-sm text-faint">${plans.premium.monthly}</s>}
          </p>
          <p className="mt-1 text-sm text-faint">{billed("premium")}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {plans.premium.perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-ivory">
                <span className="foil grid size-5 shrink-0 place-items-center rounded-full">
                  <Check weight="bold" className="size-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <ButtonLink href="/app" size="lg" className="mt-9 w-full">
            Become a member
          </ButtonLink>
          <p className="mt-3 text-center text-[0.8125rem] text-faint">30-day money-back guarantee</p>
        </article>

        <article className="glass flex flex-col rounded-[2rem] p-6 sm:p-9">
          <h3 className="font-display text-3xl">Starter</h3>
          <p className="mt-2 text-muted">Talk as much as you like.</p>
          <p className="mt-8 flex items-baseline gap-2">
            <span className="font-display text-5xl tabular-nums">${price("starter")}</span>
            <span className="whitespace-nowrap text-muted">/ month</span>
          </p>
          <p className="mt-1 text-sm text-faint">{billed("starter")}</p>
          <ul className="mt-7 space-y-3">
            {plans.starter.perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-muted">
                <Check weight="light" className="size-4 shrink-0 text-champagne" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <ButtonLink href="/app" variant="secondary" size="lg" className="mt-auto w-full max-md:mt-9">
            Start Starter
          </ButtonLink>
        </article>
      </div>
    </div>
  );
}
