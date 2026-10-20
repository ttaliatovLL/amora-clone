"use client";

import { useSyncExternalStore } from "react";

export type Density = 1 | 2;

// The member's board density, remembered per browser. 2 = the board (default), 1 = big cards.
const KEY = "amora_board_density";
const listeners = new Set<() => void>();
let current: Density | null = null;

function read(): Density {
  if (current) return current;
  try {
    current = localStorage.getItem(KEY) === "1" ? 1 : 2;
  } catch {
    current = 2;
  }
  return current;
}

export function setDensity(d: Density) {
  current = d;
  try {
    localStorage.setItem(KEY, String(d));
  } catch {}
  listeners.forEach((l) => l());
}

export function useDensity() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    read,
    () => 2 as Density,
  );
}

/** Board grid inside the page gutters: 2 / 3 / 4 / 5 columns by default, half as many in big-card mode. */
export const boardGrid: Record<Density, string> = {
  1: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4",
  2: "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 2xl:grid-cols-5",
};

/** True only after hydration: lets client-only state (saved board) render without a flash of the wrong state. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
