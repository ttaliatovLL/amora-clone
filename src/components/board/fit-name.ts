import type { CSSProperties } from "react";

// Panchang 700 advance widths (em, with the display tracking) per capital; measured in the browser.
const W: Record<string, number> = {
  A: 1.16, B: 1.06, C: 1.01, D: 1.12, E: 0.99, F: 0.97, G: 1.06, H: 1.08, I: 0.29, J: 0.69, K: 1.07, L: 0.93, M: 1.39,
  N: 1.11, O: 1.17, P: 1.03, Q: 1.17, R: 1.04, S: 0.99, T: 1.05, U: 1.05, V: 1.15, W: 1.63, X: 1.21, Y: 1.11, Z: 1.07, " ": 0.26,
  // Estimated, not measured.
  "-": 0.62, "'": 0.3, ".": 0.32,
};
/** Width of a name set in display type, in em. Accents count as their base letter; unknown characters as the widest normal capital. */
const ems = (name: string) => [...name.toUpperCase()].reduce((sum, ch) => sum + (W[ch] ?? W[ch.normalize("NFD")[0]] ?? 1.25), 0) * 1.04;

/** Widest line when the name may wrap onto `lines` lines at spaces or after hyphens (estimate, with slack for uneven breaks). */
const widest = (name: string, lines: number) => {
  if (lines < 2) return ems(name);
  const longest = Math.max(...name.split(/\s+|(?<=-)/).map(ems));
  return Math.max(longest, (ems(name) / lines) * 1.2);
};

/**
 * Sizes a name in display type to fill its container on one line (the parent needs Tailwind's `@container`).
 * `inset` is the horizontal padding inside that container, `max` the cap. `lines` > 1 lets a long
 * multi-word or hyphenated name wrap instead of shrinking to fit one line; a single word never breaks.
 */
export const fitName = (name: string, max = "10rem", inset = "2rem", lines = 1): CSSProperties => ({
  fontSize: `min(${max}, calc((100cqw - ${inset}) / ${widest(name, lines).toFixed(2)}))`,
});
