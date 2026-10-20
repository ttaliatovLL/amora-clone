import Link from "next/link";
import { ViewTransition, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { fitName } from "@/components/board/fit-name";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import type { Companion } from "@/lib/companions";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ── Logo ─────────────────────────────────────────────── */
/** The mark: a wide A and a rouge full stop, as on the app icon. */
export function Glyph({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx("inline-flex items-end gap-[0.12em] font-display text-[1.25rem] leading-none text-paper", className)}>
      A<span className="mb-[0.02em] size-[0.28em] bg-rouge" />
    </span>
  );
}

/** The name set wide, like an agency's board. The liquid-metal version lives in components/liquid-logo. */
export function Wordmark({ className }: { className?: string; glyph?: boolean }) {
  return (
    <span className={cx("inline-block font-display text-[1.05rem] leading-none tracking-[0.2em] text-paper", className)} role="img" aria-label="Amora">
      Amora
    </span>
  );
}

/* ── Button ───────────────────────────────────────────── */
// Square, flat, one fill. Rouge is the one action; paper is the second; ink is everything quieter.
const button = {
  base: "press inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none disabled:pointer-events-none disabled:opacity-40",
  variant: {
    primary: "bg-rouge text-ink hover:bg-rouge-hi",
    premium: "bg-rouge text-ink hover:bg-rouge-hi",
    paper: "bg-paper text-ink hover:bg-white",
    secondary: "bg-ink-4 text-paper hover:bg-ink-5",
    ghost: "text-muted hover:text-paper",
  },
  size: { sm: "h-10 px-4 text-small", md: "h-12 px-6 text-body", lg: "h-14 px-8 text-body" },
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
    return <span className={cx("inline-flex h-9 items-center gap-1.5 bg-ink-3 px-3.5 text-small text-paper/85", className)}>{children}</span>;
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        "press inline-flex h-10 shrink-0 items-center gap-1.5 px-4 text-small",
        pressed ? "bg-paper font-medium text-ink" : "bg-ink-3 text-muted hover:bg-ink-4 hover:text-paper",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Her interests as quiet words, one line, fading at the edge. */
export function Tags({ tags, className, max = 3 }: { tags: string[]; className?: string; max?: number }) {
  return (
    <ul className={cx("fade-r flex gap-1.5 overflow-hidden", className)} aria-label="Tags">
      {tags.slice(0, max).map((t) => (
        <li key={t} className="shrink-0 bg-ink/55 px-2 py-1 text-small text-paper/85">
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Facts in one line separated by middle dots. When the line wraps, the dot that would start a new line is
 * clipped off the left edge, so no line begins or ends with a stray separator.
 */
export function Facts({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <span className={cx("block overflow-hidden", className)}>
      <span className="-ml-[1.1em] flex flex-wrap items-center">
        {items.filter((x) => x !== null && x !== false && x !== undefined && x !== "").map((x, i) => (
          <span key={i} className="relative pl-[1.1em] before:absolute before:left-0 before:w-[1.1em] before:text-center before:opacity-60 before:content-['·']">
            {x}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Online: a small live light and the word, on a solid ink tab. */
export function OnlinePill({ className, label = "Online" }: { className?: string; label?: string }) {
  return (
    <span className={cx("inline-flex h-7 items-center gap-2 bg-ink/70 px-2.5 text-small text-paper", className)}>
      <span className="live-dot size-1.5 rounded-full bg-live" aria-hidden />
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
  /** Unseen story: a rouge frame (paper for someone already seen). */
  story?: boolean;
  showOnline?: boolean;
}) {
  return (
    <span className={cx("relative inline-block shrink-0", avatarSize[size], story && (companion.isNew ? "bg-rouge p-[2px]" : "bg-paper/70 p-[2px]"))}>
      <span className={cx("relative block size-full overflow-hidden bg-ink-3", story && "ring-2 ring-ink")}>
        <Portrait companion={companion} face />
      </span>
      {showOnline && companion.online && (
        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-live ring-2 ring-ink">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  );
}

/* ── Companion card: the comp card ────────────────────── */
// Like a model agency's card: one big photograph, the name set wide across its foot, the facts in one line.
// Hover (fine pointers) slowly brings her second photograph through.
export function CompanionCard({
  companion: c,
  href,
  priority,
  size = "large",
  wide,
  morph,
  save = true,
  className,
  style,
}: {
  companion: Companion;
  href: string;
  priority?: boolean;
  /** large: a full-width or column card with her line; tile: a compact grid cell. */
  size?: "large" | "tile";
  /** Spans two grid columns as a landscape feature. */
  wide?: boolean;
  /** Names the portrait for the route morph into her profile. Only one card per companion on a page may set it. */
  morph?: boolean;
  /** Show the save-to-board control. */
  save?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const tile = size === "tile" && !wide;
  const second = c.gallery[0];
  const photo = (
    <div className="absolute inset-0 overflow-hidden">
      <Portrait
        companion={c}
        priority={priority}
        sizes={wide ? "(max-width: 768px) 100vw, 66vw" : tile ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 768px) 100vw, 33vw"}
        className="crossfade-a"
      />
      {second && <Portrait companion={c} src={second} sizes={wide ? "66vw" : "33vw"} className="crossfade-b" />}
    </div>
  );
  return (
    <article style={style} className={cx("crossfade group @container relative overflow-hidden bg-ink-2", wide ? "aspect-[4/5] md:col-span-2 md:aspect-[16/10]" : tile ? "aspect-[3/4]" : "aspect-[4/5]", className)}>
      <Link href={href} className="press absolute inset-0 block outline-offset-[-3px] select-none active:scale-[0.985]" aria-label={`${c.name}, ${c.age}, ${c.city}`}>
        {morph ? (
          <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
            {photo}
          </ViewTransition>
        ) : (
          photo
        )}
        <div className={cx("scrim-b absolute inset-x-0 bottom-0", tile ? "h-1/2" : "h-[55%]")} />

        <div className={cx("absolute flex items-center gap-1.5", tile ? "top-2.5 left-2.5" : "top-4 left-4")}>
          {c.isNew && <span className="inline-flex h-7 items-center bg-rouge px-2.5 text-small font-medium text-ink">New</span>}
          {c.online && <OnlinePill />}
        </div>

        <div className={cx("absolute inset-x-0 bottom-0", tile ? "p-3" : "p-5 md:p-6")}>
          {/* Sized to the card: short names reach the cap, long ones shrink or take a second line, a single word never breaks. */}
          <p className="font-display text-paper [text-wrap:balance]" style={fitName(c.name, wide ? "5rem" : tile ? "1.6rem" : "3.25rem", tile ? "1.5rem" : "3rem", 2)}>
            {c.name}
          </p>
          <p className={cx("mt-2 truncate text-paper/80 tabular", tile ? "text-small" : "text-body")}>
            {c.age} · {c.city}
            {!tile && <span className="text-paper/55"> · {c.sign}</span>}
          </p>
          {!tile && <p className="mt-1 line-clamp-1 text-body text-paper/60">{c.tagline}</p>}
        </div>
      </Link>
      {save && <SaveButton id={c.id} name={c.name} className={cx("absolute z-[2]", tile ? "top-1.5 right-1.5" : "top-3 right-3")} />}
    </article>
  );
}

/* ── Input ────────────────────────────────────────────── */
export function Field({ label, hint, icon, className, id, ...props }: ComponentProps<"input"> & { label: string; hint?: string; icon?: ReactNode }) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className={cx("block", className)}>
      <span className="mb-2 block text-small text-muted">{label}</span>
      <span className="flex h-13 items-center gap-3 bg-ink-3 px-4 transition-[background-color,box-shadow] duration-150 focus-within:bg-ink-4 focus-within:ring-2 focus-within:ring-rouge">
        {icon && <span className="text-faint">{icon}</span>}
        <input id={inputId} className="h-full w-full bg-transparent text-base text-paper placeholder:text-faint focus:outline-none" {...props} />
      </span>
      {hint && <span className="mt-2 block text-small text-faint">{hint}</span>}
    </label>
  );
}

/* ── Chat bubble + typing ─────────────────────────────── */
export function Bubble({ from, children, className }: { from: "her" | "me"; children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "max-w-[80%] rounded-[1.25rem] px-4 py-2.5 text-body leading-relaxed [overflow-wrap:anywhere]",
        from === "her" ? "self-start rounded-bl-[0.3rem] bg-ink-4 text-paper" : "self-end rounded-br-[0.3rem] bg-paper text-ink [transform-origin:bottom_right]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Typing({ className }: { className?: string }) {
  return (
    <div className={cx("flex h-11 w-16 items-center justify-center gap-1.5 self-start rounded-[1.25rem] rounded-bl-[0.3rem] bg-ink-4", className)} aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 rounded-full bg-paper/80 motion-safe:animate-[breathe_1.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}
