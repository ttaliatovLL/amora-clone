"use client";

import { useSyncExternalStore } from "react";

export type Density = 1 | 2;

// The member's board density, remembered per browser. 1 = one big card per row on phones, 2 = tiles.
const KEY = "amora_density";
const listeners = new Set<() => void>();
let current: Density | null = null;

function read(): Density {
  if (current) return current;
  try {
    current = localStorage.getItem(KEY) === "2" ? 2 : 1;
  } catch {
    current = 1;
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
    () => 1 as Density,
  );
}

/** Board grid: edge to edge with a 3px gutter on phones, 3 large columns on desktop (4 in tile mode). */
export const boardGrid: Record<Density, string> = {
  1: "grid grid-cols-1 gap-[3px] md:grid-cols-2 md:gap-1 lg:grid-cols-3",
  2: "grid grid-cols-2 gap-[3px] md:grid-cols-3 md:gap-1 lg:grid-cols-4",
};

/** True only after hydration: lets client-only state (saved board) render without a flash of the wrong state. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
