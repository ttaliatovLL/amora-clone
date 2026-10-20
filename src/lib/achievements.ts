// The record: small milestones a member earns by using Amora. Pure data; progress lives in lib/progress.ts.
import type { Progress } from "@/lib/progress";
import { companions } from "@/lib/companions";

export type Achievement = {
  id: string;
  title: string;
  /** What earns it, in one short sentence. */
  how: string;
  /** Phosphor icon name, resolved in components/achievement-icon.tsx. */
  icon: "ChatCircle" | "Chats" | "Moon" | "Eye" | "BookmarkSimple" | "Aperture" | "Gift" | "GlobeHemisphereWest" | "Cards" | "CalendarCheck" | "Crown" | "Waveform";
  target: number;
  value: (p: Progress) => number;
};

const vibeOf = Object.fromEntries(companions.map((c) => [c.id, c.vibe]));
const cityOf = Object.fromEntries(companions.map((c) => [c.id, c.city]));

export const achievements: Achievement[] = [
  { id: "first-words", title: "First words", how: "Send your first message.", icon: "ChatCircle", target: 1, value: (p) => p.messages },
  { id: "scout", title: "Scout", how: "Open five profiles.", icon: "Eye", target: 5, value: (p) => p.viewed.length },
  { id: "your-board", title: "Your board", how: "Save three companions.", icon: "BookmarkSimple", target: 3, value: (p) => p.saved.length },
  { id: "night-owl", title: "Night owl", how: "Talk to someone after midnight.", icon: "Moon", target: 1, value: (p) => (p.nightOwl ? 1 : 0) },
  { id: "heard", title: "Heard", how: "Play a voice note.", icon: "Waveform", target: 1, value: (p) => p.voice },
  { id: "developed", title: "Developed", how: "Unlock a private photo.", icon: "Aperture", target: 1, value: (p) => p.unlocks },
  { id: "generous", title: "Generous", how: "Send a gift.", icon: "Gift", target: 1, value: (p) => p.gifts },
  { id: "regular", title: "Regular", how: "Send fifty messages.", icon: "Chats", target: 50, value: (p) => p.messages },
  { id: "around-the-world", title: "Around the world", how: "Talk to companions in three cities.", icon: "GlobeHemisphereWest", target: 3, value: (p) => new Set(p.chattedWith.map((id) => cityOf[id])).size },
  { id: "full-house", title: "Full house", how: "Talk to one companion of every vibe.", icon: "Cards", target: 4, value: (p) => new Set(p.chattedWith.map((id) => vibeOf[id])).size },
  { id: "three-nights", title: "Three nights", how: "Come back three days in a row.", icon: "CalendarCheck", target: 3, value: (p) => streak(p.days) },
  { id: "member", title: "Member", how: "Join Premium.", icon: "Crown", target: 1, value: (p) => (p.premium ? 1 : 0) },
];

/** Longest run of consecutive days ending today or yesterday. Days are local YYYY-MM-DD strings. */
export function streak(days: string[]) {
  const set = new Set(days);
  const d = new Date();
  const key = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
