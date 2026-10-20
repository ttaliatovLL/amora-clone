"use client";

import Link from "next/link";
import { Check, Coins, CalendarCheck, CurrencyCircleDollar, HandPalm, Plus, Receipt, Trash } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { openCookieSettings } from "@/components/cookie-banner";
import { LiquidWordmark } from "@/components/liquid-logo";
import { Portrait } from "@/components/portrait";
import {
  Avatar,
  Bubble,
  Button,
  ButtonLink,
  Chip,
  cx,
  Segmented,
  Typing,
} from "@/components/ui";
import { companions } from "@/lib/companions";
import { coinPacks, plans } from "@/lib/plans";

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
          <h1 id="age-title" className="rise font-display text-head text-balance [--i:1]">
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
            className="press inline-flex h-11 items-center justify-center text-body text-muted hover:text-paper"
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
    <div className="grid gap-8 md:gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
        <div>
          <h2 className="lp-in font-display text-head text-balance">Her first message</h2>
          <p className="lp-in mt-4 max-w-[40ch] text-body [--i:1] md:mt-5">
            Every companion opens the conversation, in her own voice. Choose one
            and read what she would send you tonight.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Choose a companion"
          className="lp-in mt-6 grid max-w-md grid-cols-5 gap-2 [--i:2] md:mt-8"
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
                <span className="mt-1.5 block truncate text-small">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Her, large, with the conversation opening over the foot of the photograph. */}
      <div
        ref={root}
        className="lp-in relative aspect-[4/5] overflow-hidden bg-ink-3 [--i:1] md:aspect-[5/4] lg:col-span-6 lg:col-start-7 lg:aspect-auto lg:min-h-[32rem]"
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
              {/* Grows upward from the foot of the photo as she types; the reply button never moves. */}
              <span aria-hidden>{text.slice(0, shown)}</span>
            </Bubble>
          )}
          <ButtonLink
            href={`/app/${c.id}/chat`}
            variant="secondary"
            arrow
            className="mt-1 w-full text-muted hover:text-paper [&>span]:w-full [&>span]:justify-between"
          >
            Reply to {c.name}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/* ── Pricing: two plans, Premium on the paper field ───── */
