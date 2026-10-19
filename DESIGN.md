# Design: Graphite

A dark glass room at night. Source of truth for values: `src/app/globals.css` (`@theme`). Live reference: `/system`.

## World
Neutral cool blacks, one soft overhead light and a faint blush bounce. Interface chrome is liquid glass; the one action surface is pearl; polished steel hairlines mark what matters; blush is reserved for her (emphasis, her side of the room, my message bubble). Gold survives only as a white-gold rim (`gilt`) on Premium and its purchase button, and as the small coin badge.

## Colour roles
| Token | Use |
|---|---|
| `ink-950…600` | grounds and raised surfaces (neutral graphite) |
| `ivory` / `muted` / `faint` | text: primary / secondary / fine print (≥4.5:1 on ink-800 and darker) |
| `blush` (+`-hi`, `-lo`) | her accents, focus ring, caret, my bubbles, "New" |
| `gold` | Premium crown and `gilt` rim only |
| `wine` | destructive hover wash |
| `rose` | destructive and warning text |
| `sage` | online, switches on |

## Surfaces (utilities)
- `room`: page atmosphere. `panel`: raised panel with its own top light.
- `glass`: liquid glass. Dark tint + white gradient, 24px blur at 180% saturation, bright top edge, dim bottom edge, soft drop. Bars, tab bar, chips, bubbles from her, captions over photos.
- `pearl`: lit white pill, the primary action. Always paired with `chrome` (steel rim) or `gilt` (Premium).
- `chrome` / `gilt`: 1px metal rims via masked gradient on `::after`. Don't combine with `grain` on the same element.
- `sheen`: one slow specular pass, membership surfaces only. `grain` (4.5%), `vignette`, `live-dot` (breathing online light), `fade-r` (tag rows).

## Type
- **General Sans** only (self-hosted WOFF2, ITF Free Font License). Display: 500, tracking −0.035 to −0.045em, leading 0.9–0.95. The second half of a headline steps back to `muted` via `<em>` (no italics, no serif).
- No eyebrow labels.

## Logo
`Wordmark` in `components/ui.tsx`: a monoline lowercase "amora" drawn from circles, stems and arches on a 20-unit x-height, plus the `Glyph`: two linked steel rings (left ring passes over at the bottom crossing). App icon: same rings on graphite (`public/icon.svg`, PNGs rendered from it).

## Icons
Phosphor `regular` throughout, `fill` for the active tab and small status marks, `bold` inside pearl buttons. No duotone.

## Imagery
`Portrait` renders `public/companions/<id>.jpg` (4:5 hero) or a gallery shot via `src` (`<id>-2.jpg`, listed in `companion.gallery`). Editorial fashion grade: graphite shadows, true skin. Locked media: `blur-xl brightness-[1.3]` under a glass lock, unlocks with `animate-develop`.

## Companion card
Photo, top/bottom grade, glass "Online" pill with breathing dot, steel-rimmed "New", name + age (age never splits), city · sign, compact photo count, 3 hashtags fading at the edge. Every 7th card in Discover is a 2-column landscape feature with her tagline.

## Motion
- Press: scale 0.96–0.98, 150ms. Hover (pointer devices only): photo scale 1.045 over 900ms expo-out.
- Tab bar and desktop rail: a glass lens glides between tabs (Motion `layoutId`, spring 0.45s / bounce 0.18).
- Route morph: the tapped card's portrait becomes the profile hero (`<ViewTransition name="portrait-<id>" share="morph">`, 450ms drawer curve with a mid-flight blur).
- Scroll-driven (CSS `animation-timeline`, off the main thread, visible by default): `reveal` (rise + unblur on entry), `condense` (bars go from clear to glass), `drift` / `drift-out` (profile hero parallax), `rail-focus` (landing rail cards scale toward the centre).
- `rise`: one staggered settle on load (`--i` for order). Sheets: spring 0.5s, drag from the handle.
- Reduced motion: movement dropped, state changes kept; bars still condense.

## Platform rules
- Controls: `touch-action: manipulation`, no label selection on long-press; content stays selectable.
- Root `overscroll-behavior: none`; inner scrollers use `overscroll-contain`.
- Sheets portal to `<body>`. SVG gradient ids are per instance (`useId`).
- Names wrap (cards clamp to 2 lines, break at hyphens), previews truncate, counts compact (`1.3K`), button labels never wrap.
- The age gate makes everything behind it `inert` until confirmed.
