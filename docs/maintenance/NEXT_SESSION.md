# Next session — Amora

**Last verified:** 2026-10-20 · branch `main` · see `git log -1` for the commit (maintenance commit on top of `92c4408`).

## At a glance
Front-end prototype of an AI-companion PWA in `~/WEB-DEV/amora-clone`. Private repo `github.com/ttaliatovLL/amora-clone`. Vercel project `amora-clone` deploys `main` (behind Vercel login). Backend is entirely mocked.

## Status
- Works: all screens build and render; chat, quick replies, gifts, unlocks, Discover deck, achievements (localStorage).
- Mocked: auth, AI replies (scripts in `src/lib/chat-scripts/`), wallet/payments, account deletion.
- Not done: real-phone test, tests, security headers, real legal copy/Impressum.

## This session (maintenance)
- Fixed chat stuck on "typing…" after navigating away and back; fixed double-sent quick replies (`src/components/chat.tsx`).
- Fixed locale hydration mismatch on `/app/me`; legal links now go to `/terms` and `/privacy`.
- Git/eslint now ignore `brag-output/`; deleted the stray nested `amora-clone/` clone (approved).
- Rewrote README, added CLAUDE.md and `docs/maintenance/PROJECT_AUDIT.md`.
- Checks: `tsc` clean, `npm run lint` clean, `npm run build` OK. Chat fixes checked in the browser at localhost:3000.

## Pending your decision
See "Needs your decision" in `PROJECT_AUDIT.md` (screenshots in Git, old branches — you chose to leave both for now).

## Next actions
1. Test on a real phone (keyboard in chat, Discover drag, silk/grain cost).
2. Fix the two open low bugs: sheets/stories reopening on back; Discover undo during fly-out.
3. Decide the backend (auth, AI chat, payments) — the next big stage.
4. Security headers + real legal pages before anything public.

## Resume
```bash
cd ~/WEB-DEV/amora-clone && npm install && npm run dev
```
Then read `CLAUDE.md`, this file, `DESIGN.md`. Verify with `npm run lint && npm run build`.

## Sources of truth
Code/tests → implementation. Git/GitHub → history (checked: local `main` = `origin/main` before this session). Vercel → deploys (checked via Vercel MCP). Obsidian note `~/Documents/Brain/wiki/sessions/amora-night-agency-2026-10-20.md` → decisions; it said `main` at `634af43`, which was stale (two later commits).
