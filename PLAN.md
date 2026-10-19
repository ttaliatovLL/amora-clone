# Amora rebuild — plan

## Design decisions (locked 2026-10-19)
| # | Topic | Decision |
|---|-------|----------|
| 1 | Platform | Mobile-first PWA, scales to desktop |
| 2 | Aesthetic | Candlelit noir: warm near-black, amber/rose light, film grain, vignettes |
| 3 | Palette | Ink + blush + wine; one accent system shared by landing and app (no hot-pink gradients, no orange chips) |
| 4 | Type | High-contrast serif display (names, headlines) + clean sans (UI, chat) |
| 5 | Discovery | Stories row (online / new) + filtered grid (vibe, look, interests chips) |
| 6 | Chat | Immersive single column, blurred portrait backdrop, profile + gallery in bottom sheet; desktop = centered column + optional side panel |
| 7 | Money | Subscription-first (one Premium hero), coins only for one-off unlocks and gifts |
| 8 | Motion | Subtle, physical: springs, breathing typing indicator, soft reveals, reduced-motion respected |
| 9 | Placeholders | Line-art sketches per companion "type"; every image slot sized for real photos later (4:5 portrait, 1:1 avatar, 9:16 story) |
| 10 | Stack | Next.js App Router + Tailwind (tokens) + Motion + PWA manifest |

## Problems in the current site (from screenshots)
- Two visual languages: soft editorial landing vs. hot-pink/orange/yellow app.
- Hero accent "for you." low contrast; grid is an unfiltered photo wall.
- Chat: empty center, right rail of ~30 locked coin tiles reads as a paywall.
- Money: subscription + coins + leftover "2 coins / $0.10" pack, duplicated labels, crypto-only.
- Account deletion is "Coming soon" — GDPR (Art. 17) requires it. Must ship, not just restyle.
- Logo size/placement differs per page.

## Stages
1. ✅ **Foundation** (done 2026-10-19, see `/system` and DESIGN.md) — Next.js project, design tokens (color, type, radius, spacing, motion), fonts, grain/vignette surfaces, line-art placeholder set, core components (button, chip, sheet, avatar, card, input). Mock data for ~12 companions.
2. ✅ **Landing** (done 2026-10-19, `/`) — age gate, hero, companion strip, "how it works" chat demo, pricing (subscription-first), testimonials, FAQ, footer/compliance.
3. ✅ **App shell + discovery** (done 2026-10-19, `/app`, `/app/[id]`) — mobile tab bar / desktop rail, stories row, filtered grid, companion profile page.
4. ✅ **Chat** (done 2026-10-19, `/app/[id]/chat`, `/app/chats`) — immersive thread, typing, quick replies, media message + unlock, profile/gallery bottom sheet.
5. ✅ **Money + account** (done 2026-10-19, `/app/me`, `/login`; auth, payments and deletion are mocked) — single paywall sheet, coin store, settings, real account deletion flow, sign-in/up.
6. ✅ **Polish** (done 2026-10-19: PNG icons, mobile-native baseline, break-ui fixes, a11y, reduced motion; real-device test still owed) — PWA install, mobile-native pass, break-ui on each screen, reduced-motion, a11y audit.

Backend (auth, AI chat, payments) stays mocked until the shell is approved.
