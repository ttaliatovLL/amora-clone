# Handover

For the team taking over Amora. Read this first, then [INTEGRATIONS.md](INTEGRATIONS.md).

*State as of 2026-10-20.*

## What you're getting

A **complete front end with no backend.** Every screen of a mobile-first AI-companion web app is designed, built and deployed:

- the landing page with age gate, pricing and FAQ
- the companion board and Discover deck
- profiles
- chat with voice notes, gifts and photo unlocks
- inbox and stories
- saved companions, wallet and achievements
- login and the legal pages

The conversations, payments, accounts and media are **simulated in the browser**, so the product can be demoed end to end. You can see every place a real service plugs in with:

```bash
grep -rn "HANDOVER:" src     # integration points, linked to docs/INTEGRATIONS.md
grep -rn "shortcut:" src     # known simplifications to revisit
```

## Status

| Area | Status |
|---|---|
| UI: all screens, mobile and desktop, reduced motion, worst-case data (`/system`) | Done |
| Type check, lint, production build | Passing |
| Automated tests | None |
| Real-phone testing | Not done |
| AI chat | Scripted (14 hand-written personas) |
| Auth and age verification | Mock / self-declared |
| Database | None; browser storage only |
| Payments, coins, Premium | Mock, credits instantly |
| Voice notes | Transcript + fake playback, no audio |
| Photos and videos | Static AI-generated portraits |
| Account deletion (GDPR) | Mock |
| Legal texts | Drafts, not lawyer-reviewed; no Impressum |
| Security headers | None |

**Known small bugs:**
- The chat profile sheet and story viewer reopen when you navigate back.
- Pressing undo in Discover while a card is flying out desyncs the deck.

Details are in [maintenance/PROJECT_AUDIT.md](maintenance/PROJECT_AUDIT.md).

## Where to start

1. `npm install && npm run dev`, then open http://localhost:3000 and click through, including `/system`.
2. Read `DESIGN.md` (visual system: follow it, don't add new tokens) and `PRODUCT.md` (users, tone).
3. Pick integrations in this order: **auth → persistence → AI chat → payments → voice → video → calls** ([INTEGRATIONS.md](INTEGRATIONS.md)).
4. Before choosing any AI, voice, video or payment provider, confirm it **allows adult content and AI-companion use**. Premium advertises NSFW.

## Code map

| Path | What |
|---|---|
| `src/app/` | Routes (App Router). `/app/**` is the signed-in product |
| `src/components/chat.tsx` | The chat: reply queue, typing pacing, gifts, unlocks |
| `src/components/chat/` | Bubbles, voice note, inbox list, stories, presence backdrop |
| `src/components/board/`, `discover/`, `profile/`, `landing/` | Screens' building blocks |
| `src/lib/companions.ts` | The 14 companions (persona data) |
| `src/lib/chat-scripts/` | One scripted conversation per companion + in-memory store |
| `src/lib/wallet.ts`, `progress.ts` | Coins/Premium and saved/achievements (localStorage mocks) |
| `src/lib/plans.ts` | Prices (USD) and perks |
| `public/companions/v2/` | Current portraits (originals in `public/companions/`) |
| `public/brand/` | Logo files: wordmark, mark, app icon (SVG + PNG), liquid wordmark still and loop. Animated README banner in `docs/brand/` |
| `docs/companion-prompts.md` | Prompt kit for consistent companion photos |

**Gotcha:** this is Next.js 16 with `cacheComponents`. APIs differ from older docs, so read `node_modules/next/dist/docs/` before writing server code. Pages you leave stay mounted but hidden, and keep their state.

## Transfer checklist (seller → buyer)

Nothing below has been done yet. Each step needs the owner's action in the provider's dashboard.

**GitHub**
- [ ] Transfer `ttaliatovLL/amora-clone` to the buyer's account or org (Settings → Transfer), or add the buyer as admin first. The repo is private.
- [ ] After transfer, the buyer updates remotes: `git remote set-url origin <new-url>`.
- [ ] Optional: rename the repo (e.g. `amora`). GitHub redirects the old URL, but Vercel's Git link should be re-checked.

**Vercel**
- [ ] Transfer project `amora-clone` from team `lowlight-corp` to the buyer's team (Project → Settings → Transfer), or have the buyer import the repo fresh.
- [ ] Reconnect the GitHub integration if the repo moved, and confirm production deploys from `main`.
- [ ] Deployments are behind Vercel login (SSO protection). Adjust for the buyer's team.
- [ ] No environment variables exist yet; see `.env.example` for the planned ones.

**Assets and licenses (buyer should confirm with counsel)**
- [ ] Code dependencies are all MIT (Next, React, Motion, three.js, Sonner, Phosphor, shadergradient).
- [ ] Liquid-metal wordmark (`src/components/liquid-logo/`) is ported from paper-design/liquid-logo under **PolyForm Shield 1.0.0**. It forbids using it in a product that competes with the licensor. Confirm that's fine, or replace it.
- [ ] Fonts Panchang and Switzer come from Fontshare, ITF Free Font License: commercial use is allowed, but the font files may not be redistributed on their own.
- [ ] Companion portraits are AI-generated images of fictional adults (Figma AI gpt-image-2.5 and Nano Banana Pro via Figma Weave; Inés and Sofia from the client’s ChatGPT images). Confirm the tools' commercial terms, and replace them with owned content if needed.
- [ ] Reference screenshots of the original site were removed from the repo (they remain in Git history). Rewrite history if they must not be handed over.
- [ ] The launch video (`brag-output/`) is not in the repo; the seller can hand it over separately.

**Accounts and keys**
- [ ] There are no API keys, secrets or service accounts in the project. The buyer creates their own for every provider.

## Project documents

| File | Use |
|---|---|
| `README.md` | Overview and setup |
| `docs/HANDOVER.md` | This file |
| `docs/INTEGRATIONS.md` | One brief per integration (AI chat, auth, DB, payments, voice, video, deletion, calls) |
| `docs/maintenance/PROJECT_AUDIT.md` | Audit findings and fixes |
| `docs/maintenance/NEXT_SESSION.md` | Short status and resume steps |
| `DESIGN.md`, `PRODUCT.md`, `PLAN.md` | Design system, product truth, original build stages |
| `CLAUDE.md`, `AGENTS.md` | Instructions for AI coding assistants |
