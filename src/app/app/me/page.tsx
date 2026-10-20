"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, Coins, SealCheck } from "@phosphor-icons/react/ssr";
import { openCookieSettings } from "@/components/cookie-banner";
import { Record } from "@/components/me/record";
import { Paywall } from "@/components/paywall";
import { Sheet } from "@/components/sheet";
import { Button, cx, Glyph, Switch } from "@/components/ui";
import { achievements } from "@/lib/achievements";
import { coinPacks, plans } from "@/lib/plans";
import { resetProgress, useProgress } from "@/lib/progress";
import { resetWallet, setWallet, useWallet } from "@/lib/wallet";

/** One settings row: a label, a quiet line under it, and a control or an arrow on the right. */
function Row({ title, note, children, onClick, href, danger }: { title: string; note?: string; children?: ReactNode; onClick?: () => void; href?: string; danger?: boolean }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className={cx("block text-body", danger ? "text-rouge" : "text-paper")}>{title}</span>
        {note && <span className="mt-0.5 block text-small text-muted">{note}</span>}
      </span>
      {children ?? <ArrowRight className="size-[1.125rem] shrink-0 text-faint transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:text-paper" aria-hidden />}
    </>
  );
  const cls = "group flex min-h-16 w-full items-center gap-4 bg-ink-2 px-4 py-3 text-left md:px-5";
  if (href)
    return (
      <Link href={href} className={cx(cls, "press hover:bg-ink-3 active:bg-ink-4")}>
        {body}
      </Link>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cx(cls, "press hover:bg-ink-3 active:bg-ink-4")}>
        {body}
      </button>
    );
  return <div className={cls}>{body}</div>;
}

