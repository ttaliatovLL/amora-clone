"use client";

import { ChatsCircle, Coins, Compass, Crown, UserCircle } from "@phosphor-icons/react/ssr";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink, Wordmark } from "@/components/ui";
import { useWallet } from "@/lib/wallet";

const tabs = [
  { href: "/app", label: "Discover", Icon: Compass, match: (p: string) => p === "/app" },
  { href: "/app/chats", label: "Chats", Icon: ChatsCircle, match: (p: string) => p.startsWith("/app/chats") },
  { href: "/app/me", label: "You", Icon: UserCircle, match: (p: string) => p.startsWith("/app/me") },
];

// The selection lens glides between tabs instead of blinking: same spring as the sheets.
const lens = { type: "spring", duration: 0.45, bounce: 0.18 } as const;

function CoinPill() {
  const { coins } = useWallet();
  return (
    <Link
      href="/app/me#coins"
      className="glass inline-flex h-9 items-center gap-1.5 rounded-full pr-3.5 pl-2 text-sm font-medium text-ivory tabular-nums transition-transform active:scale-95"
      aria-label={`${coins} coins`}
    >
      <span className="grid size-5 place-items-center rounded-full bg-linear-to-b from-[#f6e6c4] to-[#a7854c] text-ink-950 shadow-[inset_0_1px_0_#fff8]">
        <Coins weight="bold" className="size-3" aria-hidden />
      </span>
      {coins.toLocaleString()}
    </Link>
  );
}

/** Desktop: left rail. Mobile: condensing top bar + floating liquid-glass tab bar (hidden on detail pages, which carry their own action). */
export function AppNav() {
  const path = usePathname();
  const { premium } = useWallet();
  const detail = !tabs.some((t) => t.match(path));

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-ink-950/60 px-4 py-7 backdrop-blur-2xl md:flex">
        <Link href="/" className="px-3" aria-label="Amora home">
          <Wordmark />
        </Link>
        <nav className="mt-12 flex flex-col gap-1" aria-label="App">
          {tabs.map(({ href, label, Icon, match }) => {
            const on = match(path);
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={`relative flex h-12 items-center gap-3 rounded-2xl px-3 text-[0.9375rem] transition-colors ${on ? "text-ivory" : "text-muted hover:text-ivory"}`}
              >
                {on && <motion.span layoutId="rail-lens" transition={lens} className="glass absolute inset-0 rounded-2xl" />}
                <Icon weight={on ? "fill" : "regular"} className="relative size-[1.375rem]" aria-hidden />
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <CoinPill />
          {!premium && (
            <div className="panel gilt sheen relative rounded-card p-5">
              <Crown weight="regular" className="size-6 text-gold" aria-hidden />
              <p className="mt-3 font-display text-2xl">Premium</p>
              <p className="mt-1 text-sm text-muted">Everything she sends, no locks.</p>
              <ButtonLink href="/app/me" variant="premium" className="relative z-[2] mt-4 h-9 w-full text-sm">
                Become a member
              </ButtonLink>
            </div>
          )}
        </div>
      </aside>

      {!detail && (
        <>
          <header className="condense sticky top-0 z-40 border-b border-transparent pt-[env(safe-area-inset-top)] md:hidden">
            <div className="flex h-14 items-center justify-between px-4">
              <Link href="/" aria-label="Amora home" className="transition-transform active:scale-95">
                <Wordmark className="gap-2 [&_svg:first-child]:size-6" />
              </Link>
              <CoinPill />
            </div>
          </header>
          <nav
            className="glass fixed inset-x-0 bottom-[max(0.875rem,env(safe-area-inset-bottom))] z-40 mx-auto grid w-[min(20rem,calc(100%-2.5rem))] grid-cols-3 rounded-full p-1 shadow-lift md:hidden"
            aria-label="App"
          >
            {tabs.map(({ href, label, Icon, match }) => {
              const on = match(path);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] font-medium transition-colors duration-200 select-none active:scale-95 ${on ? "text-ivory" : "text-faint"}`}
                >
                  {on && (
                    <motion.span
                      layoutId="tab-lens"
                      transition={lens}
                      className="absolute inset-0 rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgb(255_255_255/0.22),inset_0_-1px_0_rgb(255_255_255/0.05)]"
                    />
                  )}
                  <Icon weight={on ? "fill" : "regular"} className="relative size-[1.375rem]" aria-hidden />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </>
  );
}
