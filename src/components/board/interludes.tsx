import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Portrait } from "@/components/portrait";
import { Avatar, cx } from "@/components/ui";
import { bios, type Companion } from "@/lib/companions";

// Grid cells that break the run of photographs. Same box as a card, so the grid never reflows around them.
const box = (tile: boolean) => cx("@container relative block", tile ? "aspect-[3/4]" : "aspect-[4/5]");

/** One line from her bio on the paper field, in her own words; her card follows it on the board. */
export function QuoteCell({ companion: c, tile }: { companion: Companion; tile: boolean }) {
  const line = (bios[c.id] ?? c.tagline).split(/(?<=[.!?])\s/)[0];
  return (
    <Link href={`/app/${c.id}`} className={cx(box(tile), "press group flex flex-col bg-paper p-3 text-ink @[15rem]:p-5 hover:bg-white")}>
      <span aria-hidden className="font-display text-[clamp(2rem,22cqw,4.5rem)] leading-[0.8]">&ldquo;</span>
      <p className="mt-2 line-clamp-6 text-[clamp(0.9375rem,8.5cqw,1.625rem)] leading-[1.2] font-medium [overflow-wrap:anywhere] [text-wrap:pretty]">{line}</p>
      <span className="mt-auto flex items-center gap-2 pt-3 text-small font-medium">
        <Avatar companion={c} size="sm" showOnline={false} />
        <span className="min-w-0 truncate">{c.name}</span>
        <ArrowRight weight="bold" aria-hidden className="ml-auto size-4 shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** The way into Discover: three of them fanned like comp cards on a desk; the fan opens on hover. */
export function DiscoverCell({ faces, tile }: { faces: Companion[]; tile: boolean }) {
  const fan = ["-rotate-[9deg] -translate-x-[38%] group-hover:-rotate-[14deg] group-hover:-translate-x-[52%]", "z-[1] -translate-y-[4%] group-hover:-translate-y-[9%]", "rotate-[9deg] translate-x-[38%] group-hover:rotate-[14deg] group-hover:translate-x-[52%]"];
  return (
    <Link href="/app/discover" className={cx(box(tile), "press group flex flex-col overflow-hidden bg-ink-3 p-3 hover:bg-ink-4 @[15rem]:p-5")}>
      <span aria-hidden className="relative mx-auto mt-[8%] grid w-[44%] flex-1 place-items-center">
        {faces.slice(0, 3).map((c, i) => (
          <span key={c.id} className={cx("absolute aspect-[4/5] w-full overflow-hidden bg-ink-2 transition-transform duration-500 ease-[var(--ease-out)]", fan[i])}>
            <Portrait companion={c} sizes="120px" />
          </span>
        ))}
      </span>
      <span className="relative mt-4 block font-display text-[clamp(0.875rem,8cqw,1.5rem)] leading-none">One at a time</span>
      <span className="relative mt-2 flex items-center gap-1.5 text-small text-muted group-hover:text-paper">
        Open Discover
        <ArrowRight weight="bold" aria-hidden className="size-4 shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
