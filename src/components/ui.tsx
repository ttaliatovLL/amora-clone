import { ArrowRight, Camera } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ViewTransition, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { CardTilt } from "@/components/board/card-tilt";
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
// Heights: sm 40, md 44, lg 48. Icons size-4 / size-[1.125rem] / size-5 (callers size their own). Press scales to 0.97; hover lifts the fill one step.
const button = {
  base: "press group/btn relative inline-flex items-center justify-center whitespace-nowrap font-medium select-none disabled:pointer-events-none disabled:opacity-40 aria-busy:pointer-events-none",
  variant: {
    primary: "bg-rouge text-ink hover:bg-rouge-hi active:bg-rouge-hi",
    premium: "bg-rouge text-ink hover:bg-rouge-hi active:bg-rouge-hi",
    paper: "bg-paper text-ink hover:bg-white active:bg-paper-2",
    secondary: "bg-ink-4 text-paper hover:bg-ink-5 active:bg-ink-5",
    ghost: "text-muted hover:bg-ink-3 hover:text-paper active:bg-ink-4",
  },
  size: {
    sm: "h-10 gap-2 px-4 text-small",
    md: "h-11 gap-2 px-5 text-body",
    lg: "h-12 gap-2.5 px-6 text-body",
  },
};
type ButtonStyle = {
  variant?: keyof typeof button.variant;
  size?: keyof typeof button.size;
  /** A trailing arrow that leans forward on hover: for buttons that take you somewhere. */
  arrow?: boolean;
  /** Keeps the button's width and swaps its label for three breathing squares. */
  loading?: boolean;
};

function ButtonInner({ children, arrow, loading }: { children: ReactNode; arrow?: boolean; loading?: boolean }) {
  return (
    <>
      <span className={cx("inline-flex min-w-0 items-center gap-[inherit]", loading && "invisible")}>
        {children}
        {arrow && <ArrowRight weight="bold" className="size-[1.1em] shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5" aria-hidden />}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 bg-current motion-safe:animate-[breathe_1.1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
    </>
  );
}

export function Button({ variant = "primary", size = "md", arrow, loading, className, children, disabled, ...props }: ComponentProps<"button"> & ButtonStyle) {
  return (
    <button className={cx(button.base, button.variant[variant], button.size[size], className)} disabled={disabled} aria-busy={loading || undefined} {...props}>
      <ButtonInner arrow={arrow} loading={loading}>
        {children}
      </ButtonInner>
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", arrow, loading, className, children, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return (
    <Link className={cx(button.base, button.variant[variant], button.size[size], className)} aria-busy={loading || undefined} {...props}>
      <ButtonInner arrow={arrow} loading={loading}>
        {children}
      </ButtonInner>
    </Link>
  );
}

/* ── Chip ─────────────────────────────────────────────── */
// Toggle chip when `pressed` is passed, action chip with only onClick, static tag otherwise. Toggles are 40 tall
// (the filter row), static tags 32. `count` sits after the label in tabular figures.
export function Chip({ pressed, count, className, children, ...props }: ComponentProps<"button"> & { pressed?: boolean; count?: number }) {
  const n = count !== undefined && <span className={cx("tabular", pressed ? "text-ink/55" : "text-faint")}>{count > 999 ? "999+" : count}</span>;
  if (pressed === undefined && !props.onClick)
    return (
      <span className={cx("inline-flex h-8 items-center gap-1.5 bg-ink-3 px-3 text-small text-paper/85", className)}>
        {children}
        {n}
      </span>
    );
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(
        "press inline-flex h-10 shrink-0 items-center gap-1.5 px-4 text-small disabled:pointer-events-none disabled:opacity-40",
        pressed ? "bg-paper font-medium text-ink" : "bg-ink-3 text-muted hover:bg-ink-4 hover:text-paper active:bg-ink-5",
        className,
      )}
      {...props}
    >
      {children}
      {n}
    </button>
  );
}

