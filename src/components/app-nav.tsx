"use client";

import { BookmarkSimple, ChatCircle, Coins, SquaresFour, User } from "@phosphor-icons/react/ssr";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LiquidGlass } from "@/components/liquid-glass";
import { ButtonLink, Wordmark } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { useWallet } from "@/lib/wallet";

const tabs = [
  { href: "/app", label: "Board", Icon: SquaresFour, match: (p: string) => p === "/app" },
  { href: "/app/saved", label: "Saved", Icon: BookmarkSimple, match: (p: string) => p.startsWith("/app/saved") },
  { href: "/app/chats", label: "Chats", Icon: ChatCircle, match: (p: string) => p.startsWith("/app/chats") },
  { href: "/app/me", label: "You", Icon: User, match: (p: string) => p.startsWith("/app/me") },
];

// The selection glides between tabs instead of blinking.
const lens = { type: "spring", duration: 0.45, bounce: 0.15 } as const;

function Coins_() {
  const { coins } = useWallet();
  return (
    <Link href="/app/me#coins" className="press inline-flex h-10 items-center gap-2 bg-ink-3 px-3.5 text-small font-medium tabular hover:bg-ink-4" aria-label={`${coins} coins`}>
      <Coins weight="fill" className="size-4 text-rouge" aria-hidden />
      {coins.toLocaleString()}
    </Link>
  );
}

/** Desktop: a plain top bar. Mobile: a slim top bar and a floating liquid-glass dock (hidden on detail pages, which carry their own action). */
export function AppNav() {
  const path = usePathname();
  const { premium } = useWallet();
  const saved = useProgress().saved.length;
  const detail = !tabs.some((t) => t.match(path));

  return (
    <>
      <header className={`sticky top-0 z-40 bg-ink pt-[env(safe-area-inset-top)] ${detail ? "max-md:hidden" : ""}`}>
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-10 px-4 md:h-20 md:px-8">
          <Link href="/" aria-label="Amora home" className="press">
            <Wordmark className="md:text-[1.2rem]" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="App">
            {tabs.map(({ href, label, match }) => {
              const on = match(path);
              return (
                <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`relative px-4 py-2.5 text-body transition-colors ${on ? "text-paper" : "text-muted hover:text-paper"}`}>
                  {on && <motion.span layoutId="bar-lens" transition={lens} className="absolute inset-0 bg-ink-3" />}
                  <span className="relative">
                    {label}
                    {label === "Saved" && saved > 0 && <span className="ml-1.5 text-rouge tabular">{saved}</span>}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Coins_ />
            {!premium && (
              <span className="hidden md:block">
                <ButtonLink href="/app/me#premium" size="sm">
                  Become a member
                </ButtonLink>
              </span>
            )}
          </div>
        </div>
      </header>

      {!detail && (
        <LiquidGlass
          as="nav"
          aria-label="App"
          className="fixed inset-x-0 bottom-[max(0.875rem,env(safe-area-inset-bottom))] z-40 mx-auto grid h-[4.25rem] w-[min(22rem,calc(100%-2rem))] grid-cols-4 p-1.5 md:hidden"
        >
          {tabs.map(({ href, label, Icon, match }) => {
            const on = match(path);
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={`press relative flex flex-col items-center justify-center gap-0.5 rounded-full text-[0.75rem] font-medium select-none ${on ? "text-paper" : "text-paper/60"}`}
              >
                {on && <motion.span layoutId="dock-lens" transition={lens} className="absolute inset-0 rounded-full bg-paper/14" />}
                <Icon weight={on ? "fill" : "regular"} className="relative size-[1.375rem]" aria-hidden />
                <span className="relative">{label}</span>
                {label === "Saved" && saved > 0 && (
                  <span className="absolute top-1.5 right-[calc(50%-1.25rem)] grid h-4 min-w-4 place-items-center rounded-full bg-rouge px-1 text-[0.625rem] font-semibold text-ink tabular">
                    {saved}
                  </span>
                )}
              </Link>
            );
          })}
        </LiquidGlass>
      )}
    </>
  );
}
