import { MapPin, Sparkle } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Portrait } from "@/components/portrait";
import type { Companion } from "@/lib/companions";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* ── Wordmark ─────────────────────────────────────────── */
// shortcut: monogram + set name; swap for the real AMORA logo SVG once supplied.
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)} aria-label="Amora">
      <span className="foil grid size-7 place-items-center rounded-[0.6rem] font-display text-lg italic leading-none shadow-glow" aria-hidden>
        a
      </span>
      <span className="font-display text-[1.6rem] leading-none tracking-[-0.04em] text-ivory" aria-hidden>
        Amora
      </span>
    </span>
  );
}

/* ── Button ───────────────────────────────────────────── */
const button = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[0.01em] select-none transition-[transform,filter,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  variant: {
    primary: "foil shadow-glow hover:brightness-110",
    secondary: "glass text-ivory hover:border-champagne-lo/50",
    ghost: "text-muted hover:text-ivory",
  },
  size: { md: "h-11 px-5 text-[0.9375rem]", lg: "h-14 px-8 text-base" },
};
type ButtonStyle = { variant?: keyof typeof button.variant; size?: keyof typeof button.size };

export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & ButtonStyle) {
  return <button className={cx(button.base, button.variant[variant], button.size[size], className)} {...props} />;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={cx(button.base, button.variant[variant], button.size[size], className)} {...props} />;
}

/* ── Chip ─────────────────────────────────────────────── */
// Toggle chip when `pressed` is passed, action chip with only onClick, static tag otherwise.
export function Chip({ pressed, className, children, ...props }: ComponentProps<"button"> & { pressed?: boolean }) {
  if (pressed === undefined && !props.onClick)
    return (
      <span className={cx("inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-ivory/[0.04] px-3.5 text-[0.8125rem] text-muted", className)}>
        {children}
      </span>
    );
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97]",
        pressed ? "foil shadow-glow" : "glass text-muted hover:text-ivory",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Avatar ───────────────────────────────────────────── */
const avatarSize = { sm: "size-10", md: "size-14", lg: "size-[4.5rem]" };

export function Avatar({
  companion,
  size = "md",
  story,
  showOnline = true,
}: {
  companion: Companion;
  size?: keyof typeof avatarSize;
  /** Unseen story: draws the brushed-gold ring. */
  story?: boolean;
  showOnline?: boolean;
}) {
  return (
    <span
      className={cx(
        "relative inline-block shrink-0 rounded-full",
        avatarSize[size],
        story && "p-[2px] [background:conic-gradient(from_210deg,#8c6a3a,#f3e2be,#c9a46a,#6b3a6e,#8c6a3a)]",
      )}
    >
      <span className={cx("relative block size-full overflow-hidden rounded-full bg-ink-800", story && "ring-2 ring-ink-950")}>
        <Portrait companion={companion} face />
      </span>
      {showOnline && companion.online && (
        <span className="absolute right-0 bottom-0 size-3 rounded-full bg-sage ring-2 ring-ink-950">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  );
}

/* ── Companion card ───────────────────────────────────── */
export function CompanionCard({ companion: c, href, priority }: { companion: Companion; href: string; priority?: boolean }) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-ink-850 shadow-lift outline-offset-4 transition-transform duration-200 ease-out active:scale-[0.98]"
    >
      <Portrait companion={c} priority={priority} className="transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]" />
      {/* Grade: plum from above, ink from below, so every portrait sits in the same room. */}
      <div className="absolute inset-0 bg-linear-to-b from-plum/25 via-transparent to-ink-950/95" />
      <div className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-ivory/10 transition-[box-shadow] duration-300 group-hover:ring-gold/40" />
      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        {c.isNew ? (
          <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-champagne">
            <Sparkle weight="fill" className="size-3" aria-hidden />
            New
          </span>
        ) : (
          <span />
        )}
        {c.online && (
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] text-ivory">
            <span className="size-1.5 rounded-full bg-sage" aria-hidden />
            Online
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        {/* Name wraps to two lines at most (it identifies her); city and tagline stay quiet below. */}
        <p className="line-clamp-2 font-display text-[clamp(1.5rem,6vw,2rem)] leading-[0.95] text-ivory [overflow-wrap:anywhere]" title={c.name}>
          {c.name} <em className="text-[0.6em] text-champagne">{c.age}</em>
        </p>
        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] text-muted">
          <MapPin weight="light" className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{c.city}</span>
        </p>
      </div>
    </Link>
  );
}

/* ── Input ────────────────────────────────────────────── */
export function Field({ label, hint, icon, className, id, ...props }: ComponentProps<"input"> & { label: string; hint?: string; icon?: ReactNode }) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className={cx("block", className)}>
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <span className="glass flex h-13 items-center gap-3 rounded-2xl px-4 transition-colors duration-150 focus-within:border-champagne-lo/70">
        {icon && <span className="text-faint">{icon}</span>}
        <input id={inputId} className="h-full w-full bg-transparent text-base text-ivory placeholder:text-faint focus:outline-none" {...props} />
      </span>
      {hint && <span className="mt-2 block text-[0.8125rem] text-faint">{hint}</span>}
    </label>
  );
}

/* ── Chat bubble + typing ─────────────────────────────── */
export function Bubble({ from, children, className }: { from: "her" | "me"; children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "max-w-[82%] rounded-[1.375rem] px-4 py-2.5 text-[0.9375rem] leading-relaxed [overflow-wrap:anywhere]",
        from === "her" ? "glass self-start rounded-bl-md text-ivory" : "self-end rounded-br-md bg-linear-to-br from-oxblood to-plum-hi text-champagne-hi shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Typing({ className }: { className?: string }) {
  return (
    <div className={cx("glass flex h-10 w-16 items-center justify-center gap-1.5 self-start rounded-[1.375rem] rounded-bl-md", className)} aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 rounded-full bg-champagne motion-safe:animate-[breathe_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}
