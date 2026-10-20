# Design: Night Agency

Amora is dressed as a **model agency after dark**. The borrowed category is the agency: its board of big portraits,
its comp cards (one large photograph, the name set wide, the facts in one line), its blunt confidence. The subject
stays intimate and private: black room, one rouge light. Source of truth for values: `src/app/globals.css` (`@theme`).

Idea sentence: *On Amora, the model agency's comp card becomes the companion card, and the agency board becomes Discover.*

## House rules (from the owner's taste skill; non-negotiable)
- Square corners on everything: media, cards, buttons, inputs, sheets, toasts. Exceptions: chat bubbles (radius 20px, one 5px tail corner), round live dots, the liquid-glass dock (pill).
- No eyebrows (small label above a heading), no tiny uppercase letter-spaced labels, no monospace, no 01/02/03 numbering.
- No thin rules / hairline borders / 1px outlined boxes. Separate surfaces by a tone step (`ink` → `ink-2` → `ink-3` → `ink-4` → `ink-5`) or space. Form fields may use a focus ring.
- No gradients except: the `scrim-b`/`scrim-t` neutral scrim under text on photos, and the Silk shader (landing). No glass except the dock (`LiquidGlass`). No glows; shadows (`shadow-[var(--shadow-float)]`) only on things that truly float (dock, sheets, toasts, menus).
- No emoji. No styled accent word in headlines (no `<em>` greying, no italics, no colour). One face per job.
- Headlines two lines or fewer at every width. Body text 16px+ in full `paper` ink; `muted` for secondary only.
- Left-aligned by default.

## Colour
| Token | Use |
|---|---|
| `ink` #0a0a0a | page ground |
| `ink-2…ink-5` | raised surfaces, each one tone step up |
| `paper` #f3f0eb | text; the light "field" for a whole module (e.g. pricing ticket, comp card back) with `ink` text on it; secondary button |
| `muted` / `faint` | secondary text / fine print |
| `rouge` #ff5a6e (+`-hi`, `-lo`) | the ONE accent: primary action fill (ink text on it), focus ring, unread, saved, "New". On paper use `rouge-lo` for text. |
| `oxblood` | deep wine field, rare (destructive wash, silk) |
| `live` | online dot only |

## Type (5 sizes: `text-small`, `text-body`, `text-lead`, `text-head`, `text-mega`)
- Display: **Panchang** 700, class `font-display` (uppercase, tracking −0.02em, leading 1). A very wide face: ≤ 4 short words per line. Names on cards are display.
- Text: **Switzer** 400/500/600 (default `font-sans`). `tabular` class for numbers.

## Components (src/components)
- `ui.tsx`: `Button`/`ButtonLink` (variants `primary` rouge, `paper`, `secondary` ink-4, `ghost`; sizes sm/md/lg), `Chip`, `Tags`, `OnlinePill`, `Avatar` (square), `CompanionCard` (the comp card: `size="large" | "tile"`, `wide`, `morph`, `save`; hover crossfades to her second photo), `Field`, `Bubble`, `Typing`, `Wordmark` (static), `Glyph`, `cx`.
- `save-button.tsx` `SaveButton` (save to board; `label` for a text button). `lib/progress.ts`: `toggleSaved`, `track.*`, `useProgress`. Achievements in `lib/achievements.ts`; earning one fires a toast automatically.
- `toaster.tsx` (sonner, styled). Use `import { toast } from "sonner"` anywhere: `toast("Photo unlocked")`, `toast("…", { action: { label, onClick } })`.
- `cookie-banner.tsx`: consent (essential default). `openCookieSettings()` reopens it.
- `liquid-glass.tsx` `LiquidGlass` (real refraction in Chromium, blur elsewhere). Use only for the dock and at most one floating control per screen.
- `liquid-logo/` `LiquidWordmark` (WebGL liquid-metal "AMORA"). Use on the landing hero and the age gate only.
- `silk.tsx` `Silk` (shadergradient, dark wine silk). Landing atmosphere and the paywall only.
- `portrait.tsx` `Portrait` (4:5 photo, `src` for gallery shot, `face` for avatar crop), `sheet.tsx` `Sheet`, `paywall.tsx`.

## Motion
- Press: `press` utility (scale .97, 160ms). Hover only on fine pointers.
- `rise` (staggered settle on load, `--i`), `reveal` (scroll-driven entry), `animate-bubble-in`, `animate-develop` (unlock), `live-dot`.
- Signature: the slow crossfade (card hover → second photo; profile hero cycles portrait/gallery).
- Route morph portrait → profile hero via `<ViewTransition name="portrait-<id>" share="morph">`.
- Reduced motion: movement dropped, state kept.

## Platform
Mobile-first PWA; one hand, at night. Root `overscroll-behavior: none`; inner scrollers `overscroll-contain`. Dock clears content (`pb-28` in the app layout). Age gate makes everything behind it inert.
