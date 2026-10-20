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

## Handover (project sold)
- Entry point for the buyer: `docs/HANDOVER.md` (status, code map, transfer checklist, licenses).
- One brief per integration (AI chat, auth, DB, payments, ElevenLabs voice, Higgsfield media, GDPR deletion, calls): `docs/INTEGRATIONS.md`.
- `HANDOVER:` comments mark every integration point (`grep -rn "HANDOVER:" src`); planned env names in `.env.example`.
- `reference/screenshots/` untracked (kept on disk). GitHub + Vercel transfer: owner still has to do it (checklist in HANDOVER.md).

## Pending your decision
Old local branches `night-agency` and `redesign-graphite` (left as is).

## Next actions
1. Owner: transfer GitHub repo and Vercel project to the buyer (docs/HANDOVER.md checklist).
2. Test on a real phone (keyboard in chat, Discover drag, silk/grain cost).
3. Fix the two open low bugs: sheets/stories reopening on back; Discover undo during fly-out.
4. Buyer: start integrations in the order given in docs/INTEGRATIONS.md.
5. Security headers + real legal pages before anything public.

## Resume
```bash
cd ~/WEB-DEV/amora-clone && npm install && npm run dev
```
Then read `CLAUDE.md`, this file, `DESIGN.md`. Verify with `npm run lint && npm run build`.

## Sources of truth
Code/tests → implementation. Git/GitHub → history (checked: local `main` = `origin/main` before this session). Vercel → deploys (checked via Vercel MCP). Obsidian note `~/Documents/Brain/wiki/sessions/amora-night-agency-2026-10-20.md` → decisions; it said `main` at `634af43`, which was stale (two later commits).
