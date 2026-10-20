"use client";

import { useSyncExternalStore } from "react";
import type { Beat, GiftId } from "@/lib/chat-script";
import { scripts } from "./index";

// HANDOVER: persistence. Keep useConvo/setConvo as the UI API, back them with the conversations/messages tables. See docs/INTEGRATIONS.md#3-persistence
// shortcut: conversations live in memory for this tab only; move to the account API with the backend.
export type Msg = {
  id: number;
  from: "her" | "me";
  day: string;
  time: string;
  beat: Beat | { gift: GiftId };
  /** Locked photo paid for. */
  unlocked?: boolean;
  /** A heart on the bubble: mine on her messages, hers on mine. */
  heart?: boolean;
};

export type Convo = {
  msgs: Msg[];
  /** Next scripted turn. */
  turn: number;
  /** Last of my messages she has read, and when. */
  readUpTo: number;
  readAt: string;
  unread: number;
  opened: boolean;
  photoSent: boolean;
  fallback: number;
  /** Last activity (ms) for inbox order; 0 = scripted order. */
  touched: number;
};

const initial: Record<string, Convo> = {};
let convos: Record<string, Convo> = {};
const listeners = new Set<() => void>();

function seed(id: string): Convo {
  if (initial[id]) return initial[id];
  const s = scripts[id];
  let n = 0;
  const msgs: Msg[] = (s?.history ?? []).flatMap((d) => d.lines.map(([from, time, beat]) => ({ id: n++, from, day: d.day, time, beat, unlocked: true })));
  const lastMine = msgs.findLast((m) => m.from === "me");
  return (initial[id] = {
    msgs,
    turn: 0,
    readUpTo: lastMine?.id ?? -1,
    readAt: msgs.find((m) => m.from === "her" && lastMine && m.id > lastMine.id)?.time ?? lastMine?.time ?? "",
    unread: s?.unread ?? 0,
    opened: false,
    photoSent: false,
    fallback: 0,
    touched: 0,
  });
}

export const getConvo = (id: string) => convos[id] ?? seed(id);

export function setConvo(id: string, fn: (c: Convo) => Partial<Convo>) {
  const c = getConvo(id);
  convos = { ...convos, [id]: { ...c, ...fn(c) } };
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));

export function useConvo(id: string) {
  return useSyncExternalStore(subscribe, () => getConvo(id), () => seed(id));
}

const empty: Record<string, Convo> = {};
/** Every touched conversation; untouched ones read from their script via getConvo. */
export function useConvos() {
  return useSyncExternalStore(subscribe, () => convos, () => empty);
}
