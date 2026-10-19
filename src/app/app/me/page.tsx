"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import { Bell, Coins, Crown, EyeSlash, SignOut, Trash } from "@phosphor-icons/react/ssr";
import { Paywall } from "@/components/paywall";
import { Sheet } from "@/components/sheet";
import { Button } from "@/components/ui";
import { resetWallet, useWallet } from "@/lib/wallet";

function Toggle({ label, hint, on, onChange, icon: I }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void; icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p className="flex items-center gap-2.5 text-ivory">
          <I weight="regular" className="size-5 text-muted" aria-hidden />
          {label}
        </p>
        <p className="mt-0.5 pl-[1.875rem] text-sm text-muted">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative h-[1.9rem] w-[3.1rem] shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-sage" : "bg-white/15"}`}
      >
        <span className={`absolute top-0.5 left-0.5 size-[1.65rem] rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-out-expo ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function Me() {
  const w = useWallet();
  const router = useRouter();
  const [paywall, setPaywall] = useState(false);
  const [notify, setNotify] = useState(true);
  const [discreet, setDiscreet] = useState(true);
  const [del, setDel] = useState<"closed" | "confirm" | "working" | "done">("closed");
  const [typed, setTyped] = useState("");

  // shortcut: mock deletion; production calls the account deletion API and signs out on success.
  const deleteAccount = () => {
    setDel("working");
    setTimeout(() => {
      resetWallet();
      setDel("done");
    }, 1200);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pt-3 pb-36 sm:px-8 md:pt-10">
      <div className="flex items-center gap-4">
        <span className="pearl chrome grid size-16 place-items-center rounded-full font-display text-2xl" aria-hidden>
          {w.name[0]}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-4xl leading-none">{w.name}</h1>
          <p className="mt-1 truncate text-sm text-muted">{w.email}</p>
        </div>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className={`relative rounded-card p-5 ${w.premium ? "panel gilt sheen" : "glass"}`}>
          <Crown weight="fill" className="absolute top-5 right-5 size-5 text-gold" aria-hidden />
          <p className="text-sm text-muted">Membership</p>
          <p className="mt-1 font-display text-3xl">{w.premium ? "Premium" : "Free"}</p>
          <p className="mt-1 text-sm text-muted">{w.premium ? "Every photo unlocked. Prepaid, no auto-renew." : "20 messages a day, one free photo."}</p>
          {!w.premium && (
            <Button variant="premium" className="mt-4 w-full" onClick={() => setPaywall(true)}>
              Go Premium
            </Button>
          )}
        </div>
        <div id="coins" className="glass scroll-mt-20 rounded-card p-5">
          <p className="text-sm text-muted">Coins</p>
          <p className="mt-1 flex items-center gap-2 font-display text-3xl tabular-nums">
            <span className="grid size-7 place-items-center rounded-full bg-linear-to-b from-[#f6e6c4] to-[#a7854c] text-ink-950 shadow-[inset_0_1px_0_#fff8]">
              <Coins weight="bold" className="size-4" aria-hidden />
            </span>
            {w.coins.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-muted">For one-off unlocks and gifts.</p>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => setPaywall(true)}>
            Top up
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted">Privacy</h2>
        <div className="mt-2 divide-y divide-line border-y border-line">
          <Toggle icon={Bell} label="Notifications" hint="When she messages you." on={notify} onChange={setNotify} />
          <Toggle icon={EyeSlash} label="Discreet previews" hint="Hide names and text in notifications." on={discreet} onChange={setDiscreet} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-muted">Account</h2>
        <div className="mt-2 divide-y divide-line border-y border-line">
          <Link href="/login" className="flex items-center gap-2.5 py-4 text-ivory hover:text-blush">
            <SignOut weight="regular" className="size-5 text-muted" aria-hidden />
            Sign out
          </Link>
          <button type="button" onClick={() => setDel("confirm")} className="flex w-full items-center gap-2.5 py-4 text-left text-rose hover:underline hover:underline-offset-4">
            <Trash weight="regular" className="size-5" aria-hidden />
            Delete account
          </button>
        </div>
        <p className="mt-6 text-xs text-faint">
          Your conversations are stored encrypted. <Link href="#" className="underline underline-offset-4">Privacy policy</Link>
        </p>
      </section>

      <Paywall open={paywall} onClose={() => setPaywall(false)} />

      <Sheet open={del !== "closed"} onClose={() => del !== "working" && (setDel("closed"), setTyped(""))} title="Delete account">
        {del === "done" ? (
          <div className="py-6 text-center">
            <p className="font-display text-4xl">Account deleted.</p>
            <p className="mx-auto mt-3 max-w-[34ch] text-muted">Your profile, conversations and coins are gone. Thank you for the time you spent here.</p>
            <Button size="lg" className="mt-8 w-full" onClick={() => router.push("/")}>
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
            <h2 className="font-display text-3xl">Delete your account?</h2>
            <p className="mt-3 text-muted">This permanently removes, for good:</p>
            <ul className="mt-3 space-y-1.5 text-ivory">
              {["Your profile and sign-in", "Every conversation and what she remembers", "Photos you unlocked", `Your ${w.coins.toLocaleString()} coins${w.premium ? " and Premium" : ""} (no refund)`].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 size-1 shrink-0 rounded-full bg-rose" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <label className="mt-6 block">
              <span className="text-sm text-muted">
                Type <strong className="font-semibold text-ivory">DELETE</strong> to confirm
              </span>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                className="mt-2 h-12 w-full rounded-2xl border border-line-strong bg-black/30 px-4 text-base text-ivory focus:border-rose focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={typed !== "DELETE" || del === "working"}
              className="mt-6 h-14 w-full rounded-full border border-rose text-base font-medium text-rose transition-[background-color,opacity] duration-150 hover:bg-wine/20 active:scale-[0.98] disabled:opacity-40"
            >
              {del === "working" ? "Deleting…" : "Delete my account"}
            </button>
            <Button type="button" variant="ghost" className="mt-2 w-full" onClick={() => (setDel("closed"), setTyped(""))} disabled={del === "working"}>
              Keep my account
            </Button>
          </form>
        )}
      </Sheet>
    </main>
  );
}
