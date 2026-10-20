"use client";

import { useEffect, useState, type ReactNode } from "react";

/** The signature slow crossfade: her second photograph comes through, holds, and goes, on a loop. Still under reduced motion. */
export function Crossfade({ a, b, every = 5200 }: { a: ReactNode; b?: ReactNode; every?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!b || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((v) => !v), every);
    return () => clearInterval(t);
  }, [b, every]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {a}
      {b && (
        <div aria-hidden className={`absolute inset-0 transition-opacity duration-[1300ms] ease-in-out ${on ? "opacity-100" : "opacity-0"}`}>
          {b}
        </div>
      )}
    </div>
  );
}
