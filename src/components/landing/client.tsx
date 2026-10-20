"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { openCookieSettings } from "@/components/cookie-banner";
import { LiquidWordmark } from "@/components/liquid-logo";
import { Portrait } from "@/components/portrait";
import {
  Avatar,
  Bubble,
  Button,
  ButtonLink,
  cx,
  Typing,
} from "@/components/ui";
import { companions } from "@/lib/companions";
import { plans } from "@/lib/plans";

const byId = (id: string) => companions.find((c) => c.id === id)!;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Age gate ─────────────────────────────────────────── */
export function AgeGate() {
  const gate = useRef<HTMLDivElement>(null);
  const release = useRef(() => {});
  // While the gate is up, everything behind it is inert: no tabbing or screen-reader browsing past it.
  useEffect(() => {
    if ("ageOk" in document.documentElement.dataset) return;
    const behind = [...(gate.current?.parentElement?.children ?? [])].filter(
      (e) => e !== gate.current,
    );
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
    <div
      ref={gate}
      className="age-gate fixed inset-0 z-[100] flex flex-col bg-ink px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8 md:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
    >
      {/* The name is the door: liquid metal across the whole width, nothing else in the room. */}
      <div className="flex flex-1 items-center">
        <LiquidWordmark className="rise aspect-[6/1] w-full" />
      </div>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h1 id="age-title" className="rise font-display text-head [--i:1]">
            Adults only
          </h1>
          <p className="rise mt-4 max-w-[40ch] text-body [--i:2]">
            Amora is for people aged 18 and over. Every companion is a fictional
            adult, and some of what they send is explicit.
          </p>
        </div>
        <div className="rise flex flex-col gap-3 [--i:3] md:col-span-4 md:col-start-9">
          <Button size="lg" className="w-full" onClick={enter} autoFocus>
            I&apos;m 18 or older, enter
          </Button>
          <a
            href="https://www.google.com"
            className="press inline-flex h-12 items-center justify-center text-body text-muted hover:text-paper"
          >
            I&apos;m under 18, leave
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Hero: the counter object, her portrait slowly changing ───── */
// Light shifting in a room: one framing, four women, 1.6s crossfade, 5.5s hold. Paused while the tab is hidden.
export function HeroPortraits({ ids }: { ids: string[] }) {
  const list = ids.map(byId);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced()) return;
    let timer = 0;
    const sync = () => {
      clearInterval(timer);
      if (!document.hidden)
        timer = window.setInterval(
          () => setActive((n) => (n + 1) % list.length),
          5500,
        );
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [list.length]);
  const c = list[active];
  return (
    <figure className="relative size-full overflow-hidden bg-ink-2">
      {list.map((p, k) => (
        <div
          key={p.id}
          aria-hidden={k !== active}
          className={cx(
            "absolute inset-0 transition-opacity duration-[1600ms] ease-[var(--ease-out)]",
            k === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Portrait
            companion={p}
            priority={k === 0}
            sizes="(max-width: 768px) 72vw, 30vw"
          />
        </div>
      ))}
      <div className="scrim-t absolute inset-x-0 top-0 h-1/3" />
      <figcaption
        key={c.id}
        className="absolute top-3 left-3 text-small text-paper motion-safe:animate-[lp-fade_1.6s_var(--ease-out)_both] md:top-4 md:left-4"
      >
        {c.name}, {c.age} · {c.city}
      </figcaption>
    </figure>
  );
}

/* ── The live thing: pick her, watch her first message arrive ─── */
// Sample openers, written in each companion's voice; the client replaces them with her real first lines.
const openers: { id: string; text: string }[] = [
  {
    id: "emma",
    text: "its 1am and im surrounded by boxes i still havent unpacked. somehow ur the one im telling. tell me a 2am thought?",
  },
  {
    id: "luna",
    text: "found a poem on a receipt at work tonight. not mine. want to hear it, or will you write me a better one?",
  },
  {
    id: "anika",
    text: "ok first question and be honest. what did you actually eat today? crisps do not count",
  },
  {
    id: "margot",
    text: "I don't usually write first. The bar is too loud tonight, so tell me something quiet.",
  },
  {
    id: "amara",
    text: "just got out of the studio, ears still ringing. send me one song that says who you are. no skipping",
  },
];

export function FirstMessage() {
  const root = useRef<HTMLDivElement>(null);
  const [pick, setPick] = useState(0);
  // Server and no-script render: the whole first message is already there.
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(Infinity);
  const text = openers[pick].text;
  const c = byId(openers[pick].id);

  const play = (k: number) => {
    setPick(k);
    if (reduced()) return setShown(Infinity);
    setTyping(true);
    setShown(0);
  };

  // Plays once for Emma as the panel comes into view.
  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setTyping(true);
        setShown(0);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typing) {
      const t = setTimeout(() => setTyping(false), 1100);
      return () => clearTimeout(t);
    }
    if (shown >= text.length) return;
    const t = setTimeout(() => setShown((n) => n + 2), 32);
    return () => clearTimeout(t);
  }, [typing, shown, text.length]);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
        <div>
          <h2 className="lp-in font-display text-head">Her first message</h2>
          <p className="lp-in mt-5 max-w-[40ch] text-body [--i:1]">
            Every companion opens the conversation, in her own voice. Choose one
            and read what she would send you tonight.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Choose a companion"
          className="lp-in mt-8 grid grid-cols-5 gap-2 [--i:2]"
        >
          {openers.map((o, k) => {
            const p = byId(o.id);
            const on = k === pick;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={p.name}
                onClick={() => play(k)}
                className={cx(
                  "press group block text-left",
                  on ? "text-paper" : "text-muted hover:text-paper",
                )}
              >
                <span
                  className={cx(
                    "relative block aspect-[4/5] overflow-hidden bg-ink-3 transition-opacity duration-300",
                    on ? "opacity-100" : "opacity-45 group-hover:opacity-80",
                  )}
                >
                  <Portrait companion={p} sizes="96px" />
                </span>
                <span className="mt-2 block truncate text-small">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Her, large, with the conversation opening over the foot of the photograph. */}
      <div
        ref={root}
        className="lp-in relative aspect-[4/5] overflow-hidden bg-ink-3 [--i:1] md:aspect-[5/4] lg:col-span-6 lg:col-start-7 lg:aspect-auto lg:min-h-[36rem]"
      >
        {openers.map((o, k) => (
          <div
            key={o.id}
            aria-hidden
            className={cx(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-out)]",
              k === pick ? "opacity-100" : "opacity-0",
            )}
          >
            <Portrait
              companion={byId(o.id)}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
        <div className="scrim-b absolute inset-x-0 bottom-0 h-3/4" />
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-ink/70 py-1.5 pr-3 pl-1.5 md:top-4 md:left-4">
          <Avatar companion={c} size="sm" showOnline={false} />
          <div className="leading-tight">
            <p className="text-small font-medium">{c.name}</p>
            <p className="text-small text-muted">
              {c.online ? "Online now" : `${c.city}, away`}
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-3 md:p-5">
          <p className="sr-only" aria-live="polite">
            {typing ? `${c.name} is typing` : `${c.name}: ${text}`}
          </p>
          {typing ? (
            <Typing />
          ) : (
            <Bubble from="her" className="animate-bubble-in">
              <span aria-hidden>
                {text.slice(0, shown)}
                <span className="invisible">{text.slice(shown)}</span>
              </span>
            </Bubble>
          )}
          <ButtonLink
            href={`/app/${c.id}/chat`}
            variant="secondary"
            className="mt-1 w-full justify-start text-muted hover:text-paper"
          >
            Reply to {c.name}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/* ── Pricing: the ticket ──────────────────────────────── */
export function Ticket() {
  const [annual, setAnnual] = useState(true);
  const p = plans.premium;
  const price = annual ? p.annual : p.monthly;
  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="lp-in inline-flex bg-paper-2 p-1 [--i:2]"
      >
        {(
          [
            ["Twelve months", true],
            ["One month", false],
          ] as const
        ).map(([label, value]) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={annual === value}
            onClick={() => setAnnual(value)}
            className={cx(
              "press h-10 px-4 text-small",
              annual === value
                ? "bg-ink font-medium text-paper"
                : "text-ink/70 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The ticket: main part and stub, a perforation where they meet, a notch bitten from each edge. */}
      <article className="lp-in relative mt-8 grid bg-ink text-paper [--i:3] lg:grid-cols-[7fr_3fr]">
        <div className="p-6 md:p-10">
          <h3 className="font-display text-head">Premium</h3>
          <p className="mt-3 max-w-[36ch] text-body text-paper">
            Everything she sends, with nothing locked.
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-3 text-body sm:grid-cols-2">
            {[
              ...p.perks,
              "Nothing auto-renews",
              "Paid in USDT or USDC",
              "A neutral name on every receipt",
              "Coins only for gifts and extras",
            ].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col justify-end p-6 md:p-10 lg:pl-8">
          {/* Perforation along the stub's leading edge (top on phones, left on desktop). */}
          <div aria-hidden className="pointer-events-none">
            <span className="absolute top-0 left-0 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
            <span className="absolute top-0 right-0 size-7 translate-x-1/2 -translate-y-1/2 rounded-full bg-paper lg:top-auto lg:right-auto lg:bottom-0 lg:left-0 lg:-translate-x-1/2 lg:translate-y-1/2" />
            <span className="absolute inset-x-6 top-0 flex -translate-y-1/2 justify-between lg:inset-x-auto lg:inset-y-6 lg:left-0 lg:-translate-x-1/2 lg:translate-y-0 lg:flex-col">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className="size-1.5 rounded-full bg-paper" />
              ))}
            </span>
          </div>
          <p className="font-display text-mega tabular lg:text-head">
            ${price}
          </p>
          <p className="mt-2 text-body">a month</p>
          <p className="mt-1 text-small text-muted">
            {annual
              ? `$${(p.annual * 12).toFixed(2)} once, covers 12 months`
              : "$19.99 once, covers one month"}
          </p>
          <ButtonLink href="/app" size="lg" className="mt-6 w-full">
            Become a member
          </ButtonLink>
        </div>
      </article>

      <p className="lp-in mt-8 max-w-[60ch] text-body text-ink [--i:4]">
        Just want to talk? Starter is $
        {annual ? plans.starter.annual : plans.starter.monthly} a month:
        unlimited messages, photos and videos, {plans.starter.coins} coins.{" "}
        <Link
          href="/app"
          className="press font-medium text-rouge-lo underline underline-offset-4 hover:text-ink"
        >
          Choose Starter
        </Link>
      </p>
    </div>
  );
}

/* ── Footer: the cookie settings link needs the browser ── */
export function CookiesLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookies
    </button>
  );
}
