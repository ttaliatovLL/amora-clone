"use client";

import { X } from "@phosphor-icons/react/ssr";
import { AnimatePresence, MotionConfig, motion, useDragControls } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};
const DESKTOP = "(min-width: 768px)";
const subscribeDesktop = (l: () => void) => {
  const m = matchMedia(DESKTOP);
  m.addEventListener("change", l);
  return () => m.removeEventListener("change", l);
};
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Square-topped bottom sheet on phones (drag the handle down to dismiss), centred square dialog on desktop.
 * Escape closes, Tab stays inside, focus returns to whatever opened it. Content sits under a 2rem top pad;
 * full-bleed headers (the paywall's silk) pull up with `-mt-8 -mx-5 md:-mx-8`.
 */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  // Portal to body so the sheet always sits above the app chrome, whatever stacking context opened it.
  const client = useSyncExternalStore(noop, () => true, () => false);
  const desktop = useSyncExternalStore(subscribeDesktop, () => matchMedia(DESKTOP).matches, () => false);
  // Latest onClose without re-running the open effect (which would steal focus on every parent render).
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close.current();
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return e.preventDefault();
      const first = items[0], last = items[items.length - 1];
      const at = document.activeElement;
      const to = e.shiftKey ? (at === first || at === panel.current ? last : null) : at === last ? first : null;
      if (to) {
        e.preventDefault();
        to.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus();
    };
  }, [open]);

  if (!client) return null;
  // Calm in, quick out: springs with no bounce to open, a short drawer curve to leave.
  const leave = { duration: desktop ? 0.16 : 0.26, ease: [0.32, 0.72, 0, 1] } as const;
  const motionProps = desktop
    ? { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.98, transition: leave }, transition: { type: "spring", duration: 0.4, bounce: 0 } as const }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%", transition: leave }, transition: { type: "spring", duration: 0.45, bounce: 0 } as const };

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
            <motion.div
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.div
              key={desktop ? "dialog" : "sheet"}
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className="relative max-h-[90dvh] w-full max-w-lg overflow-x-hidden overflow-y-auto overscroll-contain bg-ink-2 px-5 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-float)] outline-none! md:max-h-[86dvh] md:px-8 md:pb-8"
              {...motionProps}
              drag={desktop ? false : "y"}
              dragListener={false}
              dragControls={drag}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.04, bottom: 0.6 }}
              onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 500) && close.current()}
            >
              {/* Phones: the drag strip overlays the top 2rem, so the sheet body scrolls normally on touch. */}
              <div onPointerDown={(e) => drag.start(e)} className="absolute inset-x-0 top-0 z-10 flex h-8 cursor-grab touch-none justify-center pt-3 active:cursor-grabbing md:hidden">
                <span className="h-1 w-10 bg-paper/30" aria-hidden />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="press absolute top-3 right-3 z-10 hidden size-10 place-items-center bg-ink/40 text-paper hover:bg-ink-4 md:grid"
              >
                <X className="size-5" aria-hidden />
              </button>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
