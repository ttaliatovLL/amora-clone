"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { achievements } from "@/lib/achievements";

// shortcut: per-browser mock progress in localStorage (like wallet.ts); move to the account API with the backend.
export type Progress = {
  saved: string[];
  viewed: string[];
  chattedWith: string[];
  messages: number;
  unlocks: number;
  gifts: number;
  voice: number;
  nightOwl: boolean;
  premium: boolean;
  days: string[];
  /** Achievement id → ISO date it was earned. */
  earned: Record<string, string>;
};

const KEY = "amora_progress";
const initial: Progress = { saved: [], viewed: [], chattedWith: [], messages: 0, unlocks: 0, gifts: 0, voice: 0, nightOwl: false, premium: false, days: [], earned: {} };
let state: Progress = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

/** Earned-achievement toasts are shown by components/toaster.tsx, which listens for this event. */
export const EARNED_EVENT = "amora:earned";
/** Client navigation requested from outside React (toast actions); handled by the Toaster with the router. */
export const NAVIGATE_EVENT = "amora:navigate";

function update(fn: (p: Progress) => Partial<Progress>) {
  load();
  const next = { ...state, ...fn(state) };
  const fresh = achievements.filter((a) => !next.earned[a.id] && a.value(next) >= a.target);
  if (fresh.length) next.earned = { ...next.earned, ...Object.fromEntries(fresh.map((a) => [a.id, new Date().toISOString()])) };
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
  fresh.forEach((a) => window.dispatchEvent(new CustomEvent(EARNED_EVENT, { detail: a.id })));
}

const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Save or unsave a companion to the member's board; returns whether she is now saved. */
export function toggleSaved(id: string, name: string) {
  load();
  const saved = !state.saved.includes(id);
  update((p) => ({ saved: saved ? [...p.saved, id] : p.saved.filter((x) => x !== id) }));
  if (saved) toast(`${name} is on your board`, { action: { label: "View", onClick: () => window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: "/app/saved" })) } });
  else toast(`${name} left your board`, { action: { label: "Undo", onClick: () => toggleSaved(id, name) } });
  return saved;
}

export const track = {
  visit: () => update((p) => ({ days: add(p.days, today()).slice(-60) })),
  view: (id: string) => update((p) => ({ viewed: add(p.viewed, id) })),
  message: (id: string) =>
    update((p) => ({ messages: p.messages + 1, chattedWith: add(p.chattedWith, id), nightOwl: p.nightOwl || new Date().getHours() < 5 })),
  unlock: () => update((p) => ({ unlocks: p.unlocks + 1 })),
  gift: () => update((p) => ({ gifts: p.gifts + 1 })),
  voice: () => update((p) => ({ voice: p.voice + 1 })),
  premium: () => update(() => ({ premium: true })),
};

export function resetProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  state = initial;
  listeners.forEach((l) => l());
}

export function useProgress() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => (load(), state),
    () => initial,
  );
}
