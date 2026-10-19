import { Camera, MapPin } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useId, ViewTransition, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { Portrait } from "@/components/portrait";
import type { Companion } from "@/lib/companions";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* ── Logo ─────────────────────────────────────────────── */
// The mark: two linked rings in polished steel; the left one passes over at the bottom crossing.
export function Glyph({ className }: { className?: string }) {
  // Per-instance id: a shared one resolves to the first copy, which may sit inside a hidden (display:none) rail.
  const id = useId();
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="3" y1="6" x2="25" y2="22">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#8d8d95" />
          <stop offset="0.55" stopColor="#f2f2f5" />
          <stop offset="0.8" stopColor="#5c5c64" />
          <stop offset="1" stopColor="#d6d6dc" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id})`} strokeWidth="1.7">
        <circle cx="10.5" cy="14" r="7.25" />
        <circle cx="17.5" cy="14" r="7.25" />
        <path d="M15.63 19.13A7.25 7.25 0 0 1 12.01 21.09" stroke="var(--color-ink-950)" strokeWidth="3.6" />
        <path d="M15.9 18.85A7.25 7.25 0 0 1 11.63 21.16" />
      </g>
    </svg>
  );
}

// Monoline lowercase wordmark, drawn on a 20-unit x-height: circles, stems and arches only.
export function Wordmark({ className, glyph = true }: { className?: string; glyph?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5 text-ivory", className)} role="img" aria-label="Amora">
      {glyph && <Glyph className="size-7 shrink-0" />}
      <svg viewBox="-1 -0.5 118 22" className="h-[0.95rem] w-auto" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9.5" cy="10.5" r="9.25" />
          <path d="M19 1.25V20" />
          <path d="M24 20V1.25M24 8.75a7.25 7.25 0 0 1 14.5 0V20M38.5 8.75a7.25 7.25 0 0 1 14.5 0V20" />
          <circle cx="67.5" cy="10.5" r="9.25" />
          <path d="M82 20V1.25M82 11C82 4.75 86 1.25 92 1.25" />
          <circle cx="105.5" cy="10.5" r="9.25" />
          <path d="M115 1.25V20" />
        </g>
      </svg>
    </span>
  );
}

/* ── Button ───────────────────────────────────────────── */
const button = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] select-none transition-[transform,filter,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  variant: {
    primary: "pearl chrome hover:brightness-[1.04]",
    premium: "pearl gilt hover:brightness-[1.04]",
    secondary: "glass text-ivory hover:bg-white/[0.12]",
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
      <span className={cx("inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-3.5 text-[0.8125rem] text-ivory/85", className)}>
        {children}
      </span>
    );
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.96]",
        pressed ? "pearl font-medium" : "glass text-muted hover:text-ivory",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Her hashtags. Small, quiet, one line, fading out at the edge. */
export function Tags({ tags, className, max = 3 }: { tags: string[]; className?: string; max?: number }) {
  return (
    <ul className={cx("fade-r flex gap-1 overflow-hidden", className)} aria-label="Tags">
      {tags.slice(0, max).map((t) => (
        <li key={t} className="shrink-0 rounded-full bg-white/[0.09] px-2 py-[0.2rem] text-[0.6875rem] tracking-[0.01em] text-ivory/85 backdrop-blur-md">
          <span className="text-ivory/45">#</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Online pill: a live green light that breathes. */
export function OnlinePill({ className, label = "Online" }: { className?: string; label?: string }) {
  return (
    <span className={cx("glass inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[0.6875rem] font-medium text-ivory", className)}>
      <span className="live-dot size-1.5 rounded-full bg-sage" aria-hidden />
      {label}
    </span>
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
  /** Unseen story: draws the polished steel ring (blush-tinted for someone new). */
  story?: boolean;
  showOnline?: boolean;
}) {
  return (
    <span
      className={cx(
        "relative inline-block shrink-0 rounded-full",
        avatarSize[size],
        story &&
          (companion.isNew
            ? "p-[2px] [background:conic-gradient(from_200deg,#fbe4dd,#c99083,#ffffff,#8d8d95,#f1c6ba,#fbe4dd)]"
            : "p-[1.5px] [background:conic-gradient(from_200deg,#ffffff,#6d6d75,#ececf0,#45454d,#c9c9cf,#ffffff)]"),
      )}
    >
      <span className={cx("relative block size-full overflow-hidden rounded-full bg-ink-800", story && "ring-[2.5px] ring-ink-950")}>
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
const compact = new Intl.NumberFormat("en", { notation: "compact" });

export function CompanionCard({
  companion: c,
  href,
  priority,
  wide,
  morph,
  className,
  style,
}: {
  companion: Companion;
  href: string;
  priority?: boolean;
  /** Spans two columns as a landscape feature, with her tagline. */
  wide?: boolean;
  /** Names the portrait for the route morph into her profile. Only one card per companion on a page may set it. */
  morph?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const photo = (
    <div className="absolute inset-0 overflow-hidden">
      <Portrait
        companion={c}
        priority={priority}
        sizes={wide ? "(max-width: 768px) 100vw, 50vw" : undefined}
        className="transition-transform duration-[900ms] ease-out-expo [@media(hover:hover)]:group-hover:scale-[1.045]"
      />
    </div>
  );
  return (
    <Link
      href={href}
      style={style}
      className={cx(
        "group relative block overflow-hidden rounded-card bg-ink-850 shadow-lift outline-offset-4 transition-transform duration-200 ease-out active:scale-[0.98]",
        wide ? "col-span-2 aspect-[16/12] sm:aspect-[16/10]" : "aspect-[3/4.15]",
        className,
      )}
    >
      {morph ? (
        <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
          {photo}
        </ViewTransition>
      ) : (
        photo
      )}
      {/* One grade for every portrait: a clear top, a deep floor for the type. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent via-45% to-ink-950/95" />
      <div className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-white/10 transition-[box-shadow] duration-300 group-hover:ring-white/25" />

      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        {c.isNew ? (
          <span className="glass chrome inline-flex h-6 items-center rounded-full px-2.5 text-[0.6875rem] font-medium tracking-[0.02em] text-blush-hi">New</span>
        ) : (
          <span />
        )}
        {c.online && <OnlinePill />}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
        {/* Name wraps to two lines at most (it identifies her), breaking at hyphens before mid-word. */}
        <p className={cx("line-clamp-2 font-display leading-[0.95] text-ivory [overflow-wrap:break-word] hyphens-auto", wide ? "text-[clamp(1.9rem,7vw,2.75rem)]" : "text-[clamp(1.45rem,5.6vw,1.9rem)]")} title={c.name}>
          {c.name}
          <span className="ml-1.5 inline-block text-[0.62em] font-normal tracking-normal whitespace-nowrap text-ivory/55">{c.age}</span>
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[0.75rem] text-ivory/60">
          <MapPin weight="regular" className="size-3 shrink-0" aria-hidden />
          <span className="min-w-0 truncate">
            {c.city} · {c.sign}
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 pl-2 tabular-nums" aria-label={`${c.photos.toLocaleString()} photos`}>
            <Camera weight="regular" className="size-3.5" aria-hidden />
            {compact.format(c.photos)}
          </span>
        </p>
        {wide && <p className="mt-2 line-clamp-1 max-w-[40ch] text-sm text-ivory/80">{c.tagline}</p>}
        <Tags tags={c.tags} className="mt-2.5" max={wide ? 4 : 3} />
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
      <span className="glass flex h-13 items-center gap-3 rounded-2xl px-4 transition-[border-color,box-shadow] duration-150 focus-within:border-white/30">
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
        "max-w-[80%] rounded-[1.375rem] px-4 py-2.5 text-[0.9375rem] leading-relaxed [overflow-wrap:anywhere]",
        from === "her"
          ? "glass self-start rounded-bl-md text-ivory"
          : "self-end rounded-br-md bg-linear-to-b from-blush-hi to-blush text-ink-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_8px_24px_-12px_rgb(0_0_0/0.8)] [transform-origin:bottom_right]",
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
        <span key={i} className="size-1.5 rounded-full bg-ivory/80 motion-safe:animate-[breathe_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}
