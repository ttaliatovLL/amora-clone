"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Coins } from "@phosphor-icons/react/ssr";
import { Sheet } from "@/components/sheet";
import { Silk } from "@/components/silk";
import { Button, cx, Segmented } from "@/components/ui";
import { coinPacks, plans } from "@/lib/plans";
import { track } from "@/lib/progress";
import { setWallet, useWallet } from "@/lib/wallet";

const usd = (n: number) => `$${n.toFixed(2)}`;

/** The one place money is asked for: Premium is the decision; coins sit underneath as the quiet alternative. */
export function Paywall({ open, onClose, reason }: { open: boolean; onClose: () => void; reason?: string }) {
  const { premium } = useWallet();
  const [annual, setAnnual] = useState(true);
  const p = plans.premium;
  const total = annual ? p.annual * 12 : p.monthly;

  // HANDOVER: real checkout + server-side coin ledger (adult/AI-companion = high-risk merchant). See docs/INTEGRATIONS.md#4-payments-coins-and-premium
  // shortcut: demo purchases credit instantly; real checkout (USDT/USDC) replaces these handlers.
  const buyPlan = () => {
    setWallet((w) => ({ premium: true, coins: w.coins + 1800 }));
    track.premium();
    toast("You're Premium. 1,800 coins added.");
    onClose();
  };
  const buyCoins = (n: number) => {
    setWallet((w) => ({ coins: w.coins + n }));
    toast(`${n.toLocaleString()} coins added`);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={premium ? "Top up coins" : "Premium"}>
      {!premium && (
        <>
          <header className="relative -mx-5 -mt-8 h-52 overflow-hidden md:-mx-8 md:h-56">
            <Silk className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 px-5 pb-5 md:px-8 md:pb-6">
              <h2 className="font-display text-head text-paper">Premium</h2>
              <p className="mt-2 max-w-[34ch] text-body text-paper">{reason ?? "Every photo she sends, no locks, no counting."}</p>
            </div>
          </header>

          <Segmented
            label="Billing"
            className="mt-6"
            value={annual}
            onChange={setAnnual}
            options={[
              { value: true, label: "Annual", note: "Save 30%" },
              { value: false, label: "Monthly", note: "One month" },
            ]}
          />

          <p className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-head tabular">{usd(annual ? p.annual : p.monthly)}</span>
            <span className="text-body text-muted">a month</span>
          </p>
          <p className="mt-2 text-small text-muted tabular">{annual ? `${usd(total)} once, for 12 months.` : `${usd(total)} for one month.`} Nothing auto-renews.</p>

          <ul className="mt-5 grid gap-2 text-body">
            {p.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <span className="grid size-5 shrink-0 place-items-center bg-ink-4">
                  <Check weight="bold" className="size-3 text-rouge" aria-hidden />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-6 w-full" onClick={buyPlan}>
            Go Premium · <span className="tabular">{usd(total)}</span>
          </Button>
          <p className="mt-3 text-small text-faint">Pay with USDT or USDC. Your statement never says Amora. Demo: no payment is taken.</p>
        </>
      )}

      <section aria-label="Coins" className={premium ? "" : "mt-6 bg-ink-3 p-4"}>
        <h2 className={premium ? "font-display text-head" : "text-body font-medium"}>{premium ? "Top up" : "Just this once? Top up coins"}</h2>
        {premium && <p className="mt-3 text-body text-muted">For one-off unlocks and gifts.</p>}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {coinPacks.map((c) => (
            <button
              key={c.coins}
              type="button"
              onClick={() => buyCoins(c.coins)}
              className={cx("press flex flex-col items-start gap-0.5 p-3 text-left", c.best ? "bg-paper text-ink hover:bg-white" : premium ? "bg-ink-3 hover:bg-ink-4" : "bg-ink-4 hover:bg-ink-5")}
            >
              <span className="flex items-center gap-1.5 font-medium tabular">
                <Coins weight="fill" className={cx("size-4", c.best ? "text-rouge-lo" : "text-rouge")} aria-hidden />
                {c.coins.toLocaleString()}
              </span>
              <span className={cx("text-small tabular", c.best ? "text-ink/70" : "text-muted")}>{usd(c.price)}</span>
            </button>
          ))}
        </div>
        {premium && <p className="mt-4 text-small text-faint">Pay with USDT or USDC. Demo: no payment is taken.</p>}
      </section>
    </Sheet>
  );
}
