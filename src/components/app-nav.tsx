"use client";

import { ChatsCircle, Coins, Compass, Crown, UserCircle } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink, Wordmark } from "@/components/ui";
import { useWallet } from "@/lib/wallet";

const tabs = [
  { href: "/app", label: "Discover", Icon: Compass, match: (p: string) => p === "/app" },
  { href: "/app/chats", label: "Chats", Icon: ChatsCircle, match: (p: string) => p.startsWith("/app/chats") },
  { href: "/app/me", label: "You", Icon: UserCircle, match: (p: string) => p.startsWith("/app/me") },
];

function CoinPill() {
  const { coins } = useWallet();
  return (
    <Link
      href="/app/me#coins"
      className="glass inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ivory tabular-nums transition-colors hover:border-gold/50"
      aria-label={`${coins} coins`}
    >
      <Coins weight="duotone" className="size-4 text-gold" aria-hidden />
      {coins.toLocaleString()}
    </Link>
  );
}

/** Desktop: left rail. Mobile: top bar + floating glass tab bar (hidden on detail pages, which carry their own action). */
export function AppNav() {
  const path = usePathname();
  const { premium } = useWallet();
  const detail = !tabs.some((t) => t.match(path));

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-ink-950/70 px-4 py-7 backdrop-blur-xl md:flex">
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
                className={`flex h-12 items-center gap-3 rounded-2xl px-3 text-[0.9375rem] transition-colors ${on ? "glass text-ivory" : "text-muted hover:text-ivory"}`}
              >
                <Icon weight={on ? "duotone" : "light"} className={`size-[1.375rem] ${on ? "text-champagne" : ""}`} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <CoinPill />
          {!premium && (
            <div className="aura sheen relative rounded-card p-5 ring-1 ring-gold/25">
              <Crown weight="duotone" className="size-7 text-gold" aria-hidden />
              <p className="mt-3 font-display text-2xl">Premium</p>
              <p className="mt-1 text-sm text-muted">Everything she sends, no locks.</p>
              <ButtonLink href="/app/me" className="mt-4 h-9 w-full text-sm">
                Become a member
              </ButtonLink>
            </div>
          )}
        </div>
      </aside>

      {!detail && (
        <>
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink-950/60 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:hidden">
            <Link href="/" aria-label="Amora home">
              <Wordmark className="origin-left scale-90" />
            </Link>
            <CoinPill />
          </header>
          <nav
            className="glass fixed inset-x-4 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-3 rounded-full p-1.5 shadow-lift md:hidden"
            aria-label="App"
          >
            {tabs.map(({ href, label, Icon, match }) => {
              const on = match(path);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`flex h-13 flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] transition-colors select-none ${on ? "bg-ivory/[0.07] text-ivory" : "text-faint"}`}
                >
                  <Icon weight={on ? "fill" : "light"} className={`size-6 transition-transform duration-150 active:scale-90 ${on ? "text-champagne" : ""}`} aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </>
  );
}
