# Project audit — 2026-10-20

Baseline: `main` at `92c4408` (= `origin/main`), clean tracked tree; untracked `amora-clone/` and `brag-output/`.

## Project
Amora: mobile-first PWA rebuild of meetamora.com (AI-companion chat, adults only). Front-end prototype, design "Night Agency". 14 companions with scripted chats. Next.js 16.4.2, React 19.3, Tailwind v4, Motion, npm.

## State
| Area | Status | Evidence |
|---|---|---|
| Type check | VERIFIED | `npx tsc --noEmit` clean |
| Lint | VERIFIED | `npm run lint` clean (after ignoring `brag-output/`) |
| Production build | VERIFIED | `npm run build` exit 0, 45 pages |
| Tests | NOT IMPLEMENTED | no test suite |
| Screens (landing, board, discover, profile, chat, chats, saved, you, login, legal, /system) | WORKING (code + build); chat flow checked in browser | not tested on a real phone |
| Auth, AI replies, payments, wallet, account deletion | NOT IMPLEMENTED (mocked) | see README "Still mocked" |
| GitHub | VERIFIED | `ttaliatovLL/amora-clone`, private, default `main`; remote branches `main`, `night-agency` |
| Vercel | VERIFIED | project `amora-clone` (lowlight-corp), Git-linked, latest production deploy READY at `92c4408`, SSO protection on |
| Secrets | VERIFIED clean | no secrets in tracked files or history; no `.env` files |
| npm audit | 0 runtime issues; 5 high in dev-only lint tooling (`eslint-config-next` chain) | `npm audit` |

## Defects found
| # | Severity | Issue | Status |
|---|---|---|---|
| 1 | High | Chat stuck on "typing…" and her reply lost after leaving mid-message and coming back (Next keeps hidden pages alive with `<Activity>` under `cacheComponents`) — `src/components/chat.tsx` | FIXED, verified in browser |
| 2 | Med | Quick replies could be tapped repeatedly before she answered | FIXED, verified in browser |
| 3 | Low-Med | `toLocaleString()` without locale on `/app/me` → hydration mismatch on non-English browsers | FIXED (`en-US`), not browser-tested in de-DE |
| 4 | Low | Legal links on `/login` and `/app/me` pointed to `#` although `/terms` and `/privacy` exist | FIXED |
| 5 | High (hygiene) | `git add -A` would have committed 150 MB `brag-output/` and the stray nested clone `amora-clone/` | FIXED: `brag-output/` git- and eslint-ignored; stray clone deleted (approved) |
| 6 | Low | Chat profile sheet / story viewer reopen when you navigate back (Activity keeps state) — `chat.tsx` Sheet, `chat/list.tsx` StoryViewer | OPEN |
| 7 | Low | Discover: undo pressed during a card's 380 ms fly-out desyncs the deck index — `discover/deck.tsx` | OPEN |
| 8 | Low | Tracked `reference/screenshots/` ≈ 79 MB of PNGs (screens of the original site) | FIXED: untracked and git-ignored (still on disk and in Git history) |
| 9 | Low | No security headers (CSP etc.) in `next.config.ts` | OPEN — before public launch |
| 10 | Low | Hearting a message is touch-only (no keyboard path) | PARTIAL — screen-reader labels fixed |

## Naming
Keep **`amora-clone`**. The display/package name is "amora"; the repo, Vercel project and its URLs all use `amora-clone`. A rename (e.g. `amora-pwa`) would change the Vercel domains and remotes for little gain while it is a private prototype. Revisit when it gets a real domain.

## Needs your decision
- Stale local branches `night-agency` (merged, 2 behind main) and `redesign-graphite` (rejected design, local only) — keep or delete.
