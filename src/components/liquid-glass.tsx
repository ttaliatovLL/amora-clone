"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ComponentPropsWithoutRef, type CSSProperties } from "react";

const BEZEL = 14; // px of curved rim; the centre stays flat and undistorted
const SCALE = 56; // feDisplacementMap scale: max pixel shift at the very edge ≈ SCALE / 2
const FALLBACK = "blur(18px) saturate(160%)";

// Only Chromium honours url() inside backdrop-filter; Safari/Firefox ignore the whole declaration.
// iOS Chrome/Edge ("CriOS"/"EdgiOS") are WebKit and do not match.
const isChromium = () => /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent);
const noop = () => () => {};

/** Displacement map for a rounded rect: R/G = x/y sample offset (128 = none), strongest at the rim, zero inside the bezel. */
function displacementMap(w: number, h: number, radius: number) {
  const r = Math.min(radius, w / 2, h / 2);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Rounded-rect SDF (same maths as liquid-glass-js roundedRectDistance), sampled at pixel centres.
      const px = x + 0.5 - cx, py = y + 0.5 - cy;
      const qx = Math.abs(px) - (cx - r), qy = Math.abs(py) - (cy - r);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const inside = -(outside + Math.min(Math.max(qx, qy), 0) - r); // distance in from the edge
      // Outward normal: radial in the corners, axis-aligned along the straight sides.
      let nx = 0, ny = 0;
      if (outside > 0) { nx = ox / outside; ny = oy / outside; } else if (qx > qy) nx = 1; else ny = 1;
      nx *= Math.sign(px) || 1;
      ny *= Math.sign(py) || 1;
      const t = Math.min(Math.max(1 - inside / BEZEL, 0), 1);
      const s = 1 - Math.sqrt(1 - t * t); // convex bezel: flat inside, steepest at the rim
      // Sample from further inside the shape, so the rim magnifies and bends what is behind it.
      const i = (y * w + x) * 4;
      img.data[i] = 128 - nx * s * 127;
      img.data[i + 1] = 128 - ny * s * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

type Props = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "nav";
  /** Corner radius in px; "pill" (or anything ≥ half the height) makes a capsule. */
  radius?: number | "pill";
};

/** Floating liquid-glass surface: live refracted backdrop in Chromium, frosted blur elsewhere. Children render crisp on top. */
export function LiquidGlass({ as: Tag = "div", className = "", radius = 9999, children, style, ...rest }: Props) {
  const id = `lg${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const chromium = useSyncExternalStore(noop, isChromium, () => false);
  const [map, setMap] = useState<{ w: number; h: number; href: string } | null>(null);
  const r = radius === "pill" ? 9999 : radius;

  useEffect(() => {
    const el = ref.current;
    if (!chromium || !el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (w && h) setMap((m) => (m && m.w === w && m.h === h ? m : { w, h, href: displacementMap(w, h, r) }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [chromium, r]);

  const filter = map ? `url(#${id}) blur(2px) saturate(150%)` : FALLBACK;

  return (
    <Tag ref={ref} className={`${/(^|\s)(fixed|absolute|sticky)(\s|$)/.test(className) ? "" : "relative "}isolate ${className}`} style={{ borderRadius: r, ...style }} {...rest}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [backdrop-filter:var(--lg-filter)] [-webkit-backdrop-filter:var(--lg-filter)] bg-[rgb(20_20_20/0.35)] shadow-[inset_0_1px_0_rgb(255_255_255/0.18),inset_0_0_0_1px_rgb(255_255_255/0.09),inset_0_10px_14px_-12px_rgb(255_255_255/0.3),inset_0_-1px_1px_rgb(0_0_0/0.25),0_10px_30px_-6px_rgb(0_0_0/0.55),0_2px_6px_rgb(0_0_0/0.3)] [@media(prefers-reduced-transparency:reduce)]:[backdrop-filter:none] [@media(prefers-reduced-transparency:reduce)]:[-webkit-backdrop-filter:none] [@media(prefers-reduced-transparency:reduce)]:bg-[#161616]"
        style={{ borderRadius: "inherit", "--lg-filter": filter } as CSSProperties}
      />
      {map && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter id={id} x="0" y="0" width={map.w} height={map.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map.href} x="0" y="0" width={map.w} height={map.h} preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={SCALE} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {children}
    </Tag>
  );
}
