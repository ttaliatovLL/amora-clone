import type { Companion } from "@/lib/companions";

// shortcut: hand-written scripted conversations stand in for the AI backend; swap `fallback()` for an API call.

/** One thing she sends: a text, a photo (her portrait or her gallery shot, maybe locked), or a voice note with its transcript. */
export type Beat = string | { photo: "portrait" | "gallery"; locked?: boolean } | { voice: string; secs: number };
/** A message in the history: who, when (24h), what. */
export type Line = [who: "her" | "me", time: string, beat: Beat];
/** A quick reply: what you say, what she answers, and whether she hearts your message. */
export type Option = { say: string; her: Beat[]; heart?: boolean };

export type GiftId = "coffee" | "rose" | "book" | "vinyl" | "wine" | "champagne" | "bone";

export type Script = {
  /** Her city's time zone, for the local clock in the header. */
  tz: string;
  /** What she's doing right now, under her name in the header. */
  mood: string;
  /** How she texts, on the card at the top of the thread. */
  style: string;
  /** Today's moment in the inbox: one line over her gallery shot. */
  moment: string;
  /** Earlier days, oldest first. A day called "Today" holds messages waiting when you open the chat. */
  history: { day: string; lines: Line[] }[];
  /** How many of her last messages are unread in the inbox. */
  unread: number;
  /** Offline companions: "2h ago". */
  lastSeen?: string;
  /** What she sends live the first time you open the chat. */
  live: Beat[];
  /** The scripted conversation: each turn offers three quick replies; any choice leads to the next turn. */
  turns: Option[][];
  /** Her answer when you ask for a photo; ends with the locked gallery shot. */
  photo: Beat[];
  /** When you ask again after she already sent it. */
  photoAgain: Beat[];
  /** Her favourite gift gets a special reaction; the rest get `gift(name)`. */
  love: GiftId;
  loveReply: Beat[];
  gift: (name: string) => Beat[];
  /** In-character answers to anything typed that the script doesn't cover, used in turn. */
  fallback: Beat[][];
  /** Goodnight. */
  night: Beat[];
};

export const gifts: { id: GiftId; name: string; label: string; price: number }[] = [
  { id: "coffee", label: "Coffee", name: "Coffee", price: 5 },
  { id: "rose", label: "Rose", name: "A rose", price: 10 },
  { id: "book", label: "Book", name: "A book", price: 15 },
  { id: "bone", label: "Dog treat", name: "A treat for the dog", price: 15 },
  { id: "vinyl", label: "Record", name: "A record", price: 25 },
  { id: "wine", label: "Wine", name: "A bottle of wine", price: 30 },
  { id: "champagne", label: "Champagne", name: "Champagne", price: 50 },
];

export const PHOTO_PRICE = 10;

/** What free text is about, coarsely: enough to pick a believable answer. */
export function intent(text: string): "photo" | "night" | "fallback" {
  if (/photo|pic|selfie|show me|see you/i.test(text)) return "photo";
  if (/good ?night|\bgn\b|sleep|going to bed/i.test(text)) return "night";
  return "fallback";
}

export const beatText = (b: Beat, name: string) =>
  typeof b === "string" ? b : "voice" in b ? "Voice note" : b.locked ? `${name} sent a private photo` : "Photo";

/** How long she "types" a beat: proportional to its length, clamped so it never drags. */
export const typingMs = (b: Beat) =>
  typeof b === "string" ? Math.min(3200, Math.max(900, 450 + b.length * 38)) : "voice" in b ? Math.min(3600, 1400 + b.secs * 90) : 1700;

/** Her local time, "01:12". */
export const localTime = (tz: string, now: number) => new Date(now).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });

export const photoSrc = (c: Companion, which: "portrait" | "gallery") => (which === "gallery" ? (c.gallery[0] ?? c.photo) : c.photo);
