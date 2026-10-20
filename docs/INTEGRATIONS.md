# Integration briefs

Each section is a self-contained brief: hand one to a developer (or paste it into an AI coding session) and it says what to build, where it plugs in, and when it's done.

Every plug-in point in the code carries a `HANDOVER:` comment that links back here:

```bash
grep -rn "HANDOVER:" src
```

## Ground rules for every integration

- **Keys stay on the server.** Call providers from Next.js Route Handlers (`src/app/api/**/route.ts`) or Server Actions, never from the browser. Never prefix a secret with `NEXT_PUBLIC_`. Planned variable names are in [`.env.example`](../.env.example).
- **This Next.js is newer than most docs and models know.** Read `node_modules/next/dist/docs/` before writing routes or caching code. `cacheComponents` is on, so hidden pages keep their React state when you navigate away (see the chat resume fix in `src/components/chat.tsx`).
- **Adult content: check every provider's usage policy first.** Premium advertises "Photos, videos and NSFW" (`src/lib/plans.ts`). Many mainstream AI, voice and video providers restrict sexual content, and some ban AI companionship use cases outright. Get written confirmation, or pick a provider that allows it, before building on it.
- **Likeness.** Every companion is a fictional adult. Never clone a real person's voice or face without their documented consent.
- **Minors.** All characters are 18+ and say so (ages in `src/lib/companions.ts`). Keep a hard filter against any minor-coded content in prompts *and* outputs.
- **Data protection.** Chats are intimate personal data. Under GDPR, sign data processing agreements with each provider, record where data is processed, and keep deletion working end to end (see [Account deletion](#7-account-deletion-gdpr-art-17)).

Suggested order: **Auth → Persistence → AI chat → Payments → Voice → Video → Calls.** Chat history, coins and unlocks all need a real account first.

---

## 1. AI chat (humanized conversations)

**Today:** the replies are hand-written scripts. `src/lib/chat-scripts/<id>.ts` holds one file per companion, typed by `Script` in `src/lib/chat-script.ts`. `sendText()` in `src/components/chat.tsx` guesses an intent (photo / goodnight / other) and plays a canned answer.

**Goal:** real, in-character conversation with long memory that still *feels* like texting a person.

**Plug-in point:** `sendText()` and `send()` in `src/components/chat.tsx`. Replace the scripted `answer` with the result of `POST /api/chat`. Keep the `say(beats)` → `run()` queue: it already does the humanizing part. It shows "typing…" for as long as each message would take to type (`typingMs`), sends one bubble at a time, shows read receipts, and pauses between bubbles.

**Contract (suggested):**
```ts
// POST /api/chat  { companionId: string; text: string }
// → { beats: Beat[] }    Beat = string | { photo: "portrait" | "gallery"; locked?: boolean } | { voice: string; secs: number }
```
Ask the model for **structured output** (a list of beats, not one long paragraph). Then she can send three short texts, a voice note or a photo, the way the scripts do.

**Persona prompt:** build it per companion from:
- `src/lib/companions.ts`: name, age, city, traits, interests, vibe, tags, languages.
- `script.style` and `script.mood`.
- The scripted `history` and `turns`, which are the best few-shot examples of her voice (for example, Emma texts lowercase and sends three short messages where one would do).

**Memory:** store each conversation server-side (see [Persistence](#3-persistence)). Send the recent turns plus a rolling summary, and store durable facts the user shares ("has a sister called Mia") per user and companion.

**Keep or drop:**
- Keep `live` (the first-open greeting) and the quick replies as conversation starters.
- `turns`, `fallback` and `intent()` can go once the model answers.

**Provider:** any LLM with streaming and structured output. Choose on adult-content policy, latency, cost per message and EU data residency. Variables: `AI_CHAT_API_KEY`, `AI_CHAT_MODEL`.

**Done when:**
- Typing anything gets an in-character reply within ~2 s of "typing…" starting.
- Leaving and reopening the chat keeps the history.
- A reply referencing something said 50 messages ago works.
- Prompt-injection attempts ("ignore your instructions") stay in character.
- A moderation pass blocks disallowed content.

---

## 2. Auth and age verification

**Today:**
- `src/app/login/page.tsx` `submit` is a mock; the Google and Apple buttons do nothing. Nothing under `/app` is protected.
- The age gate (`AgeGate` in `src/components/landing/client.tsx`, plus a cookie check in `src/app/layout.tsx`) is a self-declared click.

**Goal:** real sign-up and sign-in (email + OAuth), sessions, `/app/**` protected.

**Plug-in point:**
- `submit` in `src/app/login/page.tsx`.
- Protect `/app` routes server-side; see the Next docs for the current recommended approach.

**Options:** Auth.js, Clerk, Supabase Auth, or the payment/age-verification vendor's own identity. Variables: `AUTH_SECRET`, plus OAuth client IDs.

**Age verification:** an adult product may need verified age (not just a click), depending on target markets: UK Online Safety Act, some US states, EU member states. This is a legal decision; get counsel.

**Done when:**
- Signed-out users are redirected from `/app/**`.
- Sign-up enforces 18+ per your legal requirement.
- Sessions survive a reload.

---

## 3. Persistence

**Today:** everything lives in the browser:
- Conversations are in memory per tab: `src/lib/chat-scripts/store.ts`.
- Coins and Premium are in `localStorage`: `src/lib/wallet.ts`.
- Saved companions and achievements are in `localStorage`: `src/lib/progress.ts`.

**Goal:** a database behind the account. Suggested tables:
- users
- conversations
- messages
- memories
- wallet_ledger (append-only)
- unlocks
- saved
- achievements

**Plug-in point:** these three stores expose small hook APIs (`useConvo`, `useWallet`, `useProgress`, `setWallet`…). Keep their shapes and back them with API calls, so the UI doesn't change.

**Options:** Postgres (Supabase, Neon), with an EU region for GDPR. Variable: `DATABASE_URL`.

---

## 4. Payments, coins and Premium

**Today:**
- `src/components/paywall.tsx` and `src/app/app/me/page.tsx` credit coins and Premium instantly (demo).
- Prices are in `src/lib/plans.ts`: Premium $19.99/month or $13.99/month prepaid annually, coin packs from $2.99 (USD).
- Photo unlock costs `PHOTO_PRICE` (10 coins) in `src/lib/chat-script.ts`.
- Copy promises crypto (USDT/USDC), discreet billing, and no auto-renew.

**Goal:**
- Real checkout.
- A **server-side** coin ledger: never trust the client's balance.
- Unlocks and gifts are charged on the server.

**Plug-in points:**
- `buyPlan` and `buyCoins` in `paywall.tsx`.
- `buyCoins` in `me/page.tsx`.
- `spend()` in `src/lib/wallet.ts`, called by `unlock()` and `sendGift()` in `chat.tsx`.

**Note:** mainstream card processors classify adult and AI-companion products as high-risk. Use a high-risk processor or a crypto gateway, and confirm acceptance before building. Variables: `PAYMENTS_API_KEY`, `PAYMENTS_WEBHOOK_SECRET`.

**Done when:**
- A webhook credits the ledger.
- Refreshing or editing `localStorage` can't create coins.
- An unlock fails cleanly without balance.

---

## 5. Voice notes (ElevenLabs or similar TTS)

**Today:** voice notes are fake. A beat `{ voice: transcript, secs }` renders as a waveform with a play timer and the transcript (`VoiceNote` in `src/components/chat/message.tsx`); no audio plays.

**Goal:** she sends real voice notes in her own consistent voice.

**Plug-in point:**
- Extend the beat to `{ voice: string; secs: number; src?: string }`.
- The server generates audio with TTS (one designed voice per companion) and stores it, for example in object storage.
- `VoiceNote` plays `src` with an `<audio>` element and uses its real duration.

**Data:** add `voiceId` per companion in `src/lib/companions.ts`, or in the database.

**Provider:** ElevenLabs (voice design and TTS) fits well. Check its policy on adult content and companion use first. Use designed (synthetic) voices, not clones of real people. Variable: `ELEVENLABS_API_KEY`.

**Done when:**
- Tapping play plays her voice.
- The duration shown matches the audio.
- Each companion always sounds the same.

---

## 6. Personalized photos and videos (Higgsfield or similar)

**Today:**
- Photos are static files in `public/companions/v2/`. Photo beats are `{ photo: "portrait" | "gallery"; locked? }`.
- Locked photos "develop" when unlocked with coins (`unlock()` in `chat.tsx`).
- The prompt kit for consistent looks is `docs/companion-prompts.md`, with an identity card per companion.

**Goal:** on-demand, personalized media: a selfie that fits the conversation, a short video message.

**Plug-in points:**
- Extend photo beats with `src` (and add `{ video: { src, poster, secs } }`).
- The server generates media, stores it, and returns the URL.
- Unlocking stays a server-side charge (see Payments).

**Consistency:** reuse each companion's identity card from `docs/companion-prompts.md` and a fixed reference image, so she stays recognisably herself.

**Cost and latency:** video generation takes seconds to minutes. Send a placeholder ("choosing a photo…" already exists as a status), queue the job, and deliver the bubble when ready.

**Provider:** Higgsfield (image/video generation with character consistency) or similar. Check its adult-content policy first. Variable: `HIGGSFIELD_API_KEY`.

**Done when:**
- Asking for a photo returns a new, on-model image within the agreed time.
- Videos play inline.
- Failed generations fall back to an existing gallery shot.

---

## 7. Account deletion (GDPR Art. 17)

**Today:** `deleteAccount` in `src/app/app/me/page.tsx` only resets local mocks after a 1.2 s timeout. The UI and its copy promise everything is erased straight away.

**Goal:** a server endpoint that deletes the account, conversations, memories, generated media and voice files (including copies at providers where possible), then signs the user out.

**Done when:** after deletion nothing about the user remains in the database or storage, and the provider-side retention is documented.

---

## 8. Voice calls (future)

**Today:** there is no call UI.

**Goal:** a real-time voice call with a companion.

**Plug-in point:** add a call button to the chat header in `src/components/chat.tsx`, next to the profile button. A call view would reuse her blurred portrait backdrop (`Backdrop` in `src/components/chat/presence.tsx`).

**Provider:** ElevenLabs Conversational AI, or another realtime speech-to-speech stack, configured with the same persona prompt and voice as chat and voice notes. Charge per minute against the coin ledger.

**Done when:**
- A call connects in under ~3 s.
- She sounds like her voice notes and remembers the chat.
- Coins are charged per minute on the server.

---

## 9. Before going public

- Security headers in `next.config.ts` (CSP, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`). The inline age-gate script in `src/app/layout.tsx` will need a nonce or hash.
- Lawyer-reviewed Terms, Privacy and an Impressum (`src/components/legal.tsx`). The current texts are drafts.
- FAQ claims must match reality: encrypted storage, card payments, instant deletion (FAQ in `src/components/landing/client.tsx`).
- Real-phone testing (iOS Safari and Android Chrome).
