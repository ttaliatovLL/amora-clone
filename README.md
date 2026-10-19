# Amora

Mobile-first PWA rebuild of meetamora.com. Next.js 16 (App Router, Cache Components), Tailwind v4, Motion.

```bash
npm install
npm run dev
```

## Routes
| Route | What |
|---|---|
| `/` | Landing: age gate, hero, companions rail, chat demo, pricing, FAQ |
| `/app` | Discover: stories, filters, grid |
| `/app/[id]` | Companion profile |
| `/app/[id]/chat` | Chat: typing, quick replies, locked photos, profile sheet |
| `/app/chats` | Inbox |
| `/app/me` | Membership, coins, privacy, sign out, delete account |
| `/login` | Sign up / sign in |
| `/system` | Design system + dev-only **Demo / Worst case / Empty** data toggle |

Docs: `PLAN.md` (stages), `PRODUCT.md` (product truth), `DESIGN.md` (visual system).

## Still mocked (replace before launch)
- **Auth**: `src/app/login/page.tsx` submit, Google button.
- **AI replies**: `reply` lines in `src/components/chat.tsx`.
- **Wallet, payments**: `src/lib/wallet.ts` (localStorage), demo purchases in `src/components/paywall.tsx`.
- **Account deletion**: `deleteAccount` in `src/app/app/me/page.tsx` must call the real deletion API (GDPR Art. 17).
- **Content**: companion portraits in `public/companions/` are AI-generated placeholders of fictional adults (Figma AI, gpt-image-2.5, Figma file "Amora portraits"). Replace with the real content; slots are 4:5 source, 3:4 cards, face-cropped avatars.
- **Copy**: bios other than Emma's, and the Gina/Katya/Jada/Valeria taglines, are placeholders.
- **Legal links** in the footer and sign-up point to `#`.
- **Logo**: text wordmark; drop in the real AMORA SVG.

Find every deferred item with `grep -rn "shortcut:" src`.