export default function Me() {
  const w = useWallet();
  const progress = useProgress();
  const router = useRouter();
  const [paywall, setPaywall] = useState(false);
  const [notify, setNotify] = useState(true);
  const [discreet, setDiscreet] = useState(true);
  const [reset, setReset] = useState(false);
  const [del, setDel] = useState<"closed" | "confirm" | "working" | "done">("closed");
  const [typed, setTyped] = useState("");
  const earned = Object.keys(progress.earned).length;

  // shortcut: mock deletion; production calls the account deletion API and signs out on success.
  const deleteAccount = () => {
    setDel("working");
    setTimeout(() => {
      resetWallet();
      resetProgress();
      setDel("done");
    }, 1200);
  };
  const closeDelete = () => del !== "working" && (setDel("closed"), setTyped(""));
  // shortcut: mock coin purchase; real checkout (USDT/USDC) replaces this.
  const buyCoins = (n: number) => {
    setWallet((x) => ({ coins: x.coins + n }));
    toast(`${n.toLocaleString()} coins added`);
  };

  return (
    <main className="page">
      {/* The member, set like a name on the agency board. */}
      <header className="rise">
        {/* A long name drops to the headline size instead of being chopped mid-word at mega. */}
        <h1 className={cx("line-clamp-2 font-display [overflow-wrap:anywhere]", w.name.length > 12 ? "text-head" : "text-title")}>{w.name}</h1>
        <p className="mt-4 text-body text-paper md:mt-5">
          {w.premium ? "Premium member" : "Free member"}
          <span className="text-muted"> · </span>
          <span className="text-muted">{w.email}</span>
        </p>
      </header>

      <nav aria-label="On this page" className="rise mt-6 grid grid-cols-3 gap-2 [--i:1] md:mt-8 md:max-w-2xl">
        {[
          ["#premium", "Membership", w.premium ? "Premium" : "Free"],
          ["#coins", "Coins", w.coins.toLocaleString()],
          ["#record", "Record", `${earned}/${achievements.length}`],
        ].map(([href, label, value]) => (
          <a key={href} href={href} className="press flex min-w-0 flex-col bg-ink-2 p-3 hover:bg-ink-3 active:bg-ink-4 md:p-4">
            <span className="text-small text-muted">{label}</span>
            <span className="mt-1 truncate text-body font-medium tabular md:text-lead">{value}</span>
          </a>
        ))}
      </nav>

      {/* Membership: the ticket on a paper field. */}
      <section id="premium" aria-label="Membership" className="rise mt-12 scroll-mt-28 [--i:2] md:mt-16">
        {w.premium ? (
          <div className="bg-paper p-6 text-ink md:p-8">
            <SealCheck weight="fill" className="size-8 text-rouge-lo" aria-hidden />
            <h2 className="mt-6 font-display text-head">Premium</h2>
            <p className="mt-4 max-w-[46ch] text-body">Active. Every photo unlocked, unlimited messages, priority replies. Prepaid, so nothing auto-renews.</p>
          </div>
        ) : (
          <div className="grid bg-paper text-ink md:grid-cols-[1fr_20rem]">
            <div className="p-6 md:p-8">
              <h2 className="font-display text-head">Premium</h2>
              <p className="mt-4 max-w-[40ch] text-body">Every photo she sends, no locks, no counting messages.</p>
              <ul className="mt-6 grid gap-x-8 gap-y-2 text-body lg:max-w-2xl lg:grid-cols-2">
                {plans.premium.perks.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <Check weight="bold" className="size-4 shrink-0 text-rouge-lo" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col bg-paper-2 p-6 md:p-8">
              <p className="text-body">From</p>
              <p className="mt-1 font-display text-head tabular">${plans.premium.annual}</p>
              <p className="mt-2 text-small text-ink/70">a month, paid once for 12 months. Nothing auto-renews.</p>
              <Button size="lg" arrow className="mt-6 w-full md:mt-auto" onClick={() => setPaywall(true)}>
                Go Premium
              </Button>
            </div>
          </div>
        )}
      </section>

      <section id="coins" aria-labelledby="coins-h" className="mt-2 scroll-mt-28 bg-ink-2 p-5 md:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-8">
          <div>
            <h2 id="coins-h" className="text-body text-muted">
              Coins
            </h2>
            <p className="mt-2 flex items-center gap-3 font-display text-[clamp(2.25rem,1rem+5vw,4.75rem)] leading-[0.92] tabular">
              {w.coins.toLocaleString()}
              <Coins weight="fill" className="size-[0.6em] shrink-0 text-rouge" aria-hidden />
            </p>
            <p className="mt-3 text-body text-muted">For one-off unlocks and gifts.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {coinPacks.map((c) => (
              <button
                key={c.coins}
                type="button"
                onClick={() => buyCoins(c.coins)}
                className={cx("press flex min-h-24 min-w-0 flex-col items-start justify-between p-3 text-left md:p-4", c.best ? "bg-paper text-ink hover:bg-white" : "bg-ink-4 hover:bg-ink-5")}
              >
                <span className="text-small">{c.best ? <span className="text-rouge-lo">Best value</span> : " "}</span>
                <span>
                  <span className="block text-body font-medium tabular sm:text-lead">{c.coins.toLocaleString()}</span>
                  <span className={cx("block text-small tabular", c.best ? "text-ink/70" : "text-muted")}>${c.price}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="record" aria-label="Achievements" className="mt-16 scroll-mt-28 md:mt-24">
        <Record />
      </section>

      <section aria-labelledby="settings-h" className="mt-16 md:mt-24">
        <h2 id="settings-h" className="font-display text-head">
          Settings
        </h2>
        <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-x-8">
          <div>
            <h3 className="mb-3 text-body font-medium">Notifications</h3>
            <div className="grid gap-1">
              <Row title="When she messages you" note="A quiet buzz, nothing more.">
                <Switch label="Notifications" on={notify} onChange={setNotify} />
              </Row>
              <Row title="Discreet previews" note="Hide her name and words on your lock screen.">
                <Switch label="Discreet previews" on={discreet} onChange={setDiscreet} />
              </Row>
              {/* What a glance at the phone would show. */}
              <div className="bg-ink-2 p-4 md:px-5" aria-live="polite">
                <p className="text-small text-muted">Lock screen preview</p>
                <div className={cx("mt-3 flex items-center gap-3 bg-ink-4 p-3 transition-opacity duration-300", !notify && "opacity-40")}>
                  <span className="grid size-10 shrink-0 place-items-center bg-ink-2"><Glyph className="text-[0.875rem]" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between gap-3 text-small">
                      <span className="font-medium text-paper">{!notify ? "Off" : discreet ? "Amora" : "Emma"}</span>
                      <span className="text-faint">now</span>
                    </p>
                    <p className="truncate text-small text-paper/80">{!notify ? "You won't be notified." : discreet ? "New message" : "are you still up? i can't sleep"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-body font-medium">Privacy</h3>
            <div className="grid gap-1">
              <Row title="Discreet billing" note="Crypto (USDT / USDC). Statements never say Amora.">
                <span />
              </Row>
              <Row title="Cookie settings" note="Essential only, unless you turn more on." onClick={openCookieSettings} />
              <Row title="Privacy policy" note="Conversations are stored encrypted." href="#" />
            </div>

            <h3 className="mt-8 mb-3 text-body font-medium">Account</h3>
            <div className="grid gap-1">
              <Row title="Sign out" href="/login" />
              <Row title="Reset demo data" note="Coins, membership and your record start over." onClick={() => setReset(true)} />
              <Row title="Delete account" note="Permanently, with everything in it." onClick={() => setDel("confirm")} danger />
            </div>
          </div>
        </div>
      </section>

      <Paywall open={paywall} onClose={() => setPaywall(false)} />

      <Sheet open={reset} onClose={() => setReset(false)} title="Reset demo data">
        <h2 className="font-display text-head">Start over?</h2>
        <p className="mt-3 text-body text-muted">Your coins, Premium and every achievement go back to the beginning. Only this demo is affected.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button
            size="lg"
            onClick={() => {
              resetWallet();
              resetProgress();
              setReset(false);
              toast("Demo data reset");
            }}
          >
            Reset
          </Button>
          <Button size="lg" variant="secondary" onClick={() => setReset(false)}>
            Keep it
          </Button>
        </div>
      </Sheet>

      <Sheet open={del !== "closed"} onClose={closeDelete} title="Delete account">
        {del === "done" ? (
          <div>
            <h2 className="font-display text-head">Deleted</h2>
            <p className="mt-4 max-w-[36ch] text-body text-muted">Your profile, conversations and coins are gone. Thank you for the time you spent here.</p>
            <Button size="lg" variant="paper" className="mt-8 w-full" onClick={() => router.push("/")}>
              Leave Amora
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typed === "DELETE") deleteAccount();
            }}
          >
            <div className="-mx-5 -mt-8 bg-oxblood px-5 pt-10 pb-6 md:-mx-8 md:px-8">
              <h2 className="font-display text-head">Delete your account?</h2>
              <p className="mt-4 text-body text-paper">This permanently removes, for good:</p>
            </div>
            <ul className="mt-5 grid gap-1">
              {["Your profile and sign-in", "Every conversation and what she remembers", "Photos you unlocked", `Your ${w.coins.toLocaleString()} coins${w.premium ? " and Premium" : ""}, with no refund`].map((t) => (
                <li key={t} className="flex items-center gap-3 bg-ink-3 px-4 py-3 text-body">
                  <span className="size-1.5 shrink-0 bg-rouge" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <label className="mt-6 block">
              <span className="text-small text-muted">
                Type <strong className="font-semibold text-paper">DELETE</strong> to confirm
              </span>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="mt-2 h-12 w-full bg-ink-3 px-4 text-base text-paper tracking-[0.2em] transition-[background-color,box-shadow] duration-150 hover:bg-ink-4 focus:bg-ink-4 focus:ring-2 focus:ring-rouge outline-none!"
              />
            </label>
            <Button type="submit" size="lg" className="mt-6 w-full" loading={del === "working"} disabled={typed !== "DELETE"}>
              Delete my account
            </Button>
            <Button type="button" variant="ghost" className="mt-2 w-full" onClick={closeDelete} disabled={del === "working"}>
              Keep my account
            </Button>
          </form>
        )}
      </Sheet>
    </main>
  );
}
