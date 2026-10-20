"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

// Loose enough to overshoot a touch on the way back, so the card settles instead of stopping.
const spring = { stiffness: 260, damping: 20, mass: 0.6 };

/**
 * The card's body. Mouse: leans up to ~3.5deg toward the pointer and her photo drifts a few pixels the other way
 * (transform only, springs back on leave). Any pointer: a small press. Reduced motion: neither, just the press.
 * Also fades her photo in once it has loaded, over the card's own wash colour, instead of painting in line by line.
 */
export function CardTilt({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, (v) => v * 7), spring);
  const rotateX = useSpring(useTransform(py, (v) => v * -7), spring);
  const shift = useSpring(useTransform(px, (v) => v * -8), spring);
  const lift = useSpring(useTransform(py, (v) => v * -8), spring);

  useEffect(() => {
    const img = ref.current?.querySelector<HTMLImageElement>("img.crossfade-a");
    const layer = img?.parentElement;
    if (!img || !layer || img.complete) return;
    layer.style.opacity = "0";
    const done = () => {
      layer.style.transition = "opacity 600ms var(--ease-out)";
      layer.style.opacity = "1";
    };
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    };
  }, []);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900, ["--shift-x" as string]: shift, ["--shift-y" as string]: lift }}
    >
      {children}
    </motion.div>
  );
}
