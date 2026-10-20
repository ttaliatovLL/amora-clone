# Amora

Mobile-first PWA rebuild of meetamora.com: fourteen handcrafted AI companions, each a written character with a face, a city and a long memory. Design: "Night Agency" (a model agency after dark).

**Status:** front-end prototype. Every screen is built; auth, AI chat, payments and account deletion are **mocked** (see below). Not yet tested on a real phone.

Stack: Next.js 16 (App Router, Cache Components), React 19, Tailwind v4, Motion, Sonner, three.js (shader effects). npm.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build + type check
```

No environment variables are needed. There is no test suite yet.

## Routes
| Route | What |
|---|---|
| `/` | Landing: age gate, hero, companions, chat demo, pricing, FAQ, footer |
| `/app` | Board: comp-card grid of companions |
| `/app/discover` | Swipe deck + Online now / New / By vibe rails |
| `/app/[id]` | Companion profile |
| `/app/[id]/chat` | Chat: scripted replies, voice notes, gifts, photo unlocks |
| `/app/chats` | Inbox + Moments stories |
| `/app/saved` | Saved companions |
| `/app/me` | Membership, coins, achievements, privacy, delete account |
| `/login` | Sign up / sign in (mock) |
| `/terms`, `/privacy` | Draft legal copy (not reviewed) |
| `/system` | Design system + dev-only **Demo / Worst case / Empty** data toggle |

## Layout
- `src/app/` routes · `src/components/` UI (board, chat, discover, landing, profile…) · `src/lib/` data and mocks (`companions.ts`, `chat-scripts/`, `wallet.ts`, `progress.ts`).
- `public/companions/v2/` current portraits (originals in `public/companions/`).
- Docs: `PRODUCT.md` (product truth), `DESIGN.md` (visual system), `PLAN.md` (stages), `docs/companion-prompts.md` (photo prompt kit), `docs/maintenance/` (audit + next-session handoff).

## Deploy
Vercel project `amora-clone` (team lowlight-corp) deploys `main` automatically on push. Deployments sit behind Vercel login (SSO protection).

## Still mocked (replace before launch)
- **Auth**: `src/app/login/page.tsx` submit and Google button. Nothing under `/app` is protected.
- **AI replies**: scripted lines in `src/lib/chat-scripts/`.
- **Wallet, payments**: `src/lib/wallet.ts` (localStorage), demo purchases in `src/components/paywall.tsx`.
- **Account deletion**: `deleteAccount` in `src/app/app/me/page.tsx` must call a real deletion API (GDPR Art. 17).
- **Content**: portraits are AI-generated placeholders of fictional adults. Most bios and some taglines are placeholders.
- **Legal**: `/terms` and `/privacy` are short drafts, not lawyer-reviewed; no Impressum yet.

Find every deferred item with `grep -rn "shortcut:" src`.
