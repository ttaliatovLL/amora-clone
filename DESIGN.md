# Design: Velvet Noir

A private members' club after midnight. Source of truth for values: `src/app/globals.css` (`@theme`). Live reference: `/system`.

## World
Plum-black rooms lit from above (plum), from the side (oxblood) and low (a gold ember), with film grain over everything. Portraits are low-key chiaroscuro with one shared grade. Champagne is the only action colour; brushed gold (`foil`) marks money and membership; glass is used only for supporting surfaces.

## Colour roles
| Token | Use |
|---|---|
| `ink-950…600` | grounds and raised surfaces (plum-tinted near-black) |
| `ivory` / `muted` / `faint` | text: primary / secondary (7.4:1) / fine print (≥4.5:1 on ink-800 and darker) |
| `champagne` (+`-hi`, `-lo`) | emphasis words, focus ring, caret, icons |
| `gold` | thin icons, rings on premium surfaces |
| `plum`, `plum-hi`, `oxblood` | atmosphere gradients, my-message bubbles |
| `rose` | destructive and warning text |
| `sage` | online |

## Surfaces (utilities)
- `velvet`: page atmosphere (three radial lights). `aura`: the same idea scaled to a card or panel.
- `foil`: brushed champagne-gold gradient with ink text, for primary buttons, Premium, coins and the selected chip. Never used for decoration.
- `sheen`: one slow specular pass, only on membership surfaces.
- `glass`: blur + saturate + hairline + inset highlight, for nav bars, chips over photos, the composer, the chat header and her bubbles.
- `grain`, `vignette`.

## Type
- Display: **Zodiak** at weight 300, tracking -0.03em, line height 0.88–0.95. Italic champagne for the emotional half of every headline ("She's waiting / *for you.*").
- UI: **General Sans** 400/500.
- Self-hosted WOFF2s in `src/app/fonts/` via `next/font/local` (ITF Free Font License: free commercial use, no redistribution of the files).
- No eyebrow labels. Headings carry themselves.

## Icons
Phosphor (`@phosphor-icons/react/ssr`). Light by default, duotone in champagne or gold for feature and trust icons, fill for active tabs, thin at 40px for editorial lists.

## Imagery
`Portrait` renders `public/companions/<id>.jpg` (4:5 source, 3:4 cards, face crop for avatars) and falls back to the line-art `Sketch`. Gallery and chat photos are re-crops of the one portrait until real media exists. Locked media is a bright warm blur (`blur-lg brightness-[1.6]`) under a glass lock, and unlocks with `animate-develop`.

## Motion
Press: scale 0.97, 150ms. Card hover: image scale 1.05 over 900ms expo-out, gold ring fades in. Sheet: spring, dragged from the handle only. Unlock: develop from blur over 900ms. Sheen: 5.5s loop on membership surfaces. Everything respects reduced motion.

## Platform rules
- Controls: `touch-action: manipulation`, no label selection on long-press; content stays selectable.
- Root `overscroll-behavior: none`; inner scrollers use `overscroll-contain`.
- Sheets portal to `<body>`.
- Names wrap (cards clamp to 2 lines), previews truncate, numbers use `toLocaleString` + tabular figures, button labels never wrap.
- The age gate makes everything behind it `inert` until confirmed.
