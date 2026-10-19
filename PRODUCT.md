# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js App Router + Tailwind v4 + Motion, shipped as a mobile-first PWA (user choice, 2026-10-19).

## Users
Adults (18+) looking for an ongoing, private relationship with an AI companion. Mostly on a phone, alone, often late at night. Inferred from the current site's copy and screenshots: privacy and discreet billing matter a lot to them.

## Product Purpose
Amora offers handcrafted AI companions. Each one has a persona, remembers the conversation, and sends photos and videos. Success means a user picks a companion quickly, keeps coming back to talk, and understands what Premium unlocks without feeling squeezed.

## Positioning
Each companion is a written character (city, history, temperament, hobbies, a dog named Otto) with long memory, not a generic chatbot with a face.

## Operating Context
Age gate on entry. Discover companions → chat → media unlocks. Money: one Premium subscription is the hero; coins only for one-off unlocks and gifts (user decision). Payments are currently crypto (USDT/USDC) only.

## Capabilities and Constraints
- Account deletion must actually work (GDPR Art. 17); today it is a "Coming soon" stub.
- Companion imagery is the client's own content; this build uses AI-generated portraits of fictional adults (line-art sketch fallback), and every image slot is sized for real photos (4:5 portrait, 1:1 avatar, 9:16 story).
- Backend (auth, AI chat, payments) is mocked until the UI shell is approved.

## Brand Commitments
Name "Amora". Custom monoline lowercase wordmark plus a linked-rings steel glyph (user decision, 2026-10-19). Graphite + chrome palette: liquid glass, pearl primary action with metal rims, blush accent; gold only as a rim on Premium (user decision, 2026-10-19). Companion imagery is editorial-sensual fashion, no nudity (user decision, 2026-10-19).

## Evidence on Hand
Screenshots of the current site in `reference/screenshots/`. Companion names, taglines and traits come from the current site. Testimonials, member counts and press must not be invented.

## Product Principles
1. Private first: nothing a user does should feel exposed (billing, notifications, screen glances).
2. A relationship, not a paywall: locked content appears as an invitation, never a wall of prices.
3. One clear money decision at a time.
4. Built for one hand, at night.

## Accessibility & Inclusion
WCAG AA contrast on dark surfaces, honor reduced motion, full keyboard support on desktop.
