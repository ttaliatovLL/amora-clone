import { useId } from "react";
import type { Hair } from "@/lib/companions";

// Line-art placeholder portrait. Swap for <Image> once real photos exist; slot ratios stay the same.

const loops = (cx: number, cy: number, rx: number, ry: number, from: number, to: number, n: number) => {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
  });
  return pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
      const [px, py] = pts[i - 1];
      const r = (Math.hypot(x - px, y - py) / 2) * 1.15;
      return `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

const braid = (x: number, y0: number, y1: number) => {
  let d = "";
  for (let y = y0; y < y1; y += 20) d += `M${x - 11} ${y} C${x - 4} ${y + 13} ${x + 4} ${y + 13} ${x + 11} ${y} `;
  return d;
};

const HAIR: Record<Hair, string[]> = {
  wavy: [
    "M148 195 C140 140 168 104 200 104 C234 104 262 140 252 195",
    "M200 106 C188 128 172 150 158 178",
    "M150 175 C128 225 152 270 128 320 C112 356 134 388 118 430",
    "M162 205 C150 250 168 290 150 330 C138 360 152 392 144 428",
    "M250 175 C272 225 248 270 272 320 C288 356 266 388 282 430",
    "M240 205 C252 250 236 290 252 330 C262 360 250 392 258 428",
  ],
  straight: [
    "M148 195 C140 140 168 104 200 104 C234 104 262 140 252 195",
    "M200 104 C199 114 199 122 200 130",
    "M150 180 C142 250 138 330 134 440",
    "M162 210 C156 280 154 350 152 438",
    "M250 180 C258 250 262 330 266 440",
    "M240 210 C246 280 248 350 250 438",
  ],
  bob: [
    "M146 205 C136 140 168 102 200 102 C234 102 266 140 254 205",
    "M146 205 C142 250 148 285 172 292",
    "M254 205 C258 250 252 285 228 292",
    "M156 168 C182 182 220 182 246 166",
  ],
  bun: [
    "M152 190 C150 140 174 114 200 114 C228 114 250 140 248 190",
    "M226 88 A26 26 0 1 1 226 87.9",
    "M188 86 C192 74 212 76 212 90 C212 100 196 102 194 92",
    "M152 190 C148 210 150 222 156 232",
    "M248 190 C252 210 250 222 244 232",
  ],
  ponytail: [
    "M150 190 C146 138 172 108 200 108 C232 108 256 136 250 190",
    "M246 132 C256 128 262 134 260 142",
    "M258 138 C300 150 312 210 296 270 C288 300 300 330 312 350",
    "M262 146 C292 170 296 220 284 268",
  ],
  braids: [
    "M148 195 C140 140 168 104 200 104 C234 104 262 140 252 195",
    "M200 104 C199 114 199 122 200 130",
    "M150 185 C144 210 140 230 140 250",
    "M250 185 C256 210 260 230 260 250",
    braid(140, 250, 440),
    braid(260, 250, 440),
  ],
  curly: [loops(200, 205, 88, 118, 140, 400, 20), loops(200, 200, 70, 100, 200, 340, 9)],
};

const FACE = [
  "M150 190 C150 250 170 290 200 300 C230 290 250 250 250 190",
  "M178 292 C178 310 177 325 176 340",
  "M222 292 C222 310 223 325 224 340",
  "M176 340 C140 350 100 365 72 400 C60 430 54 470 50 500",
  "M224 340 C260 350 300 365 328 400 C340 430 346 470 350 500",
  "M165 365 C180 372 192 372 198 368",
  "M202 368 C208 372 220 372 235 365",
  "M168 216 C175 223 184 223 190 216",
  "M210 216 C216 223 225 223 232 216",
  "M166 201 C173 196 182 196 189 199",
  "M211 199 C218 196 227 196 234 201",
  "M200 222 C198 238 194 248 198 252 C201 254 205 253 207 251",
  "M186 271 C193 267 197 268 200 270 C203 268 207 267 214 271",
  "M186 271 C193 279 207 279 214 271",
];

type Props = {
  name: string;
  hair: Hair;
  wash: [string, string];
  /** "face" crops to the head for avatars. */
  crop?: "portrait" | "face";
  strokeWidth?: number;
  className?: string;
};

export function Sketch({ name, hair, wash, crop = "portrait", strokeWidth = 1.5, className }: Props) {
  const id = useId();
  return (
    <svg
      viewBox={crop === "face" ? "100 60 200 200" : "0 0 400 500"}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Sketch placeholder for ${name}`}
      className={className}
    >
      <defs>
        <radialGradient id={`${id}w`} cx="58%" cy="28%" r="85%">
          <stop offset="0" stopColor={wash[0]} />
          <stop offset="1" stopColor={wash[1]} />
        </radialGradient>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>
      <rect x="-50" y="-50" width="500" height="600" fill={`url(#${id}w)`} />
      <ellipse cx="214" cy="215" rx="105" ry="135" fill="#f0cfc6" opacity="0.18" filter={`url(#${id}b)`} />
      <g
        fill="none"
        stroke="#f4ebe6"
        strokeOpacity="0.88"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {[...FACE, ...HAIR[hair]].map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