/** Her interests as quiet words, one line, fading at the edge. */
export function Tags({ tags, className, max = 3 }: { tags: string[]; className?: string; max?: number }) {
  return (
    <ul className={cx("fade-r flex gap-1 overflow-hidden", className)} aria-label="Tags">
      {tags.slice(0, max).map((t) => (
        <li key={t} className="inline-flex h-6 shrink-0 items-center bg-ink/55 px-2 text-[0.8125rem] text-paper/85">
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ── Switch + segmented control ───────────────────────── */
/** A square on/off switch, 44 x 24. The thumb glides; rouge when on. */
export function Switch({ label, on, onChange, disabled }: { label: string; on: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      className={cx(
        "group/sw relative h-6 w-11 shrink-0 transition-colors duration-200 ease-[var(--ease-out)] disabled:opacity-50",
        on ? "bg-rouge" : "bg-ink-5 hover:bg-[#3a3a3a]",
      )}
    >
      <span className={cx("absolute top-1 left-1 size-4 bg-paper transition-transform duration-200 ease-[var(--ease-out)] group-active/sw:scale-90", on && "translate-x-5")} />
    </button>
  );
}

/** One choice of a few, as a flat track with a sliding paper (or ink, on paper) block. Equal columns. */
export function Segmented<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
  tone = "ink",
  className,
}: {
  label: string;
  options: { value: T; label: ReactNode; note?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  const tall = options.some((o) => o.note);
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx("relative grid p-1", tone === "paper" ? "bg-paper-2" : "bg-ink-3", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className={cx("absolute inset-y-1 left-1 transition-transform duration-300 ease-[var(--ease-out)]", tone === "paper" ? "bg-ink" : "bg-paper")}
        style={{ width: `calc((100% - 0.5rem) / ${options.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              "relative flex min-w-0 flex-col justify-center px-4 transition-colors duration-200",
              tall ? "h-14 items-start text-left" : "h-10 items-center",
              on ? (tone === "paper" ? "text-paper" : "text-ink") : tone === "paper" ? "text-ink/65 hover:text-ink" : "text-muted hover:text-paper",
            )}
          >
            <span className={cx("truncate", tall ? "text-body font-medium" : "text-small", on && "font-medium")}>{o.label}</span>
            {o.note && <span className={cx("truncate text-small", on ? (tone === "paper" ? "text-rouge" : "text-rouge-lo") : "text-faint")}>{o.note}</span>}
          </button>
        );
      })}
    </div>
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
    <span className={cx("inline-flex h-6 items-center gap-1.5 bg-ink/70 px-2 text-[0.8125rem] text-paper", className)}>
      <span className="live-dot size-1.5 rounded-full bg-live" aria-hidden />
      {label}
    </span>
  );
}

/* ── Avatar ───────────────────────────────────────────── */
const avatarSize = { sm: "size-10", md: "size-12", lg: "size-16" };

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
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-live ring-2 ring-ink">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  );
}

/* ── Companion card: the comp card ────────────────────── */
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
/** "Speaks English and Turkish" from her language codes. */
const speaks = (codes: string[]) => {
  const names = codes.map((l) => languageNames.of(l.toLowerCase()) ?? l);
  return `Speaks ${names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]}`;
};
// Hover-only detail lines: open on fine pointers, never take space on touch.
const onHover =
  "hidden [@media(hover:hover)_and_(pointer:fine)]:block max-h-0 translate-y-1 opacity-0 transition-[max-height,opacity,transform,margin] duration-500 ease-[var(--ease-out)] group-hover:max-h-6 group-hover:translate-y-0 group-hover:opacity-100";

// Like a model agency's card: one big photograph, the name set wide across its foot, the facts in one line.
// Hover (fine pointers) slowly brings her second photograph through, leans the card toward the pointer and opens one more line.
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
    // Drifts a few pixels against the tilt (CardTilt sets the offsets); the hover zoom covers the edges.
    <div className="absolute inset-0 overflow-hidden [translate:calc(var(--shift-x,0)*1px)_calc(var(--shift-y,0)*1px)]">
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
    <article style={style} className={cx("group @container relative", wide ? "aspect-[4/5] md:col-span-2 md:aspect-[16/10]" : tile ? "aspect-[3/4]" : "aspect-[4/5]", className)}>
      {/* Her own deep wash holds the place while the photo loads. */}
      <CardTilt className="crossfade absolute inset-0 overflow-hidden" style={{ backgroundColor: c.wash[1] }}>
        <Link href={href} draggable={false} className="absolute inset-0 block outline-offset-[-3px] select-none" aria-label={`${c.name}, ${c.age}, ${c.city}`}>
          {morph ? (
            <ViewTransition name={`portrait-${c.id}`} share="morph" default="none">
              {photo}
            </ViewTransition>
          ) : (
            photo
          )}
          <div className={cx("scrim-b absolute inset-x-0 bottom-0", tile ? "h-[45%]" : "h-1/2")} />

          {/* Status as one joined tab: New in rouge, then the live light. */}
          {(c.isNew || c.online) && (
            <div className={cx("absolute flex", tile ? "top-2 left-2" : "top-3 left-3")}>
              {c.isNew && <span className="inline-flex h-6 items-center bg-rouge px-2 text-[0.8125rem] font-medium text-ink">New</span>}
              {c.online && <OnlinePill />}
            </div>
          )}

          <div className={cx("absolute inset-x-0 bottom-0", tile ? "p-3 @[15rem]:p-4" : "p-5")}>
            {/* Proportionate to the card, never filling it: short names sit at the cap, long ones shrink or wrap; one word never breaks. */}
            <p className="font-display text-paper [text-wrap:balance]" style={fitName(c.name, wide ? "3.5rem" : tile ? "1.5rem" : "2.5rem", tile ? "2rem" : "2.5rem", 2)}>
              {c.name}
            </p>
            <p className={cx("mt-1.5 flex items-center gap-3 text-paper/75 tabular", tile ? "text-small" : "text-body")}>
              <span className="min-w-0 truncate">
                {c.age} · {c.city}
                {!tile && <span className="text-paper/50"> · {c.sign}</span>}
              </span>
              {c.photos > 0 && (
                <span className="ml-auto hidden shrink-0 items-center gap-1 text-small text-paper/55 @[11rem]:inline-flex">
                  <Camera size={14} weight="fill" aria-hidden />
                  {c.photos > 999 ? "999+" : c.photos}
                </span>
              )}
            </p>
            {/* Her line: always on large cards; on tiles it opens on hover (fine pointers only). Large cards open her languages. */}
            <p className={cx("line-clamp-1 text-paper/65", tile ? cx(onHover, "text-small group-hover:mt-1 [@media(hover:hover)_and_(pointer:fine)]:max-@[13rem]:hidden") : "mt-1 text-body")}>{c.tagline}</p>
            {!tile && c.langs.length > 0 && <p className={cx(onHover, "truncate text-small text-paper/55 group-hover:mt-1")}>{speaks(c.langs)}</p>}
          </div>
        </Link>
        {save && <SaveButton id={c.id} name={c.name} className={cx("absolute z-[2]", tile ? "top-1 right-1 size-9!" : "top-2 right-2")} />}
      </CardTilt>
    </article>
  );
}

/* ── Input ────────────────────────────────────────────── */
/** A labelled input, 48 tall. `hint` sits under it; `error` replaces the hint, rings the field rouge and is announced.
 *  `trailing` holds a control inside the field's right edge (Show / Hide). */
export function Field({
  label,
  hint,
  error,
  icon,
  trailing,
  className,
  id,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string; error?: string; icon?: ReactNode; trailing?: ReactNode }) {
  const inputId = id ?? props.name;
  const noteId = inputId && (error || hint) ? `${inputId}-note` : undefined;
  return (
    <div className={cx("block", className)}>
      <label htmlFor={inputId} className="mb-2 block text-small text-muted">
        {label}
      </label>
      <span
        className={cx(
          "flex h-12 items-center gap-3 bg-ink-3 pl-4 transition-[background-color,box-shadow] duration-150 hover:bg-ink-4 focus-within:bg-ink-4 focus-within:ring-2",
          trailing ? "pr-1" : "pr-4",
          error ? "ring-2 ring-rouge/70 focus-within:ring-rouge" : "focus-within:ring-rouge",
        )}
      >
        {icon && <span className="text-faint [&_svg]:size-[1.125rem]">{icon}</span>}
        <input id={inputId} aria-invalid={error ? true : undefined} aria-describedby={noteId} className="h-full w-full min-w-0 bg-transparent text-base text-paper focus:outline-none" {...props} />
        {trailing}
      </span>
      {(error || hint) && (
        <span id={noteId} className={cx("mt-2 block text-small", error ? "text-rouge-hi" : "text-faint")} role={error ? "alert" : undefined}>
          {error ?? hint}
        </span>
      )}
    </div>
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