const money = (n: number) => `$${n.toFixed(2)}`;
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Odometer: each digit is a column of 0–9 that slides to its value. Columns are keyed from the right so
// "$8.99" → "$12.99" keeps the cents still and only the changed digits move.
function Roll({ value }: { value: string }) {
  const chars = [...value].reverse();
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex flex-row-reverse items-start leading-none">
        {chars.map((ch, k) =>
          /\d/.test(ch) ? (
            // The resting digit sets the column's width (the face's figures are proportional); the roll sits over it.
            <span key={k} className="relative h-[1em] overflow-x-visible overflow-y-clip">
              <span className="invisible">{ch}</span>
              <span
                className="absolute inset-x-0 top-0 flex flex-col items-center transition-transform duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
                style={{ transform: `translateY(-${+ch * 10}%)`, transitionDelay: `${k * 45}ms` }}
              >
                {digits.map((d) => (
                  <span key={d} className="h-[1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={k} className="h-[1em]">
              {ch}
            </span>
          ),
        )}
      </span>
    </>
  );
}

type Plan = (typeof plans)["premium"];

function PlanCard({ name, line, plan, annual, hero, note, i }: { name: string; line: string; plan: Plan; annual: boolean; hero?: boolean; note?: string; i: number }) {
  const total = annual ? plan.annual * 12 : plan.monthly;
  // A month is counted as 30 days, twelve months as 365.
  const perDay = total / (annual ? 365 : 30);
  const yearSave = (plan.monthly - plan.annual) * 12;
  return (
    <div className={cx("lp-in", hero ? "lg:col-span-7" : "lg:col-span-5")} style={{ "--i": i } as CSSProperties}>
      <article
        className={cx(
          "flex h-full flex-col p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 md:p-8 lg:p-10",
          hero ? "bg-paper text-ink" : "bg-ink-2 text-paper",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <h3 className="font-display text-head">{name}</h3>
          {hero && (
            <p key={String(annual)} className="inline-flex h-8 items-center bg-ink px-3 text-small font-medium text-paper motion-safe:animate-[lp-fade_.5s_var(--ease-out)_both]">
              {annual ? `Best value: you save $${Math.round(yearSave)} a year` : `Save $${Math.round(yearSave)} with twelve months`}
            </p>
          )}
        </div>
        <p className="mt-3 max-w-[36ch] text-body">{line}</p>

        <div className="mt-8 flex flex-wrap items-end gap-x-3 gap-y-1 md:mt-10">
          <p className={cx("font-display tabular", hero ? "text-mega lg:text-[6rem]" : "text-mega lg:text-[4rem]")}>
            <Roll value={money(annual ? plan.annual : plan.monthly)} />
          </p>
          <p className="pb-1 text-body whitespace-nowrap">a month</p>
        </div>
        <p key={String(annual)} className={cx("mt-3 text-small motion-safe:animate-[lp-fade_.6s_var(--ease-out)_both]", hero ? "text-ink/70" : "text-muted")}>
          {money(total)} once, covers {annual ? "12 months" : "one month"}. About {money(perDay)} a day.
        </p>

        <ul className="mt-8 grid gap-3 text-body md:mt-10">
          {plan.perks.map((t) => (
            <li key={t} className="flex gap-3">
              <Check weight="bold" aria-hidden className={cx("mt-1 size-4 shrink-0", hero ? "text-rouge-lo" : "text-rouge")} />
              {t}
            </li>
          ))}
        </ul>
        {note && <p className="mt-4 text-small text-muted">{note}</p>}

        <div className="mt-auto pt-8 md:pt-10">
          <ButtonLink href="/login" size="lg" variant={hero ? "primary" : "secondary"} arrow={hero} className="w-full">
            {hero ? "Become a member" : "Choose Starter"}
          </ButtonLink>
        </div>
      </article>
    </div>
  );
}

const trust = [
  { icon: CalendarCheck, title: "Nothing auto-renews", text: "When your time is up, it simply ends." },
  { icon: CurrencyCircleDollar, title: "Pay with USDT or USDC", text: "From any wallet you already use." },
  { icon: Receipt, title: "Neutral name on your statement", text: "The word Amora never appears." },
  { icon: HandPalm, title: "Cancel by not renewing", text: "No form to fill in, nothing to switch off." },
  { icon: Trash, title: "Delete your account any time", text: "Settings, then Delete account." },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);
  const off = Math.round((1 - plans.premium.annual / plans.premium.monthly) * 100);
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="lp-in font-display text-head text-balance">Premium, prepaid</h2>
          <p className="lp-in mt-4 max-w-[44ch] text-body [--i:1] md:mt-5">
            Pay once for a month or for a year. Nothing renews by itself, and you choose whether to come back.
          </p>
        </div>
        <Segmented
          label="Billing period"
          className="lp-in w-full max-w-md [--i:2] lg:col-span-4 lg:col-start-9 lg:max-w-none"
          value={annual}
          onChange={setAnnual}
          options={[
            { value: true, label: "Twelve months", note: `${off}% less a month` },
            { value: false, label: "One month", note: "Pay as you go" },
          ]}
        />
      </div>

      <div className="mt-8 grid gap-2 md:mt-12 lg:grid-cols-12">
        <PlanCard
          hero
          i={1}
          name="Premium"
          line="Everything she sends, with nothing locked."
          plan={plans.premium}
          annual={annual}
        />
        <PlanCard
          i={2}
          name="Starter"
          line="For talking every day, with photos and videos along the way."
          plan={plans.starter}
          annual={annual}
          note="Explicit sets and priority replies come with Premium."
        />
      </div>

      <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-5">
        {trust.map(({ icon: Icon, title, text }, k) => (
          <li key={title} className="lp-in" style={{ "--i": k } as CSSProperties}>
            <Icon aria-hidden className="size-6 text-rouge" />
            <p className="mt-3 text-body font-medium">{title}</p>
            <p className="mt-1 text-small text-muted">{text}</p>
          </li>
        ))}
      </ul>

      {/* Coins: the secondary purchase, for one-off things. */}
      <div className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <h3 className="lp-in font-display text-head text-balance">Just want a photo?</h3>
          <p className="lp-in mt-4 max-w-[40ch] text-body [--i:1] md:mt-5">
            Coins pay for one-off things: a photo she offers, a private set, a gift for her. Top up without a plan.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:col-span-7">
          {coinPacks.map((c, k) => (
            <li key={c.coins} className="lp-in" style={{ "--i": k + 1 } as CSSProperties}>
              <Link
                href="/login"
                aria-label={`${c.coins} coins for ${money(c.price)}`}
                className="press group flex h-full items-center justify-between gap-4 bg-ink-2 p-5 transition-colors hover:bg-ink-3 sm:flex-col sm:items-start md:p-6"
              >
                <span className="flex items-baseline gap-2">
                  <Coins aria-hidden className="size-5 translate-y-0.5 text-rouge" />
                  <span className="font-display text-head tabular">{c.coins}</span>
                </span>
                <span className="text-right sm:text-left">
                  <span className="block text-lead tabular">{money(c.price)}</span>
                  <span className="block text-small text-muted tabular">{money((c.price / c.coins) * 100)} per 100</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Questions: grouped, one open at a time ───────────── */
const faq: { group: "Privacy" | "Payments" | "Companions" | "Account"; q: string; a: string }[] = [
  { group: "Privacy", q: "Who can read my conversations?", a: "Only you. Conversations are stored encrypted, never sold and never used to advertise to you." },
  { group: "Privacy", q: "What shows up on my statement?", a: "A neutral merchant name, in your wallet and on every receipt. The word Amora never appears, and no bank is involved in the payment." },
  { group: "Payments", q: "How do I pay?", a: "With USDT or USDC, from any wallet. Card payments are not available yet." },
  { group: "Payments", q: "Does anything renew automatically?", a: "No. A plan is paid once, for one month or for twelve. When it ends, it ends, and you decide whether to come back. Cancelling is simply not renewing." },
  { group: "Payments", q: "What are coins for?", a: `One-off things: a photo or a set she offers, or a gift for her. Premium includes ${plans.premium.coins} coins a month, Starter ${plans.starter.coins}, and packs start at ${money(coinPacks[0].price)} for ${coinPacks[0].coins}.` },
  { group: "Payments", q: "Starter or Premium?", a: `Both give you unlimited messages, photos and videos. Premium adds the explicit sets, priority replies and ${plans.premium.coins} coins a month instead of ${plans.starter.coins}.` },
  { group: "Companions", q: "Who are the companions?", a: "Fictional adults, each written by hand: a city, a history, a temper. They are played by AI, and none of them is a real person." },
  { group: "Companions", q: "Does she remember me?", a: "Yes. Your name, your week, the thing you said last time. Her memory is long, and it belongs to your conversation alone." },
  { group: "Companions", q: "Can I talk to more than one?", a: "Yes, to as many as you like. Each keeps her own conversation and her own memory of you, so nothing crosses between them." },
  { group: "Companions", q: "Does she send photos and videos?", a: "Yes, as you get closer. Some arrive in the conversation, some open with coins, and the explicit sets come with Premium. Nothing is pushed at you." },
  { group: "Account", q: "Who is Amora for?", a: "Adults aged 18 and over. You confirm your age before the first conversation." },
  { group: "Account", q: "How do I delete my account?", a: "In your profile: Settings, then Delete account. Your profile, your conversations and her memory of you are erased straight away." },
];
const groups = ["All", "Privacy", "Payments", "Companions", "Account"] as const;

export function Questions() {
  const [group, setGroup] = useState<(typeof groups)[number]>("All");
  const [open, setOpen] = useState<string | null>(faq[0].q);
  const id = useId();
  const list = faq.filter((f) => group === "All" || f.group === group);
  return (
    <div className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
        <h2 id="faq-title" className="lp-in font-display text-head text-balance">
          Fair questions
        </h2>
        <p className="lp-in mt-4 max-w-[36ch] text-body [--i:1] md:mt-5">
          Straight answers about privacy, paying, the companions and your account.
        </p>
        <div role="group" aria-label="Filter questions" className="lp-in mt-6 flex flex-wrap gap-2 [--i:2] md:mt-8">
          {groups.map((g) => (
            <Chip key={g} pressed={g === group} onClick={() => setGroup(g)}>
              {g}
            </Chip>
          ))}
        </div>
      </div>

      <div key={group} className="grid content-start gap-1 lg:col-span-8 lg:col-start-5">
        {list.map((f, k) => {
          const on = open === f.q;
          const n = faq.indexOf(f);
          return (
            <div
              key={f.q}
              className="bg-ink-3 motion-safe:animate-[lp-rise_.6s_var(--ease-out-expo)_both]"
              style={{ animationDelay: `${k * 40}ms` }}
            >
              <h3>
                <button
                  type="button"
                  id={`${id}q${n}`}
                  aria-expanded={on}
                  aria-controls={`${id}a${n}`}
                  onClick={() => setOpen(on ? null : f.q)}
                  className="group flex w-full items-start justify-between gap-6 p-5 text-left text-lead font-medium md:p-6"
                >
                  <span>{f.q}</span>
                  <Plus
                    aria-hidden
                    weight="bold"
                    className={cx(
                      "mt-0.5 size-5 shrink-0 text-muted transition-transform duration-300 ease-[var(--ease-out)] group-hover:text-paper",
                      on && "rotate-45 text-rouge",
                    )}
                  />
                </button>
              </h3>
              <div
                id={`${id}a${n}`}
                role="region"
                aria-labelledby={`${id}q${n}`}
                inert={!on}
                className={cx(
                  "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p
                    className={cx(
                      "max-w-[60ch] px-5 pb-6 text-body transition-opacity duration-500 md:px-6 md:pb-7",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ── Footer: the cookie settings link needs the browser ── */
export function CookiesLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
