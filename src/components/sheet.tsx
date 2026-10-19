"use client";

import { AnimatePresence, MotionConfig, motion, useDragControls } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};

// Bottom sheet: springs in, drags down to dismiss, Escape closes, focus moves in and back out.
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  // Portal to body so the sheet always sits above the app chrome, whatever stacking context opened it.
  const client = useSyncExternalStore(noop, () => true, () => false);
  // Latest onClose without re-running the open effect (which would steal focus on every parent render).
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus();
    };
  }, [open]);

  if (!client) return null;
  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              className="absolute inset-0 bg-black/55 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className="grain panel relative max-h-[88dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-sheet border-t border-white/15 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift focus:outline-none"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.14 }}
              drag="y"
              dragListener={false}
              dragControls={drag}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.6 }}
              onDragEnd={(_, i) => (i.offset.y > 110 || i.velocity.y > 500) && close.current()}
            >
              {/* Drag starts only from the handle strip, so the sheet body scrolls normally on touch. */}
              <div
                onPointerDown={(e) => drag.start(e)}
                className="sticky top-0 z-10 -mx-5 flex cursor-grab touch-none justify-center pt-3 pb-4 active:cursor-grabbing"
              >
                <span className="h-1 w-9 rounded-full bg-white/25" aria-hidden />
              </div>
              <div className="relative z-[2]">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
