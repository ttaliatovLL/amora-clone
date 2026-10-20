@AGENTS.md

# Amora — notes for Claude

Front-end prototype of an AI-companion PWA (Next.js 16, React 19, Tailwind v4, Motion, npm). All backend is mocked; see "Still mocked" in README.md.

## Read first
- `docs/maintenance/NEXT_SESSION.md` — current status and next step (authoritative for status).
- `DESIGN.md` — visual system and spacing rules (Night Agency: square corners, Panchang names, Switzer text, one rouge accent). Follow it; don't invent new tokens.
- `PRODUCT.md` — users, purpose, tone.

## Commands
`npm run dev` (port 3000) · `npm run lint` · `npm run build` (also type-checks). No tests yet. `.claude/launch.json` has `amora` (dev) and `amora-prod` (port 3005) preview configs.

## Rules
- Pushing `main` deploys to Vercel production. Ask before pushing.
- Deferred work is marked with `shortcut:` comments; keep that convention.
- Check worst-case data via `/system` (Demo / Worst case / Empty) and run break-ui before calling a screen done.
- Companion photos: `public/companions/v2/`; prompt kit in `docs/companion-prompts.md`.
- `brag-output/` (launch video) is local-only and git-ignored.
- Obsidian project note: `~/Documents/Brain/wiki/sessions/amora-night-agency-2026-10-20.md`.
