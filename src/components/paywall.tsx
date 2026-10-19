"use client";

import { useState } from "react";
import { Check, CheckCircle, Coins, Crown } from "@phosphor-icons/react/ssr";
import { Sheet } from "@/components/sheet";
import { Button } from "@/components/ui";
import { coinPacks, plans } from "@/lib/plans";
import { setWallet, useWallet } from "@/lib/wallet";

/** The one place money is asked for: Premium first, coins as the quiet alternative. */
export function Paywall({ open, onClose, reason }: { open: boolean; onClose: () => void; reason?: string }) {
  const { premium } = useWallet();
  const [annual, setAnnual] = useState(true);
  const [done, setDone] = useState<string | null>(null);

  // shortcut: demo purchases credit instantly; real checkout (USDT/USDC) replaces these handlers.
  const buyPlan = () => {
    setWallet((w) => ({ premium: true, coins: w.coins + 1800 }));
    setDone("You're Premium. 1,800 coins added.");
  };
  const buyCoins = (n: number) => {
    setWallet((w) => ({ coins: w.coins + n }));
    setDone(`${n.toLocaleString()} coins added.`);
  };
  const close = () => {
    setDone(null);
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title="Unlock more">
      {done ? (
        <div className="py-6 text-center">
          <CheckCircle weight="thin" className="mx-auto size-16 text-gold" aria-hidden />
          <p className="mt-3 font-display text-4xl">Welcome in.</p>
          <p className="mt-3 text-muted">{done}</p>
          <Button size="lg" className="mt-8 w-full" onClick={close}>
            Back to her
          </Button>
        </div>
      ) : (
        <>
          {reason && <p className="mb-3 text-sm text-champagne">{reason}</p>}
          {!premium && (
            <section className="aura sheen relative rounded-card p-5 ring-1 ring-gold/35">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-3xl">
                    <Crown weight="duotone" className="size-6 text-gold" aria-hidden />
                    Premium
                  </h2>
                  <p className="mt-1 text-sm text-muted">Every photo she sends, no locks.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnnual(!annual)}
                  className="shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-xs text-muted hover:text-ivory"
                  aria-label={`Billing: ${annual ? "annual" : "monthly"}. Switch`}
                >
                  {annual ? "Annual · −30%" : "Monthly"}
                </button>
              </div>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl tabular-nums">${plans.premium[annual ? "annual" : "monthly"]}</span>
                <span className="text-muted">/ month</span>
              </p>
              <p className="mt-1 text-xs text-faint">{annual ? `$${(plans.premium.annual * 12).toFixed(2)} once for 12 months` : "Billed monthly"} · no auto-renew</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-ivory">
                {plans.premium.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check weight="bold" className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-5 w-full" onClick={buyPlan}>
                Go Premium
              </Button>
            </section>
          )}

          <h2 id="coins" className={`text-sm font-medium text-muted ${premium ? "" : "mt-6"}`}>
            {premium ? "Top up coins" : "Or just top up coins"}
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {coinPacks.map((p) => (
              <button
                key={p.coins}
                type="button"
                onClick={() => buyCoins(p.coins)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-4 transition-[transform,border-color] duration-150 active:scale-[0.97] ${p.best ? "border-gold/60 bg-gold/10 shadow-glow" : "border-line-strong bg-ink-950/40 hover:border-champagne-lo/50"}`}
              >
                <Coins weight="duotone" className="size-6 text-gold" aria-hidden />
                <span className="font-medium tabular-nums">{p.coins.toLocaleString()}</span>
                <span className="text-sm text-muted tabular-nums">${p.price}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-faint">Pay with USDT / USDC · Discreet: “Amora” never appears on statements · Demo: no payment is taken</p>
        </>
      )}
    </Sheet>
  );
}
