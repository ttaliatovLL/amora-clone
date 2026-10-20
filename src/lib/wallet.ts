"use client";

import { useSyncExternalStore } from "react";

// HANDOVER: keep useWallet/setWallet/spend as the UI API, back them with the server ledger. See docs/INTEGRATIONS.md#4-payments-coins-and-premium
// shortcut: per-browser mock wallet in localStorage; replace with the account API when payments are wired.
export type Wallet = { coins: number; premium: boolean; name: string; email: string };

const KEY = "amora_wallet";
const initial: Wallet = { coins: 100, premium: false, name: "You", email: "you@example.com" };
let state: Wallet = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

export function setWallet(patch: Partial<Wallet> | ((w: Wallet) => Partial<Wallet>)) {
  load();
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export function resetWallet() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  state = initial;
  listeners.forEach((l) => l());
}

/** Spend coins; returns false (and changes nothing) when the balance is short. */
export function spend(n: number) {
  load();
  if (state.coins < n) return false;
  setWallet({ coins: state.coins - n });
  return true;
}

export function useWallet() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => (load(), state),
    () => initial,
  );
}
